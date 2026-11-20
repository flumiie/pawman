/** Expose Rust-side helpers that don't need Tauri state to the React layer. */
import { invoke } from "@tauri-apps/api/core"

/** Erase every pending in-process 2FA code — called on logout. */
export const flushCodes = () => void invoke<void>("flush_codes")
