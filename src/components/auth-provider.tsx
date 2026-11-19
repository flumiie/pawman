import { useMemo, useState } from "react"
import { useNavigate, Outlet } from "react-router-dom"
import { AuthContext } from "../hooks/use-auth"
import { useLocalStorage } from "../hooks/use-local-storage"

export const AuthProvider = () => {
  const [user, setUser] = useLocalStorage<string | null>("user", null)
  const [is2FAVerified, setIs2FAVerified] = useState(false)
  const navigate = useNavigate()

  const value = useMemo(() => {
    // call this function when you want to authenticate the user
    const login = async (data: string) => {
      setUser(data)
      navigate("/verify-2fa")
    }

    // call this function to sign out logged in user
    const logout = () => {
      setUser(null)
      navigate("/login", { replace: true })
    }

    const verify2FACode = async (code: string) => {
      // Mock verification logic
      if (code === "0000") {
        setIs2FAVerified(true)
        navigate("/secret") // Navigate to a protected route after successful 2FA
        return true
      }
      return false
    }

    return { user, login, logout, is2FAVerified, verify2FACode }
  }, [user, navigate, setUser, is2FAVerified])

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  )
}
