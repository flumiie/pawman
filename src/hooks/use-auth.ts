import { createContext, useContext } from "react"

export interface AuthData {
  /** Current logged-in email address (lowercased), or null when unauthenticated. */
  user: string | null
  /** Persisted e-mail used for the current 2FA session. */
  email: string | null
  login(email: string): Promise<void>
  logout(): void
  is2FAVerified: boolean
  verify2FACode(code: string): Promise<boolean>
}

export const AuthContext = createContext<AuthData | null>(null)
export const useAuth = () => {
  return useContext(AuthContext)
}
