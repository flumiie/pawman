/** Expose Rust-side auth commands to the React layer. */
import { invoke } from "@tauri-apps/api/core"

export interface UserInfo {
  identifier: string
  first_name: string
  last_name: string
}

export const registerUser = (
  identifier: string,
  password: string,
  first_name: string,
  last_name: string,
): Promise<boolean> =>
  invoke<boolean>("register_user", { identifier, password, first_name, last_name })

export const loginUser = (identifier: string, password: string): Promise<boolean> =>
  invoke<boolean>("login_user", { identifier, password })

export const getUser = (identifier: string): Promise<UserInfo | null> =>
  invoke<UserInfo | null>("get_user", { identifier })

export const clearSession = (): Promise<void> =>
  invoke<void>("clear_session")
