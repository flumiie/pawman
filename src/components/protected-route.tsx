import { useEffect } from "react"
import { useNavigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/use-auth"

export const ProtectedRoute = () => {
  const navigate = useNavigate()
  const data = useAuth()

  useEffect(() => {
    if (!data?.user) {
      navigate("/login")
      return
    }
    navigate("/main/passwords")
    return
  })
  return <Outlet />
}
