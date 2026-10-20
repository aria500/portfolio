/** Public assets need the repository prefix; Next Link handles route prefixes itself. */
export function assetPath<T extends string | undefined>(path: T): T {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path === "/portfolio" || path.startsWith("/portfolio/")) return path;
  return `/portfolio${path}` as T;
}
