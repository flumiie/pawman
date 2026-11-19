// shadcn's class-name merger (clsx + tailwind-merge in one compiled package)
export { cn } from "cn"

/**
 * Get the correct URL for public assets
 * Handles both development and production asset paths
 */
export function assetUrl(path: string): string {
  const baseUrl = import.meta.env.BASE_URL || "/"
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  return baseUrl + cleanPath
}

/**
 * Get the correct URL path with basename prefix for internal navigation
 * @param path - The internal path (e.g., "/passwords", "/login")
 * @returns The full path with basename prefix
 */
export function getAppUrl(path: string): string {
  const basename = import.meta.env.VITE_BASENAME || ""
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return basename + cleanPath
}

export async function encrypt(text: string) {
  // UTF-8 > hash > arr buff to arr > bytes to hex
  const msgBuffer = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}
