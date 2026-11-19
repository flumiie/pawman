import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/use-auth"

export const RootRedirect = () => {
  const navigate = useNavigate()
  const { user, is2FAVerified } = useAuth() ?? {}

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true })
    } else if (!is2FAVerified) {
      navigate("/verify-2fa", { replace: true })
    } else {
      navigate("/main/passwords", { replace: true })
    }
  }, [user, is2FAVerified, navigate])

  return null
}
