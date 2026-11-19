import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useNavigate, useOutlet, NavLink } from "react-router-dom"

export const ProtectedLayout = () => {
  const navigate = useNavigate()
  const outlet = useOutlet()
  const data = useAuth()

  useEffect(() => {
    if (!data?.user) {
      navigate("/login")
      return
    }
  })

  return (
    <div>
      <nav>
        <NavLink to="/settings">Settings</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
      {outlet}
    </div>
  )
}
