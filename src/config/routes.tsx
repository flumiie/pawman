import { Secret } from "@/components/secret"
import { ProtectedLayout } from "@/app/protected-layout/page"
import { ProtectedRoute } from "@/components/protected-route"
import { RootRedirect } from "@/components/root-redirect"
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
    children: [
      { index: true, Component: RootRedirect },
      { path: "login", lazy: page(() => import("@/app/auth/login/page")) },
      {
        path: "verify-2fa",
        lazy: page(() => import("@/app/auth/verify-2fa/page")),
      },
      { path: "secret", Component: Secret },
    ],
  },
  {
    element: <ProtectedRoute />,
    path: "main",
    Component: ProtectedLayout,
    children: [
      { path: "passwords", lazy: page(() => import("@/app/passwords/page")) },
    ],
  },

  // Catch-all route for 404
  { path: "*", lazy: page(() => import("@/app/errors/not-found/page")) },
]
