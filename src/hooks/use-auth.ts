import { createContext, useContext } from "react"

export interface AuthData {
  /** Current logged-in identifier (lowercased), or null when unauthenticated. */
  user: string | null
  login(identifier: string, password: string): Promise<void>
  logout(): void
}

export const AuthContext = createContext<AuthData | null>(null)
export const useAuth = () => useContext(AuthContext)
