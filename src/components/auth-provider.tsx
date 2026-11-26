"use client"

import { useRef } from "react"
import { useNavigate, Outlet } from "react-router-dom"
import { AuthContext } from "../hooks/use-auth"
import { useLocalStorage } from "../hooks/use-local-storage"
import { loginUser, clearSession, getUser, UserInfo } from "../commands"
import { useToast } from "@/hooks/use-toast"

export const AuthProvider = () => {
  const { toast } = useToast()
  const [user, setUser] = useLocalStorage<string | null>("pawman_user", null)
  const [userInfo, setUserInfo] = useLocalStorage<UserInfo | null>("pawman_user_info", null)
  const navigate = useNavigate()
  // Keep a stable ref so callbacks never capture a stale navigate/user state.
  const stateRef = useRef({ user, userInfo, navigate })
  stateRef.current = { user, userInfo, navigate }

  const login = async (identifier: string, password: string) => {
    const id = identifier.trim().toLowerCase()
    if (!id || !password) return
    try {
      const ok = await loginUser(id, password)
      if (ok) {
        const info = await getUser(id)
        setUserInfo(info)
        setUser(id)
        stateRef.current.navigate("/main/passwords")
      } else {
        toast.add({ title: "Invalid credentials", type: "error" })
      }
    } catch (err) {
      toast.add({ title: "Wrong username or password", type: "error" })
    }
  }

  const logout = () => {
    clearSession()
    setUser(null)
    setUserInfo(null)
    stateRef.current.navigate("/login", { replace: true })
  }

  return (
    <AuthContext.Provider value={{ user, userInfo, login, logout }}>
      <Outlet />
    </AuthContext.Provider>
  )
}
