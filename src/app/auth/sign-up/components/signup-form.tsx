"use client"

import { cn } from "@/lib/utils"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser } from "@/commands"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    identifier: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (!form.terms) {
      setError("Please agree to the Terms of Service and Privacy Policy.")
      return
    }

    setLoading(true)
    try {
      const ok = await registerUser(form.identifier, form.password, form.firstName, form.lastName)
      if (ok) {
        navigate("/login")
      } else {
        setError("Registration failed — that identifier is already taken.")
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(`Registration failed: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your information to create a new account
        </p>
      </div>
      <FieldGroup className="grid gap-6">
        <FieldGroup className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <Input
              id="firstName"
              placeholder="John"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              id="lastName"
              placeholder="Doe"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
            />
          </Field>
        </FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email or username</FieldLabel>
          <Input
            id="email"
            type="text"
            placeholder="m@example.com"
            required
            value={form.identifier}
            onChange={(e) => update("identifier", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
          />
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="terms"
            checked={form.terms}
            onCheckedChange={(v) => update("terms", !!v)}
          />
          <FieldLabel htmlFor="terms" className="text-sm">
            I agree to the{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
          </FieldLabel>
        </Field>
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
        <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
          {loading ? "Creating account…" : "Create Account"}
        </Button>
      </FieldGroup>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Sign in
        </a>
      </div>
    </form>
  )
}
