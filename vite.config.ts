import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

/**
 * Frontend-only build. The JTI project wrapped these plugins in a hosted-editor
 * preset alongside its Redis-backed server functions; this microsite has no
 * backend, so the plain plugin list is all it needs. Nitro stays for the
 * production build so the SSR output deploys to Vercel the same way.
 */
export default defineConfig(({ command }) => ({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), tanstackStart(), ...(command === "build" ? [nitro()] : []), viteReact()],
}));
