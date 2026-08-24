import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// The existing SK SQUEEZE site loads its vanilla scripts with classic
// (non-module) <script src="js/..."> tags. Vite intentionally leaves those
// references untouched, so it does not copy them into the build output.
// This plugin copies the js/ folder verbatim into dist/ so the production
// build behaves exactly like the source site. (css/ is already bundled via
// the <link> tag; index.html handles the rest.)
function copyVanillaAssets() {
  return {
    name: "sk-copy-vanilla-assets",
    apply: "build",
    closeBundle() {
      const from = resolve(import.meta.dirname, "js");
      const to = resolve(import.meta.dirname, "dist", "js");
      if (existsSync(from)) {
        cpSync(from, to, { recursive: true });
      }
    },
  };
}

// Vite is added on top of the existing static SK SQUEEZE site.
// index.html remains the entry point; the current vanilla scripts and design
// are preserved. The React plugin is only needed to compile the optional
// React Three Fiber / drei island in src/.
export default defineConfig({
  root: ".",
  plugins: [react(), copyVanillaAssets()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // multi-page: the existing SK SQUEEZE site + the GRIP 3D experience
        main: resolve(import.meta.dirname, "index.html"),
        grip: resolve(import.meta.dirname, "grip.html"),
      },
      output: {
        // split heavy, rarely-changing vendor libs into parallel, cacheable chunks
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@react-three/drei")) return "drei";
          if (id.includes("@react-three/fiber")) return "r3f";
          if (id.includes("/react-dom/") || id.includes("/react/") || id.includes("/scheduler/")) return "r3f";
          if (id.includes("/gsap/")) return "gsap";
          if (id.includes("/three/")) return "three";
        },
      },
    },
  },
});
