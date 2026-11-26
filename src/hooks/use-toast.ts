import { type ToastManager } from "@base-ui/react/toast"
import { toast, useToastManager } from "@/components/ui/toast"

export function useToast() {
  const manager = useToastManager()
  return { toast, manager }
}

type ToastType = "default" | "success" | "info" | "warning" | "error" | "loading"

interface ToastOptions {
  title?: string
  description?: string
  type?: ToastType
  duration?: number
}

/** Add a toast anywhere in the app. Mount <Toaster /> in your root layout once. */
export function showToast(options: ToastOptions) {
  const { title, description, type = "default", duration } = options
  return toast.add({ title, description, type, timeout: duration })
}

export { toast }
export type { ToastManager }
