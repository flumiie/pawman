import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarConfigProvider } from "@/contexts/sidebar-context"
import { Toaster } from "@/components/ui/toast"
import { RootFallback, RootLayout } from "@/components/router/root-layout"
import { routes } from "@/config/routes"
import { useEffect } from "react"
import { initGTM } from "@/utils/analytics"
import { AuthProvider } from "./components/auth-provider"
import { Alert } from "./components/ui/alert"

// Get basename from environment (for deployment) or use empty string for development
const basename = import.meta.env.VITE_BASENAME || ""

const router = createBrowserRouter(
  [
    {
      Component: AuthProvider,
      element: <RootLayout />,
      HydrateFallback: RootFallback,
      children: routes,
    },
  ],
  { basename }
)

function App() {
  // Initialize GTM on app load
  useEffect(() => {
    initGTM()
  }, [])

  const alert = {
    text: "",
    shown: false,
  }

  return (
    <div
      className="font-sans antialiased"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {alert.shown ? (
        <div className="p-6" style={{ position: "absolute", width: "100%" }}>
          <Alert>{alert.text}</Alert>
        </div>
      ) : null}
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <SidebarConfigProvider>
          <Toaster>
            <RouterProvider router={router} />
          </Toaster>
        </SidebarConfigProvider>
      </ThemeProvider>
    </div>
  )
}

export default App
