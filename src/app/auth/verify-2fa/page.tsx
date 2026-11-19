import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

export default function Verify2FA() {
  const navigate = useNavigate()
  const data = useAuth()
  const [code, setCode] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const isValid = await data?.verify2FACode(code)
    if (isValid) {
      navigate("/secret")
    } else {
      alert("Invalid code. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter verification code"
      />
      <button type="submit">Verify</button>
    </form>
  )
}
