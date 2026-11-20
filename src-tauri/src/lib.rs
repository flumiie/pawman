// PawMan Tauri backend – all application logic lives here.
// Main entry: src/main.rs simply calls pawman_lib::run().

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;
use std::sync::Mutex;
use std::time::{Duration, Instant};

use lettre::message::{MultiPart, SinglePart};
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Address, Message, SmtpTransport, Transport};
use rand::Rng;
use serde::{Deserialize, Serialize};
use tauri::State;

// ---------------------------------------------------------------------------
// Config & response types
// ---------------------------------------------------------------------------

/// SMTP connection settings, populated from env vars at startup.
///   PAWMAN_SMTP_HOST     e.g. smtp.resend.com
///   PAWMAN_SMTP_PORT     default 587
///   PAWMAN_SMTP_USERNAME your SMTP username / API key
///   PAWMAN_SMTP_PASSWORD your SMTP password
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EmailConfig {
    pub host: String,
    pub port: u16,
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct SendCodeResponse {
    pub ok: bool,
    pub message: Option<String>,
}

// ---------------------------------------------------------------------------
// In-process 2FA code store
// ---------------------------------------------------------------------------

struct PendingCode {
    code: String,
    expires_at: Instant,
}

thread_local! {
    static CODES: Mutex<HashMap<String, PendingCode>> = Mutex::new(HashMap::new());
}

fn generate_code() -> String {
    let mut rng = rand::thread_rng();
    format!("{:06}", rng.gen_range(0..1_000_000))
}

fn store_code(email: &str) {
    let code = generate_code();
    CODES.with(|lock| {
        lock.lock().unwrap().insert(
            email.to_lowercase(),
            PendingCode {
                code,
                expires_at: Instant::now() + Duration::from_secs(5 * 60),
            },
        );
    });
}

fn get_code(email: &str) -> Option<String> {
    CODES.with(|lock| lock.lock().unwrap().get(email).map(|e| e.code.clone()))
}

fn remove_code(email: &str) {
    CODES.with(|lock| lock.lock().unwrap().remove(email));
}

/// Remove expired entries for *email*. Returns true if one existed and was pruned.
fn prune_expired(email: &str) -> bool {
    CODES.with(|lock| {
        let mut map = lock.lock().unwrap();
        if let Some(entry) = map.get(email) {
            if entry.expires_at < Instant::now() {
                map.remove(email);
                return true;
            }
        }
        false
    })
}

// ---------------------------------------------------------------------------
// SMTP sender (blocking inside Tokio's runtime)
// ---------------------------------------------------------------------------

fn do_send_email(cfg: &EmailConfig, recipient: &str, code: &str) -> Result<(), String> {
    if cfg.host.is_empty() || cfg.username.is_empty() || cfg.password.is_empty() {
        return Err(
            "SMTP not configured. Set PAWMAN_SMTP_HOST / _USERNAME / _PASSWORD."
                .to_string(),
        );
    }

    // Blocking send on the current Tokio runtime.
    // Tauri commands already run inside a Tokio context, so spawn_blocking is safe.
    tokio::task::block_in_place(|| {
        let creds = Credentials::new(cfg.username.clone(), cfg.password.clone());

        let transport = SmtpTransport::relay(&cfg.host)
            .map_err(|e| format!("bad relay host '{}': {e}", cfg.host))?
            .port(cfg.port)
            .credentials(creds)
            .build();

        let text_body = format!(
            "Your PawMan two-factor authentication code is:\n\n    {code}\n\n\
             This code expires in 5 minutes. Do not share it with anyone.",
        );
        let html_body = format!(
            "<h2>Your PawMan verification code</h2>\n<p><strong>{code}</strong></p>\n\
             <p>This code expires in 5 minutes.</p>",
        );

        let message = Message::builder()
            .from(
                Address::new("no-reply@pawman.app", "PawMan Security")
                    .map_err(|e| e.to_string())?
                    .into(),
            )
            .reply_to(cfg.username.parse::<Address>().map_err(|e| e.to_string())?.into())
            .to(recipient.parse::<Address>().map_err(|e| e.to_string())?.into())
            .subject("Your PawMan verification code")
            .multipart(
                MultiPart::alternative()
                    .singlepart(SinglePart::plain(text_body))
                    .singlepart(SinglePart::html(html_body)),
            )
            .map_err(|e| e.to_string())?;

        transport.send(&message).map_err(|e| e.to_string())?;
        Ok(())
    })
}

// ---------------------------------------------------------------------------
// Tauri commands
// ---------------------------------------------------------------------------

/// Generate a fresh 6-digit code and email it to *email*.
#[tauri::command]
async fn send_2fa_code(
    email: String,
    email_config: State<'_, EmailConfig>,
) -> Result<SendCodeResponse, String> {
    let email_key = email.trim().to_lowercase();
    if email_key.is_empty() {
        return Ok(SendCodeResponse {
            ok: false,
            message: Some("No email provided.".into()),
        });
    }
    store_code(&email_key);
    let sent_code = get_code(&email_key).unwrap_or_default();

    match do_send_email(&email_config, &email_key, &sent_code) {
        Ok(()) => Ok(SendCodeResponse {
            ok: true,
            message: None,
        }),
        Err(msg) => {
            eprintln!("send_2fa_code ({email_key}): {msg}");
            Ok(SendCodeResponse {
                ok: false,
                message: Some(msg),
            })
        }
    }
}

/// Verify the code the user submitted against the one stored for *email*.
/// Deletes the entry on success so each code can be used only once.
#[tauri::command]
async fn verify_2fa_code(email: String, code: String) -> Result<bool, String> {
    let email_lower = email.trim().to_lowercase();
    if email_lower.is_empty() || code.is_empty() {
        return Ok(false);
    }
    prune_expired(&email_lower);
    match get_code(&email_lower) {
        Some(expected) if code.trim() == expected.trim() => {
            remove_code(&email_lower);
            Ok(true)
        }
        _ => Ok(false),
    }
}

/// Erase all pending codes — called on logout.
#[tauri::command]
fn flush_codes() {
    CODES.with(|lock| lock.lock().unwrap().clear());
}

// ---------------------------------------------------------------------------
// App entry point
// ---------------------------------------------------------------------------

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(EmailConfig {
            host: std::env::var("PAWMAN_SMTP_HOST").unwrap_or_default(),
            port: std::env::var("PAWMAN_SMTP_PORT")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(587),
            username: std::env::var("PAWMAN_SMTP_USERNAME").unwrap_or_default(),
            password: std::env::var("PAWMAN_SMTP_PASSWORD").unwrap_or_default(),
        })
        .invoke_handler(tauri::generate_handler![
            send_2fa_code,
            verify_2fa_code,
            flush_codes,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
