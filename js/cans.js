/* =============================================================
   SK SQUEEZE — Premium realistic aluminum-can factory
   Generates commercial-style beverage cans as vector art:
   metallic cylinder shading, chrome rims, condensation,
   specular highlights, and a full SK SQUEEZE label lockup.
   Every can is original SK artwork with its correct flavor.
   ============================================================= */
(function (global) {
  "use strict";

  let uid = 0;

  // Standard-can silhouette (shoulder + body + barrelled base)
  const OUTLINE =
    "M60 126 C60 106 76 94 104 90 L216 90 C244 94 260 106 260 126 " +
    "L260 470 C260 483 255 486 245 488 C206 496 114 496 75 488 " +
    "C65 486 60 483 60 470 Z";
  // Shoulder-only (top curved section) for extra sheen
  const SHOULDER =
    "M60 126 C60 106 76 94 104 90 L216 90 C244 94 260 106 260 126 " +
    "C200 118 120 118 60 126 Z";

  function buildCan(f, o) {
    o = o || {};
    const id = "k" + (uid++);
    const c = canCfg(f);
    const dim = (o.w ? ` width="${o.w}"` : "") + (o.h ? ` height="${o.h}"` : "");

    return `
<svg class="sk-can-svg" viewBox="0 0 320 540"${dim}
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${f.name} can">
  <defs>
    <linearGradient id="${id}-body" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0"    stop-color="${shade(c.body,-52)}"/>
      <stop offset="0.05" stop-color="${c.bodyDark}"/>
      <stop offset="0.18" stop-color="${c.body}"/>
      <stop offset="0.36" stop-color="${c.bodyLight}"/>
      <stop offset="0.5"  stop-color="${c.bodyPeak}"/>
      <stop offset="0.62" stop-color="${c.bodyLight}"/>
      <stop offset="0.8"  stop-color="${c.body}"/>
      <stop offset="0.94" stop-color="${c.bodyDark}"/>
      <stop offset="1"    stop-color="${shade(c.body,-58)}"/>
    </linearGradient>

    <linearGradient id="${id}-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7d838d"/><stop offset="0.18" stop-color="#e7ecf1"/>
      <stop offset="0.5" stop-color="#ffffff"/><stop offset="0.72" stop-color="#c2c9d2"/>
      <stop offset="1" stop-color="#6f757e"/>
    </linearGradient>
    <linearGradient id="${id}-lid" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#aeb4bd"/><stop offset="0.5" stop-color="#eef2f6"/>
      <stop offset="1" stop-color="#969ca5"/>
    </linearGradient>

    <linearGradient id="${id}-spec" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#fff" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>

    <radialGradient id="${id}-glow" cx="0.5" cy="0.4" r="0.62">
      <stop offset="0" stop-color="${lighten(c.sqBg,20)}" stop-opacity="0.5"/>
      <stop offset="1" stop-color="${c.sqBg}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}-vig" cx="0.5" cy="0.46" r="0.75">
      <stop offset="0.62" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.28"/>
    </radialGradient>

    <clipPath id="${id}-clip"><path d="${OUTLINE}"/></clipPath>
  </defs>

  <!-- Contact shadow -->
  <ellipse cx="160" cy="516" rx="98" ry="15" fill="#000" opacity="0.24"/>

  <!-- Base rim (behind body) -->
  <ellipse cx="160" cy="490" rx="90" ry="15" fill="url(#${id}-chrome)"/>
  <ellipse cx="160" cy="493" rx="78" ry="9" fill="${shade(c.body,-40)}" opacity="0.7"/>

  <!-- Body -->
  <path d="${OUTLINE}" fill="url(#${id}-body)"/>

  <g clip-path="url(#${id}-clip)">
    <!-- depth vignette + ambient flavor glow -->
    <rect x="40" y="80" width="240" height="430" fill="url(#${id}-vig)"/>
    <ellipse cx="160" cy="240" rx="150" ry="150" fill="url(#${id}-glow)"/>

    <!-- integrated graphic swoosh -->
    <path d="M40 430 C120 400 200 470 300 428 L300 520 L40 520 Z"
          fill="${c.sqBg}" opacity="0.14"/>
    <path d="M40 300 C110 322 210 268 300 300" stroke="${c.sqBg}"
          stroke-width="2" fill="none" opacity="0.16"/>

    ${label(f, c)}
    ${condensation(c.seed)}

    <!-- specular sheen bands -->
    <rect x="82" y="86" width="30" height="410" fill="url(#${id}-spec)" opacity="0.85"/>
    <rect x="150" y="86" width="10" height="410" fill="#fff" opacity="0.10"/>
    <rect x="228" y="86" width="26" height="410" fill="#000" opacity="0.16"/>
    <!-- bright aluminium edges -->
    <rect x="61" y="120" width="3" height="360" fill="#fff" opacity="0.28"/>
    <rect x="256" y="120" width="3" height="360" fill="#000" opacity="0.22"/>
  </g>

  <!-- Shoulder sheen -->
  <path d="${SHOULDER}" fill="#fff" opacity="0.06"/>

  <!-- Top rim + lid -->
  <ellipse cx="160" cy="90" rx="62" ry="12" fill="url(#${id}-chrome)"/>
  <ellipse cx="160" cy="87" rx="56" ry="10" fill="url(#${id}-lid)"/>
  <ellipse cx="160" cy="86" rx="49" ry="8" fill="#cbd0d8"/>
  <ellipse cx="160" cy="86" rx="49" ry="8" fill="none" stroke="#7d838c" stroke-width="1" opacity="0.55"/>
  <ellipse cx="160" cy="85" rx="30" ry="5" fill="none" stroke="#8b9099" stroke-width="1.6"/>
  <path d="M146 85 q14 -8 28 0" fill="none" stroke="#71767f" stroke-width="2.2"/>
  <circle cx="160" cy="85" r="1.6" fill="#71767f"/>
</svg>`;
  }

  /* ---------- Label lockup ---------- */
  function label(f, c) {
    return `
    <g text-anchor="middle" font-family="'Sora',system-ui,sans-serif">
      <!-- top banner -->
      <text x="160" y="128" font-size="10.5" letter-spacing="2.6" font-weight="700"
            fill="${c.subCol}">PREMIUM &#183; REFRESHING &#183; REAL</text>
      <line x1="60" y1="140" x2="90" y2="140" stroke="${c.subCol}" stroke-width="1" opacity="0.4"/>
      <line x1="230" y1="140" x2="260" y2="140" stroke="${c.subCol}" stroke-width="1" opacity="0.4"/>

      <!-- SK wordmark -->
      <text x="158" y="214" font-size="96" font-weight="800" letter-spacing="-3"
            fill="${c.wm}">Sk</text>
      <text x="214" y="168" font-size="15" font-weight="700" fill="${c.wm}" opacity="0.75">&#174;</text>
      <!-- leaf sprout on the k -->
      <g transform="translate(196 150) rotate(-22)">
        <path d="M0 0 C10 -17 30 -19 42 -13 C31 -1 11 3 0 0 Z" fill="${c.leaf}"/>
        <path d="M4 -2 C15 -11 29 -13 38 -11" stroke="#ffffff" stroke-width="1.4" fill="none" opacity="0.45"/>
      </g>

      <!-- SQUEEZE tag -->
      <g transform="translate(160 244)">
        <rect x="-88" y="-19" width="176" height="31" rx="15.5" fill="${c.sqBg}"/>
        <text y="2" font-size="17.5" letter-spacing="8.5" font-weight="800"
              fill="${c.sqText}">SQUEEZE</text>
      </g>

      <!-- flavor name -->
      <text x="160" y="${f.line2 ? 300 : 312}" font-size="${f.canFont || 30}"
            font-weight="800" fill="${c.nameCol}">${esc(f.line1)}</text>
      ${f.line2 ? `<text x="160" y="336" font-size="${f.canFont || 30}"
            font-weight="800" fill="${c.nameCol}">${esc(f.line2)}</text>` : ``}
      <text x="160" y="${f.line2 ? 362 : 342}" font-size="12.5" letter-spacing="1.5"
            font-style="italic" fill="${c.subCol}">Naturally Flavored</text>
    </g>

    <!-- fruit motif -->
    <g transform="translate(160 420)">${motif(f)}</g>

    <text x="160" y="470" text-anchor="middle" font-family="'Sora',sans-serif"
          font-size="12" letter-spacing="1" font-weight="600"
          fill="${c.subCol}">12 FL OZ (355 mL)</text>`;
  }

  /* ---------- Condensation droplets (deterministic) ---------- */
  function condensation(seed) {
    const r = rng(seed);
    let s = "";
    for (let i = 0; i < 64; i++) {
      const x = 62 + r() * 196;
      const y = 100 + r() * 384;
      const rad = 0.8 + r() * 3.1;
      const op = 0.1 + r() * 0.32;
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(1)}" fill="#ffffff" opacity="${op.toFixed(2)}"/>`;
      if (rad > 2.2) {
        s += `<circle cx="${(x - rad * 0.3).toFixed(1)}" cy="${(y - rad * 0.35).toFixed(1)}" r="${(rad * 0.4).toFixed(1)}" fill="#ffffff" opacity="${Math.min(0.9, op + 0.4).toFixed(2)}"/>`;
        s += `<path d="M${(x - rad).toFixed(1)} ${y.toFixed(1)} a${rad} ${rad} 0 0 0 ${(rad * 2).toFixed(1)} 0" fill="#000" opacity="0.10"/>`;
      }
    }
    return s;
  }

  /* ---------- Fruit motifs ---------- */
  function motif(f) {
    const a = f.accent, l = lighten(f.accent, 24), d = shade(f.accent, -22);
    const g = "#6FBF3B";
    switch (f.motif) {
      case "citrus":
        return `<g transform="translate(28 -6) rotate(16)">${slice(a, d)}</g>
                <g transform="translate(-46 12) rotate(-14) scale(0.72)">${slice(l, a)}</g>`;
      case "orange":
        return `<g transform="translate(30 -4) rotate(14)">${slice("#F5A623", "#D9770B")}</g>
                <g transform="translate(-44 14) scale(0.7) rotate(-16)">${slice("#FFC24B", "#E08A16")}</g>`;
      case "lemonlime":
        return `<g transform="translate(30 -6) rotate(14)">${slice("#E9EF5B", "#B7C21F")}</g>
                <g transform="translate(-44 12) scale(0.78) rotate(-16)">${slice("#8DD35F", "#4E9E2E")}</g>`;
      case "berry":
        return `${berry(30, -8, a, d)} ${berry(4, -20, l, a, 0.85)} ${berry(-44, 14, a, d, 0.9)}
                <path d="M30 -34 q10 -16 26 -12" stroke="${g}" stroke-width="3.5" fill="none"/>`;
      case "blueberry":
        return `${berry(28, -6, "#4E7EC9", "#2E5AA0")} ${berry(2, -18, "#6E97D6", "#3F6BB5", 0.85)}
                ${berry(-42, 14, "#4E7EC9", "#2E5AA0", 0.9)}
                <circle cx="30" cy="-8" r="3" fill="#fff" opacity="0.5"/>`;
      case "strawberry":
        return `${strawberry(26, -6, a, d)} ${strawberry(-40, 12, l, a, 0.8)}`;
      case "tropical":
        return `<g transform="translate(24 -10)">${leaf(a, d)}</g>
                <g transform="translate(-52 12) scale(0.86)">${leaf(l, a)}</g>
                <circle cx="-30" cy="-16" r="8" fill="${l}"/>`;
      case "cherry":
        return `${cherry(24, -4, a, d)} ${cherry(-40, 12, l, a, 0.85)}
                <path d="M24 -30 q26 -26 50 -16" stroke="#6a4a2a" stroke-width="3.5" fill="none"/>`;
      case "ginger":
        return `<g transform="translate(28 -6) rotate(14)">${slice(l, a)}</g>
                <path d="M-52 8 q18 -14 40 -2 q-6 22 -30 24 q-16 -8 -10 -22z" fill="${d}" opacity="0.9"/>`;
      case "cola":
        return `<path d="M-60 6 C-20 -14 20 22 62 -2" stroke="${a}" stroke-width="5" fill="none" opacity="0.55"/>
                <path d="M-60 20 C-20 0 20 34 62 12" stroke="${l}" stroke-width="3.5" fill="none" opacity="0.4"/>
                <circle cx="46" cy="-8" r="4" fill="${a}" opacity="0.6"/>
                <circle cx="-46" cy="26" r="3" fill="${l}" opacity="0.6"/>`;
      default:
        return `<circle r="30" fill="${l}" opacity="0.3"/>`;
    }
  }

  function slice(fill, stroke) {
    return `<g opacity="0.95">
      <circle r="34" fill="${fill}"/>
      <circle r="34" fill="none" stroke="#fff" stroke-width="2.4" opacity="0.6"/>
      ${Array.from({ length: 8 }).map((_, i) => `<path d="M0 0 L${(Math.cos(i * Math.PI / 4) * 28).toFixed(1)} ${(Math.sin(i * Math.PI / 4) * 28).toFixed(1)}" stroke="#fff" stroke-width="1.8" opacity="0.5"/>`).join("")}
      <circle r="6" fill="#fff" opacity="0.75"/></g>`;
  }
  function berry(x, y, fill, stroke, s) { s = s || 1; return `<g transform="translate(${x} ${y}) scale(${s})">
    <circle cx="-9" cy="0" r="12" fill="${fill}"/><circle cx="9" cy="-2" r="11" fill="${stroke}"/>
    <circle cx="0" cy="11" r="12" fill="${fill}"/><circle cx="-3" cy="-3" r="4" fill="#fff" opacity="0.5"/></g>`; }
  function cherry(x, y, fill, stroke, s) { s = s || 1; return `<g transform="translate(${x} ${y}) scale(${s})">
    <circle cx="-11" cy="6" r="14" fill="${fill}"/><circle cx="12" cy="9" r="14" fill="${stroke}"/>
    <circle cx="-15" cy="1" r="4" fill="#fff" opacity="0.6"/></g>`; }
  function strawberry(x, y, fill, stroke, s) { s = s || 1; return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 -14 C16 -14 20 0 0 22 C-20 0 -16 -14 0 -14Z" fill="${fill}"/>
    <path d="M-11 -13 L0 -20 L11 -13 L0 -8Z" fill="#5aa15a"/>
    ${[[-6, -2], [4, 0], [-2, 8], [6, 10], [-8, 8]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="1.4" fill="#fff" opacity="0.8"/>`).join("")}</g>`; }
  function leaf(fill, stroke) { return `<path d="M0 0 Q30 -44 68 -38 Q46 6 0 0Z" fill="${fill}"/>
    <path d="M6 -4 Q30 -30 60 -33" stroke="#fff" stroke-width="2" fill="none" opacity="0.5"/>`; }

  /* ---------- config + colour utils ---------- */
  function canCfg(f) {
    const c = f.can || {};
    const body = c.body || f.c1;
    const light = isLight(body);
    const sqBg = c.sqBg || f.accent;
    return {
      body,
      bodyDark: c.bodyDark || shade(body, -34),
      bodyLight: lighten(body, light ? 12 : 30),
      bodyPeak: lighten(body, light ? 22 : 48),
      wm: c.wm || (light ? "#1a1420" : f.cream || "#fff"),
      sqBg,
      sqText: c.sqText || (isLight(sqBg) ? "#191019" : "#ffffff"),
      nameCol: c.nameCol || c.wm || (light ? "#1a1420" : f.cream || "#fff"),
      subCol: c.subCol || (light ? "rgba(30,22,34,.7)" : "rgba(255,255,255,.72)"),
      leaf: c.leaf || "#6FBF3B",
      seed: (c.seed || hash(f.id)) >>> 0
    };
  }

  function rng(seed) { let t = seed >>> 0; return function () {
    t += 0x6D2B79F5; let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h; }

  function hexToRgb(h) { h = h.replace("#", ""); if (h.length === 3) h = h.split("").map(x => x + x).join("");
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }; }
  function toHex(r, g, b) { const c = v => ("0" + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2); return "#" + c(r) + c(g) + c(b); }
  function lighten(h, a) { const { r, g, b } = hexToRgb(h); return toHex(r + a, g + a, b + a); }
  function shade(h, a) { return lighten(h, a); }
  function isLight(h) { const { r, g, b } = hexToRgb(h); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.62; }
  function esc(s) { return String(s).replace(/[<>&]/g, ch => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[ch])); }

  global.SKCan = { build: buildCan };
})(window);
