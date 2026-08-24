/* =============================================================
   GRIP — R3F scene + scroll-driven cinematic choreography
   A shared `progress` ref (0..1, written by GSAP ScrollTrigger)
   drives a 12-stop camera path, while the bottle combines:
     - scroll-keyframed orientation (damped)
     - continuous idle rotation
     - inertial spin from scroll velocity (decays)
     - subtle pointer parallax
   Plus: cap LED pulse, particle depth field, purple accent
   light, procedural studio reflections, and drei Html cap
   labels revealed during the smart-cap close-up.
   ============================================================= */
import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import Bottle from "./Bottle.jsx";

/* camera keyframes across the scroll (progress 0..1) */
const STOPS = [
  { cam: [0.0, 0.20, 5.4], tgt: [0, 0.05, 0], rotY: 0.0 },  // 0 hero
  { cam: [1.25, 0.40, 4.6], tgt: [0, 0.10, 0], rotY: 0.6 }, // 1 transition
  { cam: [-1.05, 0.10, 4.2], tgt: [0, 0.00, 0], rotY: 1.1 }, // 2 tech intro
  { cam: [1.45, -0.10, 3.5], tgt: [0, -0.05, 0], rotY: 1.6 }, // 3 hydration tracking
  { cam: [-1.35, -0.20, 3.5], tgt: [0, -0.10, 0], rotY: 2.1 }, // 4 intake monitoring
  { cam: [0.0, 1.75, 1.95], tgt: [0, 1.30, 0], rotY: 2.2 },  // 5 cap close-up
  { cam: [0.95, 1.50, 2.5], tgt: [0, 1.20, 0], rotY: 2.6 },  // 6 LED / reminders
  { cam: [-0.85, 1.15, 2.9], tgt: [0, 1.00, 0], rotY: 3.0 }, // 7 battery / charging
  { cam: [1.15, 0.20, 3.9], tgt: [0, 0.05, 0], rotY: 3.5 },  // 8 hydration intelligence
  { cam: [-1.25, 0.00, 4.1], tgt: [0, 0.00, 0], rotY: 4.0 }, // 9 everyday life
  { cam: [1.05, 0.00, 3.7], tgt: [0, 0.00, 0], rotY: 4.5 },  // 10 specifications
  { cam: [0.0, 0.15, 5.1], tgt: [0, 0.05, 0], rotY: 5.0 },   // 11 final CTA
];

function smoothstep(t) { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); }
function windowAt(p, c, w) { return 1 - Math.min(1, Math.abs(p - c) / w); }

function sampleVec(key, p, out) {
  const n = STOPS.length - 1, f = p * n;
  let i = Math.floor(f); if (i >= n) i = n - 1;
  const t = smoothstep(f - i), a = STOPS[i][key], b = STOPS[i + 1][key];
  out.set(THREE.MathUtils.lerp(a[0], b[0], t), THREE.MathUtils.lerp(a[1], b[1], t), THREE.MathUtils.lerp(a[2], b[2], t));
  return out;
}
function sampleNum(key, p) {
  const n = STOPS.length - 1, f = p * n;
  let i = Math.floor(f); if (i >= n) i = n - 1;
  return THREE.MathUtils.lerp(STOPS[i][key], STOPS[i + 1][key], smoothstep(f - i));
}

/* ---------- particle depth field ---------- */
function Particles({ count, progress, reduced }) {
  const pts = useRef();
  const mat = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 7;
      const a = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * r * (0.4 + Math.random() * 0.6);
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = Math.sin(a) * r - 2;
    }
    return arr;
  }, [count]);

  useFrame((state, dt) => {
    const p = progress?.current ?? 0;
    if (pts.current && !reduced) pts.current.rotation.y += dt * 0.02;
    if (mat.current) mat.current.opacity = smoothstep((p - 0.12) / 0.2) * 0.55;
  });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial ref={mat} size={0.028} color="#b9a6ff" transparent opacity={0} depthWrite={false} sizeAttenuation />
    </points>
  );
}

