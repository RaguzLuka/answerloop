/**
 * template.tsx re-mounts on EVERY route change (unlike layout.tsx, which
 * persists), so this CSS-only entrance replays on each navigation — and,
 * unlike a JS-driven fade, it never keeps the page hidden while scripts load.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
