import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Renders an overlay at the end of <body>, outside every section's stacking
 * context, so a full-screen layer opened from inside a page band always sits
 * above the rest of the page. Nothing renders on the server.
 */
export function BodyPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}
