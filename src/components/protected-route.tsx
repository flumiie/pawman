import { useEffect } from "react"
import { useNavigate, useLocation, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/use-auth"

export const ProtectedRoute = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const data = useAuth()

  useEffect(() => {
    if (!data?.user) {
      navigate("/login", { replace: true })
      return
    }
    if (location.pathname !== "/main/passwords") {
      navigate("/main/passwords", { replace: true })
    }
  }, [data?.user, location.pathname, navigate])
  return <Outlet />
}
