import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Logo } from "@/components/logo"

interface ErrorPageProps {
  error?: Error | null
  title?: string
  description?: string
}

export default function ErrorPage({
  error,
  title = "Something went wrong",
  description = "An unexpected error occurred. You can try again or return home.",
}: ErrorPageProps) {
  const navigate = useNavigate()

  const handleRetry = () => window.location.reload()
  const handleHome = () => navigate("/main/passwords")

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6">
      {/* Animated icon */}
      <div className="relative flex size-20 shrink-0 items-center justify-center rounded-full bg-destructive/10">
        <span className="absolute inset-0 animate-ping rounded-full bg-destructive/5" />
        <AlertTriangle className="size-10 text-destructive" />
      </div>

      {/* Message */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>

        {error && (
          <details className="mx-auto mt-4 w-full max-w-md text-left">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              Show error details
            </summary>
            <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-muted p-3 text-xs font-mono">
              {error.stack || String(error)}
            </pre>
          </details>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Button variant="outline" className="cursor-pointer gap-1.5" onClick={handleHome}>
          <Home className="size-4" />
          Go Home
        </Button>
        <Button className="cursor-pointer gap-1.5" onClick={handleRetry}>
          <RefreshCw className="size-4" />
          Try Again
        </Button>
      </div>

      {/* Branding */}
      <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <Logo size={20} />
        </div>
        PawMan
      </div>
    </div>
  )
}
