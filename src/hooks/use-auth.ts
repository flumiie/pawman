import { createContext, useContext } from "react"
import { UserInfo } from "@/commands"

export interface AuthData {
  /** Current logged-in identifier (lowercased), or null when unauthenticated. */
  user: string | null
  /** Parsed display info, populated after login; null until then. */
  userInfo: UserInfo | null
  login(identifier: string, password: string): Promise<void>
  logout(): void
}

export const AuthContext = createContext<AuthData | null>(null)
export const useAuth = () => useContext(AuthContext)
