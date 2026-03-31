/**
 * Layout for marketing pages (pricing, etc.).
 * Minimal wrapper — Header and Footer are included per-page
 * to give each marketing page full control over its chrome.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
