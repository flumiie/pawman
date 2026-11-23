// PawMan Tauri backend – local Argon2 auth, no email/2FA.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use serde::{Deserialize, Serialize};
use tauri::State;
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use argon2::password_hash::{PasswordHasher, SaltString};

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

#[derive(Clone, Serialize, Deserialize, Default)]
struct UserStore {
    users: Vec<UserRecord>,
}

#[derive(Serialize, Deserialize, Clone)]
struct UserRecord {
    identifier: String, // email or username, always stored lowercase
    password_hash: String, // full argon2 hash string
}

struct AppState {
    store: Mutex<UserStore>,
}

// ---------------------------------------------------------------------------
// Persistence helper
// ---------------------------------------------------------------------------

fn users_file_path() -> std::path::PathBuf {
    let app_name = "pawman";
    if let Ok(appdata) = std::env::var("APPDATA") {
        let mut path = std::path::PathBuf::from(appdata);
        path.push(app_name);
        std::fs::create_dir_all(&path).ok();
        path.push(format!("{}.json", app_name));
        return path;
    }
    if let Ok(home) = std::env::var("HOME") {
        let mut path = std::path::PathBuf::from(home);
        if cfg!(target_os = "macos") {
            path.push("Library/Application Support");
        } else {
            path.push(".config");
        }
        path.push(app_name);
        std::fs::create_dir_all(&path).ok();
        path.push(format!("{}.json", app_name));
        return path;
    }
    std::path::PathBuf::from(format!("{}.json", app_name))
}

fn load_store(path: &std::path::Path) -> UserStore {
    if let Ok(contents) = std::fs::read_to_string(path) {
        if let Ok(store) = serde_json::from_str::<UserStore>(&contents) {
            return store;
        }
    }
    UserStore::default()
}

fn save_store(path: &std::path::Path, store: &UserStore) -> Result<(), String> {
    let contents = serde_json::to_string_pretty(store)
        .map_err(|e| e.to_string())?;
    std::fs::write(path, contents).map_err(|e| e.to_string())?;
    Ok(())
}

// ---------------------------------------------------------------------------
// Tauri commands
// ---------------------------------------------------------------------------

/// Register a new user. Returns false if the identifier is taken or inputs are invalid.
#[tauri::command]
fn register_user(
    identifier: String,
    password: String,
    state: State<'_, AppState>,
) -> Result<bool, String> {
    let identifier = identifier.trim().to_lowercase();
    if identifier.is_empty() || password.len() < 6 {
        return Ok(false);
    }

    let salt = SaltString::generate(&mut rand::thread_rng());
    let hash = Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .map_err(|e| e.to_string())?
        .to_string();

    {
        let mut store = state.store.lock().unwrap();
        if store.users.iter().any(|u| u.identifier == identifier) {
            return Ok(false);
        }
        store.users.push(UserRecord {
            identifier: identifier.clone(),
            password_hash: hash,
        });
    }

    save_store(&users_file_path(), &state.store.lock().unwrap())
        .map(|_| true)
}

/// Login with an identifier and password. Returns true on success.
#[tauri::command]
fn login_user(
    identifier: String,
    password: String,
    state: State<'_, AppState>,
) -> Result<bool, String> {
    let identifier = identifier.trim().to_lowercase();
    if identifier.is_empty() || password.is_empty() {
        return Ok(false);
    }

    let store = state.store.lock().unwrap();
    match store
        .users
        .iter()
        .find(|u| u.identifier == identifier)
    {
        Some(rec) => {
            let parsed = PasswordHash::new(&rec.password_hash)
                .map_err(|e| e.to_string())?;
            Argon2::default()
                .verify_password(password.as_bytes(), &parsed)
                .map(|_| true)
                .map_err(|e| e.to_string())
        }
        None => Ok(false),
    }
}

/// Clear any session-state flags on logout.
#[tauri::command]
fn clear_session(_state: State<'_, AppState>) {}

// ---------------------------------------------------------------------------
// App entry point
// ---------------------------------------------------------------------------

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let initial_store = load_store(&users_file_path());

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            store: Mutex::new(initial_store),
        })
        .invoke_handler(tauri::generate_handler![
            register_user,
            login_user,
            clear_session,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
