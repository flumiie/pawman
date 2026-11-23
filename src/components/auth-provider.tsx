import { useMemo } from "react"
import { useNavigate, Outlet } from "react-router-dom"
import { AuthContext } from "../hooks/use-auth"
import { useLocalStorage } from "../hooks/use-local-storage"
import { loginUser, clearSession } from "../commands"

export const AuthProvider = () => {
  const [user, setUser] = useLocalStorage<string | null>("pawman_user", null)
  const navigate = useNavigate()

  const value = useMemo(() => {
    const login = async (identifier: string, password: string) => {
      const id = identifier.trim().toLowerCase()
      if (!id || !password) return
      try {
        const ok = await loginUser(id, password)
        if (ok) {
          setUser(id)
          navigate("/main/passwords")
        } else {
          alert("Invalid credentials.")
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        alert(`Login failed: ${msg}`)
      }
    }

    const logout = () => {
      clearSession()
      setUser(null)
      navigate("/login", { replace: true })
    }

    return { user, login, logout }
  }, [user, navigate, setUser])

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  )
}
