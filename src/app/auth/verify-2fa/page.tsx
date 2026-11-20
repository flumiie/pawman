import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Form } from "@base-ui/react/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Verify2FA() {
  const navigate = useNavigate()
  const data = useAuth()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (loading) return
    setLoading(true)
    try {
      const isValid = await data?.verify2FACode(code)
      if (!isValid) {
        setCode("")
      }
      // Navigation to /secret is handled inside verify2FACode
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <Button type="button" onClick={() => navigate(-1)}>
        Back
      </Button>
      <Input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter verification code"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Verifying…" : "Verify"}
      </Button>
    </Form>
  )
}
