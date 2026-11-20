import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { invoke } from "@tauri-apps/api/core"
import { useAuth } from "@/hooks/use-auth"
import { Form } from "@base-ui/react/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Verify2FA() {
  const navigate = useNavigate()
  const data = useAuth()
  const email = data?.email as string | null
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  // When the component mounts (or the email changes), send a fresh code.
  useEffect(() => {
    if (!email) return
    ;(async () => {
      try {
        await invoke<boolean>("send_2fa_code", { email })
        setSendError(null)
      } catch (err: unknown) {
        setSendError(err instanceof Error ? err.message : String(err))
      }
    })()
  }, [email])

  const handleSubmit = async () => {
    if (loading || !email) return
    setLoading(true)
    setSendError(null)
    try {
      const isValid = await invoke<boolean>("verify_2fa_code", { email, code })
      if (!isValid) {
        setCode("")
        alert("Invalid code. Please check your inbox and try again.")
      }
      // Success navigates inside the command flow via the auth provider.
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email || loading) return
    setLoading(true)
    setSendError(null)
    try {
      await invoke<boolean>("send_2fa_code", { email })
      setCode("")
    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : String(err))
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
      <div className="p-4">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="flex flex-col gap-4 px-4">
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit verification code to{" "}
          <span className="font-medium text-foreground">{email}</span>.
        </p>
        {sendError && <p className="text-sm text-destructive">{sendError}</p>}
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter verification code"
          autoFocus
          disabled={loading}
        />
        <Button type="submit" disabled={loading || code.length !== 6}>
          {loading ? "Verifying…" : "Verify"}
        </Button>
        <Button
          type="button"
          variant="link"
          className="self-start p-0 h-auto text-xs"
          onClick={handleResend}
          disabled={loading}
        >
          Resend code
        </Button>
      </div>
    </Form>
  )
}
