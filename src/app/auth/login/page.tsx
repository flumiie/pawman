import { LoginForm } from "./components/login-form"
import { Logo } from "@/components/logo"
import { ModeToggle } from "@/components/mode-toggle"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div
          className="flex items-center"
          style={{ justifyContent: "space-between" }}
        >
          <span className="w-8"></span>
          <span className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Logo size={32} />
            </div>
            PawMan
          </span>
          <ModeToggle variant="ghost" size="icon" />
        </div>
        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://ui.shadcn.com/placeholder.svg"
          alt="Image"
          className="absolute inset-0 size-full object-cover dark:brightness-[0.95] dark:invert"
        />
      </div>
    </div>
  )
}
