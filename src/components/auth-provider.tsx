import { useMemo, useState } from "react"
import { useNavigate, Outlet } from "react-router-dom"
import { invoke } from "@tauri-apps/api/core"
import { AuthContext } from "../hooks/use-auth"
import { useLocalStorage } from "../hooks/use-local-storage"
import { flushCodes } from "../commands"

export const AuthProvider = () => {
  // user keeps the e-mail of the authenticated session so we can re-use it
  // on reload without forcing a fresh login.
  const [user, setUser] = useLocalStorage<string | null>("pawman_user", null)
  const [is2FAVerified, setIs2FAVerified] = useState(false)
  const navigate = useNavigate()

  const value = useMemo(() => {
    const login = async (email: string) => {
      if (!email || !email.includes("@")) {
        alert("Please enter a valid email address.")
        return
      }
      try {
        await invoke<boolean>("send_2fa_code", { email })
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        alert(`Failed to send verification code: ${msg}`)
        return
      }
      setUser(email.toLowerCase())
      navigate("/verify-2fa")
    }

    const logout = () => {
      flushCodes()
      setUser(null)
      setIs2FAVerified(false)
      navigate("/login", { replace: true })
    }

    const verify2FACode = async (code: string) => {
      if (!user) return false
      try {
        const ok = await invoke<boolean>("verify_2fa_code", { email: user, code })
        if (ok) {
          setIs2FAVerified(true)
          navigate("/secret")
        }
        return ok
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        alert(`Verification failed: ${msg}`)
        return false
      }
    }

    return { user, email: user, login, logout, is2FAVerified, verify2FACode }
  }, [user, navigate, setUser, is2FAVerified])

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  )
}
