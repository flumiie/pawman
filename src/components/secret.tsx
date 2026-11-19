import { useAuth } from "../hooks/use-auth"

export const Secret = () => {
  const auth = useAuth()
  const logout = auth?.logout

  const handleLogout = () => {
    logout?.()
  }

  return (
    <div>
      <h1>This is a Secret page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
