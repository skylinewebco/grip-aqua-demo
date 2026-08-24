/* =============================================================
   GRIP — experience shell
   Long, cinematic, scroll-driven product story over a fixed 3D
   bottle. GSAP ScrollTrigger writes progress into a shared ref
   (read by the Scene each frame) and drives the DOM: evolving
   world gradient + adaptive text color (cream -> white -> UV
   purple), glow, cap annotations, nav state and per-panel
   reveals. Theme toggle is persisted + animated. Animation
   state lives in refs to avoid React re-renders. Original design.
   ============================================================= */
import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "./Scene.jsx";

gsap.registerPlugin(ScrollTrigger);

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const detectMobile = () => {
  if (typeof window === "undefined") return false;
  // fall back to desktop if the viewport hasn't been laid out yet (width 0)
  const w = window.innerWidth || 1280;
  return window.matchMedia("(pointer: coarse)").matches || w < 820;
};

/* backdrop worlds per theme, blended across scroll (a/b = gradient stops, fg = text) */
const WORLDS = {
  dark: [
    { a: "#141327", b: "#070610", fg: "#eef0f7" }, // deep indigo-obsidian
    { a: "#0d0b18", b: "#050409", fg: "#eef0f7" }, // obsidian
    { a: "#281652", b: "#0b0718", fg: "#f6f2ff" }, // amethyst / UV
  ],
  light: [
    { a: "#f5f2ee", b: "#e7e0f0", fg: "#17151c" }, // warm porcelain, faint lilac
    { a: "#ffffff", b: "#eee9f6", fg: "#17151c" }, // clean, faint violet
    { a: "#2a1748", b: "#120a24", fg: "#f6f2ff" }, // deep amethyst / UV
  ],
};

