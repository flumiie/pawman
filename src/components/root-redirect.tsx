import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/use-auth"

export const RootRedirect = () => {
  const navigate = useNavigate()
  const { user } = useAuth() ?? {}

  useEffect(() => {
    navigate(user ? "/main/passwords" : "/login", { replace: true })
  }, [user, navigate])

  return null
}