export default function Scene({ progress, pointer, reduced = false, bodyColor = "#16161a", isMobile = false }) {
  const bottle = useRef();
  const purpleLight = useRef();
  const { camera } = useThree();

  const camPos = useRef(new THREE.Vector3(...STOPS[0].cam));
  const camTgt = useRef(new THREE.Vector3(...STOPS[0].tgt));
  const tmpP = useRef(new THREE.Vector3());
  const tmpT = useRef(new THREE.Vector3());
  const par = useRef({ x: 0, y: 0 });
  const st = useRef({ prevP: 0, idle: 0, inertia: 0, base: 0, tiltX: 0 });

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 30);
    const p = progress?.current ?? 0;
    const s = st.current;

    // scroll velocity -> inertia
    const vel = (p - s.prevP) / Math.max(d, 1e-3);
    s.prevP = p;

    // camera keyframe sample (+ aspect pull-back)
    const aspect = state.size.width / state.size.height;
    const zBoost = aspect < 1 ? 1.55 : aspect < 1.4 ? 1.2 : 1;
    sampleVec("cam", p, tmpP.current); tmpP.current.z *= zBoost;
    sampleVec("tgt", p, tmpT.current);

    const lam = reduced ? 20 : 4.2;
    camPos.current.x = THREE.MathUtils.damp(camPos.current.x, tmpP.current.x, lam, d);
    camPos.current.y = THREE.MathUtils.damp(camPos.current.y, tmpP.current.y, lam, d);
    camPos.current.z = THREE.MathUtils.damp(camPos.current.z, tmpP.current.z, lam, d);
    camTgt.current.x = THREE.MathUtils.damp(camTgt.current.x, tmpT.current.x, lam, d);
    camTgt.current.y = THREE.MathUtils.damp(camTgt.current.y, tmpT.current.y, lam, d);
    camTgt.current.z = THREE.MathUtils.damp(camTgt.current.z, tmpT.current.z, lam, d);

    // pointer parallax (desktop only) — driven by a page-level pointer ref
    const pxT = isMobile ? 0 : pointer?.current?.x ?? 0;
    const pyT = isMobile ? 0 : pointer?.current?.y ?? 0;
    par.current.x = THREE.MathUtils.damp(par.current.x, pxT, 5, d);
    par.current.y = THREE.MathUtils.damp(par.current.y, pyT, 5, d);

    camera.position.set(
      camPos.current.x + par.current.x * 0.35,
      camPos.current.y + par.current.y * 0.22,
      camPos.current.z
    );
    camera.lookAt(camTgt.current);

    // bottle rotation: keyframe base + idle + decaying inertia
    const b = bottle.current;
    if (b?.group) {
      s.base = THREE.MathUtils.damp(s.base, sampleNum("rotY", p), 3.5, d);
      s.idle += d * (reduced ? 0 : 0.16);
      s.inertia += vel * 0.5;
      s.inertia *= Math.pow(0.88, d * 60);       // frame-rate independent decay
      s.inertia = THREE.MathUtils.clamp(s.inertia, -2, 2);
      b.group.rotation.y = s.base + s.idle + s.inertia;
      s.tiltX = THREE.MathUtils.damp(s.tiltX, par.current.y * 0.06, 4, d);
      b.group.rotation.x = s.tiltX;
    }

    // exploded cap — lifts away from the body during the cap close-up
    if (b?.cap) {
      const lift = smoothstep(windowAt(p, 0.45, 0.14)) * 0.5;
      b.cap.position.y = THREE.MathUtils.damp(b.cap.position.y, 1.4 + lift, 5, d);
    }

    // cap LED pulse — subtle idle glow, strong during cap / UV-C focus
    if (b?.led) {
      const capFocus = smoothstep(windowAt(p, 0.45, 0.16)) * 2.6;
      const uvc = smoothstep(windowAt(p, 0.6, 0.12)) * 2.2;
      b.led.emissiveIntensity = 0.7 + Math.sin(state.clock.elapsedTime * 3) * 0.2 + capFocus + uvc;
    }

    // purple accent light peaks around cap + finale
    if (purpleLight.current) {
      const near = Math.max(smoothstep(windowAt(p, 0.55, 0.22)), smoothstep((p - 0.85) / 0.15));
      purpleLight.current.intensity = near * 7;
    }

    // cap labels fade via the --cap-opacity CSS var (DOM overlay in GripExperience)
  });

  return (
    <>
      <ambientLight intensity={reduced ? 0.7 : 0.5} />
      <directionalLight position={[4, 6, 4]} intensity={1.35} castShadow={!isMobile} shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 2, -3]} intensity={0.45} color="#dfe4ee" />
      {/* purple = technology indicator only; ramps up during cap / UV-C focus */}
      <pointLight ref={purpleLight} position={[0, 1.3, 2]} color="#a06bff" intensity={0} distance={10} />

      <Bottle ref={bottle} bodyColor={bodyColor} />

      {!reduced && <Particles count={isMobile ? 800 : 2200} progress={progress} reduced={reduced} />}

      <ContactShadows position={[0, -0.92, 0]} opacity={0.55} scale={7} blur={2.8} far={4.5} color="#120f1e" />

      {/* neutral studio reflections — soft grays/whites, no colored streaks on the body */}
      <Environment resolution={isMobile ? 128 : 256}>
        <Lightformer intensity={2.3} position={[0, 3, 3]} scale={[9, 9, 1]} color="#ffffff" />
        <Lightformer intensity={1.0} position={[-4, 1, 2]} scale={[3, 9, 1]} color="#eef1f6" />
        <Lightformer intensity={1.0} position={[4, 1, 2]} scale={[3, 9, 1]} color="#ffffff" />
        <Lightformer intensity={0.5} position={[0, -3, 2]} scale={[9, 4, 1]} color="#c8ccd6" />
      </Environment>
    </>
  );
}
