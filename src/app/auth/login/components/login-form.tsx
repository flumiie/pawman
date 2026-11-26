"use client"

import { cn } from "@/lib/utils"
import { Field, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Form } from "@base-ui/react/form"

type FormState = {
  identifier: string
  password: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const data = useAuth()
  const [form, setForm] = useState<FormState>({ identifier: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!form.identifier || !form.password || !data?.login) return
    setLoading(true)
    try {
      await data?.login(form.identifier, form.password)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        handleLogin()
      }}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your account details to unlock your secrets
        </p>
      </div>
      <div className="grid gap-6">
        <Field>
          <FieldLabel htmlFor="identifier">Email or username</FieldLabel>
          <Input
            id="identifier"
            name="identifier"
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="username"
            required
            value={form.identifier}
            onChange={(e) =>
              setForm((f) => ({ ...f, identifier: e.target.value }))
            }
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
          />
        </Field>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={loading}
        >
          {loading ? "Logging in…" : "Login"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/sign-up" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </Form>
  )
}
