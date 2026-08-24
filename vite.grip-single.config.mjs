import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { resolve } from "node:path";

// One-off build: bundle the GRIP page into a single self-contained HTML file
// (all JS/CSS inlined) so it can be opened directly in a browser — no dev
// server. Separate from the main multi-page build; does not affect it.
export default defineConfig({
  root: ".",
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: "dist-grip-single",
    emptyOutDir: true,
    rollupOptions: { input: resolve(import.meta.dirname, "grip.html") },
  },
});
