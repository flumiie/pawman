import { ProtectedRoute } from "@/components/protected-route"
import { RootRedirect } from "@/components/root-redirect"
import ErrorPage from "@/app/errors/general/page"
import type { ComponentType } from "react"
import { type RouteObject } from "react-router-dom"

/**
 * Every page is code-split. With the data router, a route's code is loaded
 * *before* the navigation commits: the current page stays on screen and the
 * root layout shows a progress bar until the next page is ready.
 */
function page(load: () => Promise<{ default: ComponentType }>) {
  return async () => ({ Component: (await load()).default })
}

export const routes: RouteObject[] = [
  {
    path: "/",
    errorElement: (
      <ErrorPage
        title="App Error"
        description="We couldn't load the application."
      />
    ),
    children: [
      { index: true, Component: RootRedirect },
      { path: "login", lazy: page(() => import("@/app/auth/login/page")) },
      { path: "sign-up", lazy: page(() => import("@/app/auth/sign-up/page")) },
    ],
  },
  {
    element: <ProtectedRoute />,
    path: "main",
    errorElement: (
      <ErrorPage
        title="App Crash"
        description="Please restart the app to continue."
      />
    ),
    children: [{ path: "/", lazy: page(() => import("@/app/passwords/page")) }],
  },

  // Catch-all route for 404
  {
    path: "*",
    errorElement: (
      <ErrorPage
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
      />
    ),
    lazy: page(() => import("@/app/errors/not-found/page")),
  },
]
