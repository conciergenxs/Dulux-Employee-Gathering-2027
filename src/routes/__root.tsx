import {
  Outlet,
  createRootRoute,
  type ErrorComponentProps,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

import appCss from "../styles.css?url";
import { SiteChrome, SiteFooter } from "@/components/site/SiteChrome";
import { NotFound } from "@/components/site/NotFound";
import { EVENT } from "@/lib/event";
// Loaded with the shell so `?demo=1` is picked up on any page.
import "@/lib/demo";
import kv from "@/assets/brand/kv-greater-together.webp";

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="max-w-md text-center">
        <h1 className="t-h2 text-white">This page didn't load</h1>
        <p className="t-body mt-3 text-muted-foreground">
          Terjadi kesalahan. Coba lagi, atau kembali ke halaman utama.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              void router.invalidate();
              reset();
            }}
            className="btn btn-primary"
          >
            Try again
          </button>
          <a href="/" className="btn btn-ghost">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const description = `${EVENT.name} — ${EVENT.theme}. ${EVENT.datesLabel} at ${EVENT.venue}. ${EVENT.statement}`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0a2c52" },
      { title: `${EVENT.theme} — ${EVENT.name}` },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:title", content: `${EVENT.theme} — ${EVENT.name}` },
      { property: "og:description", content: description },
      { property: "og:image", content: kv },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: kv },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  // Reduced motion is honoured here, once, rather than per component: motion
  // drops transforms for those visitors while server and client markup match.
  return (
    <MotionConfig reducedMotion="user">
      <a href="#content" className="skip-link">
        Skip to main content
      </a>
      <SiteChrome />
      <main id="content" className="min-h-dvh">
        {/* Required: nested routes render here. */}
        <Outlet />
      </main>
      <SiteFooter />
    </MotionConfig>
  );
}
