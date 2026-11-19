import { createContext, useContext } from "react"

export interface AuthData {
  user: string
  login(data: string): Promise<void>
  logout(): void
  is2FAVerified: boolean
  verify2FACode(code: string): Promise<boolean>
}

export const AuthContext = createContext<AuthData | null>(null)
export const useAuth = () => {
  return useContext(AuthContext)
}
