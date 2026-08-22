# SK SQUEEZE — Premium Sparkling Soda

A production-quality, single-page marketing & storefront site for the fictional premium
soda brand **SK SQUEEZE**. Built with vanilla HTML/CSS/JS and GSAP + ScrollTrigger for
cinematic, scroll-driven motion.

## Highlights

- **Original vector cans** — every SK SQUEEZE can is generated SVG artwork (metallic
  cylinder shading, chrome rims, condensation, specular highlights) with a full label
  lockup and per-flavor identity. No stock imagery.
- **10 flavors** — Citrus Rush, Berry Pop, Tropical Wave, Cherry Vanilla, Ginger Lime,
  Classic Cola, Orange Squeeze, Lemon Lime, Strawberry Sunshine, Blueberry Blast.
- **Scroll-driven side-entry animation** — feature cans travel in from alternating
  sides, tied directly to scroll progress (GSAP ScrollTrigger `scrub`), with rotation
  and scale/depth. Works on desktop and mobile without horizontal overflow.
- **Stationary hero can** — the primary interface can stays anchored.
- **Full demo commerce** — product detail modals, cart drawer, quantity controls,
  and a multi-step demo checkout with order confirmation (no real payments).
- **Sections** — hero, showcase, flavors, benefits, ingredients/nutrition, brand story,
  testimonials, subscription, social feed, newsletter, footer.
- **Responsive & accessible** — mobile-first layouts, `prefers-reduced-motion` handling.

## Run locally

The site is fully static. Serve the folder with any static server:

```bash
node server.js
# then open http://localhost:4321
```

Or use any other static server (e.g. `npx serve`).

## Structure

```
index.html        # markup for all sections
css/styles.css    # design system + all section styles
js/
  cans.js         # SVG can factory (per-flavor label artwork)
  products.js     # flavor data, nutrition, testimonials
  cart.js         # cart + checkout state
  main.js         # motion, rendering, interaction wiring
  gsap.min.js, ScrollTrigger.min.js, ScrollToPlugin.min.js  # vendored GSAP
server.js         # minimal static file server for local preview
```

> Demo project. All brand names, copy, prices, and nutrition figures are illustrative.
