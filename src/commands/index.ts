/** Expose Rust-side auth commands to the React layer. */
import { invoke } from "@tauri-apps/api/core"

export const registerUser = (identifier: string, password: string): Promise<boolean> =>
  invoke<boolean>("register_user", { identifier, password })

export const loginUser = (identifier: string, password: string): Promise<boolean> =>
  invoke<boolean>("login_user", { identifier, password })

export const clearSession = (): Promise<void> =>
  invoke<void>("clear_session")
