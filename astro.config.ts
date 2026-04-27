import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const BASE = "/agentic-company";

export default defineConfig({
  base: BASE,
  outDir: `./dist${BASE}`,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