function hexLerp(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const r = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${r[0]},${r[1]},${r[2]})`;
}
function clamp01(x) { return Math.min(1, Math.max(0, x)); }
function smoothstep(t) { t = clamp01(t); return t * t * (3 - 2 * t); }
function windowAt(p, c, w) { return clamp01(1 - Math.abs(p - c) / w); }

const VARIANTS = [
  { name: "Onyx", body: "#17171b", swatch: "#17171b" },
  { name: "Graphite", body: "#2b2d33", swatch: "#3a3d45" },
  { name: "Frost", body: "#8c93a1", swatch: "#c7cdd8" },
];

const Sun = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
const Moon = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>;

export default function GripExperience() {
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(null);
  const barRef = useRef(null);
  const navRef = useRef(null);
  const hintRef = useRef(null);
  const rootRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const introT0 = useRef(typeof performance !== "undefined" ? performance.now() : 0);

  const [loaded, setLoaded] = useState(false);
  const [variant, setVariant] = useState(0);
  const [theme, setTheme] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-theme") || "dark"
      : "dark"
  );
  const isMobile = useRef(detectMobile()).current;

  const applyFx = useRef((p) => {
    const root = document.documentElement;
    const worlds = WORLDS[root.getAttribute("data-theme") === "dark" ? "dark" : "light"];
    const n = worlds.length - 1;
    const w = clamp01(p) * n;
    let i = Math.floor(w);
    if (i >= n) i = n - 1;
    const t = smoothstep(w - i);
    const a = hexLerp(worlds[i].a, worlds[i + 1].a, t);
    const b = hexLerp(worlds[i].b, worlds[i + 1].b, t);
    const fg = hexLerp(worlds[i].fg, worlds[i + 1].fg, t);
    root.style.setProperty("--grad", `radial-gradient(125% 120% at 50% 30%, ${a} 0%, ${b} 62%, ${a} 100%)`);
    root.style.setProperty("--fg", fg);
    const glow = Math.max(windowAt(p, 0.55, 0.22), p > 0.8 ? (p - 0.8) / 0.2 : 0);
    root.style.setProperty("--glow-opacity", (glow * 0.85).toFixed(3));
    root.style.setProperty("--cap-opacity", smoothstep(windowAt(p, 0.45, 0.11)).toFixed(3));
  });

  useEffect(() => {
    applyFx.current(0);

    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);

    const stq = ScrollTrigger.create({
      trigger: scrollRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: prefersReduced ? true : 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        progress.current = p;
        if (barRef.current) barRef.current.style.width = (p * 100).toFixed(2) + "%";
        applyFx.current(p);
        if (navRef.current) navRef.current.classList.toggle("scrolled", self.scroll() > 40);
        if (hintRef.current) hintRef.current.style.opacity = p > 0.03 ? "0" : "1";
      },
    });

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".panel").forEach((panel) => {
        const items = panel.querySelectorAll(".reveal");
        if (!items.length) return;
        if (prefersReduced) { gsap.set(items, { opacity: 1, y: 0 }); return; }
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.08,
            scrollTrigger: { trigger: panel, start: "top 80%", toggleActions: "play none none reverse" },
          }
        );
      });
    }, rootRef);

    let cleanupCursor = () => {};
    if (dotRef.current) {
      const xTo = gsap.quickTo(dotRef.current, "x", { duration: 0.15, ease: "power3" });
      const yTo = gsap.quickTo(dotRef.current, "y", { duration: 0.15, ease: "power3" });
      const xR = gsap.quickTo(ringRef.current, "x", { duration: 0.4, ease: "power3" });
      const yR = gsap.quickTo(ringRef.current, "y", { duration: 0.4, ease: "power3" });
      const cur = (e) => { xTo(e.clientX); yTo(e.clientY); xR(e.clientX); yR(e.clientY); };
      const over = (e) => {
        ringRef.current.classList.toggle("hover", !!e.target.closest("a,button,.magnetic"));
      };
      window.addEventListener("pointermove", cur);
      window.addEventListener("pointerover", over);
      cleanupCursor = () => { window.removeEventListener("pointermove", cur); window.removeEventListener("pointerover", over); };
    }

    const magCleanups = [];
    gsap.utils.toArray(".magnetic").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
      const move = (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      };
      const leave = () => { xTo(0); yTo(0); };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      magCleanups.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
    });

    ScrollTrigger.refresh();
    // reveal the page once the 3D scene has drawn its first frame (onReady),
    // with a safety fallback so the loader never gets stuck.
    const t = setTimeout(() => setLoaded(true), 4000);

    return () => {
      clearTimeout(t);
      window.removeEventListener("pointermove", onMove);
      stq.kill();
      ctx.revert();
      cleanupCursor();
      magCleanups.forEach((fn) => fn());
    };
  }, [isMobile]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.body.classList.add("theme-anim");
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("grip-theme", next); } catch {}
    setTheme(next);
    applyFx.current(progress.current);
    setTimeout(() => document.body.classList.remove("theme-anim"), 700);
  };

  return (
    <div ref={rootRef}>
      <div className={"grip-loader" + (loaded ? " done" : "")}>
        <div style={{ textAlign: "center" }}>
          <div className="mark">GRIP</div>
          <div className="track"><i /></div>
        </div>
      </div>

      <div className="grip-backdrop" />
      <div className="grip-canvas">
        <Canvas
          shadows={!isMobile}
          dpr={[1, isMobile ? 1.5 : 2]}
          camera={{ fov: 32, position: [0, 0.2, 5.4], near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Scene progress={progress} pointer={pointer} reduced={prefersReduced} isMobile={isMobile} bodyColor={VARIANTS[variant].body}
            onReady={() => {
              // keep the logo-shine intro on screen for a premium minimum, then reveal
              const wait = Math.max(0, 1600 - (performance.now() - introT0.current));
              setTimeout(() => { setLoaded(true); requestAnimationFrame(() => ScrollTrigger.refresh()); }, wait);
            }} />
        </Canvas>
      </div>
      <div className="grip-glow" />
      <div className="grip-vignette" />

      {/* cap feature annotations (fade in during the cap close-up via --cap-opacity; CSS hides on mobile) */}
      <div className="cap-arrows" aria-hidden="true">
          <div className="ca-item ca-left">
            <span className="ca-label">USB-C charging port</span>
            <svg className="ca-arrow" width="92" height="52" viewBox="0 0 92 52" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14 C 34 2, 56 8, 84 38" />
              <path d="M84 38 l -15 -1 M84 38 l -4 -15" />
            </svg>
          </div>
          <div className="ca-item ca-right">
            <span className="ca-label">Smart button</span>
            <svg className="ca-arrow" width="92" height="52" viewBox="0 0 92 52" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M88 14 C 58 2, 36 8, 8 38" />
              <path d="M8 38 l 15 -1 M8 38 l 4 -15" />
            </svg>
          </div>
          <div className="ca-item ca-bottom">
            <svg className="ca-arrow" width="40" height="58" viewBox="0 0 40 58" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 54 L 20 6" />
              <path d="M20 6 l -8 11 M20 6 l 8 11" />
            </svg>
            <span className="ca-label">LED status ring</span>
          </div>
      </div>

      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div className="grip-progress" ref={barRef} />
      <nav className="grip-nav" ref={navRef}>
        <div className="nav-links">
          <a href="#home" className="mobile-keep">Home</a>
          <a href="#technology">Technology</a>
          <a href="#product">Product</a>
          <a href="#features">Features</a>
          <a href="#shop">Shop</a>
        </div>
        <a className="nav-brand" href="#home">GRIP</a>
        <div className="nav-right">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="knob">{theme === "dark" ? Moon : Sun}</span>
          </button>
          <a className="nav-cta magnetic" href="#shop">Buy Now</a>
        </div>
      </nav>

      <main className="grip-scroll" ref={scrollRef}>
        {/* 1 — hero */}
        <section className="panel" id="home">
          <div className="slot-left">
            <p className="eyebrow reveal">UV-C self-cleaning smart bottle</p>
            <h1 className="display reveal">The Future<br /><span className="thin">Of Hydration</span></h1>
            <p className="lead reveal">
              GRIP purifies your water with UV-C light, charges over USB-C and is engineered from
              premium stainless steel — the last bottle you'll ever need.
            </p>
            <div className="cta-row reveal">
              <a className="btn btn--solid magnetic" href="#features">See the tech</a>
              <a className="btn btn--ghost magnetic" href="#shop">Shop GRIP</a>
            </div>
          </div>
        </section>

        {/* 2 — product experience */}
        <section className="panel" id="product">
          <div className="slot-left">
            <p className="chip reveal"><span className="d" />Product Experience</p>
            <h2 className="headline reveal">Hydration,<br /><span className="thin">reimagined.</span></h2>
            <p className="lead reveal">Precision-machined and finished in soft-touch reflective black. Every surface designed to be seen — and felt.</p>
          </div>
        </section>

        {/* 3 — material / design */}
        <section className="panel" id="technology">
          <div className="slot-right">
            <h2 className="headline reveal">Sleek<br /><span className="thin">Design</span></h2>
            <p className="lead reveal">Immerse yourself in the sleek, sophisticated form of the GRIP stainless-steel bottle, finished with a soft matte coat and an engraved GRIP mark.</p>
          </div>
        </section>

        {/* 4 — long lasting */}
        <section className="panel">
          <div className="slot-left">
            <h2 className="headline reveal">Long<br /><span className="thin">Lasting</span></h2>
            <p className="lead reveal">Crafted from premium stainless steel and coupled with a rubber padding on the base to keep the bottle stable and clang-free — durability built to last for years.</p>
          </div>
        </section>

        {/* 5 — inside the cap (intro) */}
        <section className="panel">
          <div className="slot-center">
            <p className="chip reveal"><span className="d" />Inside the Smart Cap</p>
            <h2 className="headline reveal">A computer<br /><span className="thin">in the cap.</span></h2>
            <p className="lead reveal" style={{ margin: "22px auto 0" }}>Watch the cap lift away to reveal the technology packed inside.</p>
          </div>
        </section>

        {/* 6 — cap features (arrows overlay appears here) */}
        <section className="panel" id="features">
          <div className="slot-center">
            <h2 className="headline reveal" style={{ fontSize: "clamp(34px,5vw,72px)" }}>Product Features</h2>
            <p className="lead reveal" style={{ margin: "20px auto 0" }}>Where innovation flows, hydration glows.</p>
          </div>
        </section>

        {/* 7 — UV-C */}
        <section className="panel">
          <div className="slot-right">
            <p className="eyebrow reveal">UV-C Self-Clean</p>
            <div className="big-metric reveal">99.9%<small>of bacteria eliminated</small></div>
            <p className="lead reveal">A UV-C LED in the cap sterilises your water and the bottle interior at the tap of a button — pure water, every pour.</p>
          </div>
        </section>

        {/* 8 — USB-C / charging */}
        <section className="panel">
          <div className="slot-left">
            <p className="eyebrow reveal">USB-C Charging</p>
            <div className="big-metric reveal">5000<small>mAh · weeks per charge</small></div>
            <p className="lead reveal">A single USB-C top-up powers weeks of self-cleaning cycles. No proprietary docks, no waiting.</p>
          </div>
        </section>

        {/* 9 — waterproof */}
        <section className="panel">
          <div className="slot-right">
            <h2 className="headline reveal">Waterproof<br /><span className="thin">by design.</span></h2>
            <p className="lead reveal">A precision waterproof rubber stopper seals every seam — leak-proof in your bag, silent on your desk.</p>
          </div>
        </section>

        {/* 10 — sustainability (reference finale headline) */}
        <section className="panel">
          <div className="slot-center">
            <h2 className="headline reveal">Say goodbye to<br /><span className="accent">single-use</span> <span className="thin">bottles.</span></h2>
            <p className="lead reveal" style={{ margin: "22px auto 0" }}>
              Our UV-C powered bottle is convenient and environmentally friendly — helping you cut
              waste and your carbon footprint while staying hydrated. Join the movement.
            </p>
          </div>
        </section>

        {/* 11 — specifications */}
        <section className="panel">
          <div className="slot-center">
            <p className="chip reveal"><span className="d" />Specifications</p>
            <h2 className="subhead reveal">Every detail, engineered.</h2>
            <div className="spec-grid reveal">
              <div className="cell"><div className="k">Capacity</div><div className="v">750 ml</div></div>
              <div className="cell"><div className="k">Material</div><div className="v">18/8 Steel</div></div>
              <div className="cell"><div className="k">Purification</div><div className="v">UV-C LED</div></div>
              <div className="cell"><div className="k">Battery</div><div className="v">5000 mAh</div></div>
              <div className="cell"><div className="k">Charging</div><div className="v">USB-C</div></div>
              <div className="cell"><div className="k">Cold retention</div><div className="v">24 hours</div></div>
            </div>
          </div>
        </section>

        {/* 12 — final CTA */}
        <section className="panel" id="shop">
          <div className="slot-center">
            <p className="eyebrow reveal">Pure water, everywhere</p>
            <h2 className="display reveal" style={{ fontSize: "clamp(44px,7vw,110px)" }}>Meet <span className="accent">GRIP.</span></h2>
            <div className="variant-row reveal" style={{ justifyContent: "center" }}>
              {VARIANTS.map((v, i) => (
                <button key={v.name} className="swatch" title={v.name} aria-pressed={variant === i}
                  onClick={() => setVariant(i)} style={{ background: v.swatch, color: v.swatch }} />
              ))}
            </div>
            <div className="cta-row reveal">
              <a className="btn btn--solid magnetic" href="#home">Buy GRIP — $79</a>
              <a className="btn btn--ghost magnetic" href="#features">See the tech</a>
            </div>
          </div>
        </section>
      </main>

      <div className="scroll-hint" ref={hintRef}>
        <span>Scroll</span>
        <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </div>

      <footer className="grip-foot">
        <div className="inner">
          <div>
            <div className="fbrand">GRIP</div>
            <p className="fnote">An original cinematic 3D product concept built with React Three Fiber, three.js, drei &amp; GSAP.</p>
          </div>
          <div className="fnote">© {new Date().getFullYear()} GRIP · Demo experience · <a href="/">← SK SQUEEZE</a></div>
        </div>
      </footer>
    </div>
  );
}
