/* =============================================================
   GRIP — procedural premium smart bottle (original 3D asset)
   Matched to the product reference: a smooth lathe-turned
   insulated bottle with a powder-coated MATTE black finish
   (grain texture), a continuous curved shoulder, a polished
   stainless-steel mouth collar, a brushed-steel "GRIP" engraving
   running up the body, and a rounded dome smart cap (recessed
   button + emissive LED status ring + side USB-C port) that
   lifts away during the cap close-up.
   useImperativeHandle exposes { group, cap, led }.
   ============================================================= */
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";

/* fine powder-coat grain -> used as roughness + bump map for a matte finish */
function useGrain() {
  return useMemo(() => {
    const s = 256;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const ctx = c.getContext("2d");
    const img = ctx.createImageData(s, s);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 150 + Math.floor(Math.random() * 105); // 150..255
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    return tex;
  }, []);
}

/* brushed-steel GRIP engraving (transparent) for a curved decal on the body */
function useGripDecal() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 512;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.save();
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = "800 190px Sora, Arial, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.letterSpacing = "10px";
    ctx.fillStyle = "#eef0f4";
    ctx.fillText("GRIP", 0, 0);
    ctx.restore();
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);
}

const Bottle = forwardRef(function Bottle({ bodyColor = "#101012" }, ref) {
  const group = useRef();
  const led = useRef();
  const cap = useRef();
  const grain = useGrain();
  const grip = useGripDecal();

  useImperativeHandle(ref, () => ({ group: group.current, led: led.current, cap: cap.current }), []);

  // smooth bottle silhouette (radius, height) — straight body -> curved shoulder -> neck
  const bodyProfile = useMemo(() => [
    [0.0, -1.0], [0.30, -1.0], [0.46, -0.96], [0.5, -0.88],
    [0.5, 0.5], [0.495, 0.68], [0.478, 0.85], [0.44, 0.99],
    [0.38, 1.1], [0.31, 1.18], [0.28, 1.24], [0.28, 1.3], [0.255, 1.32],
  ].map(([x, y]) => new THREE.Vector2(x, y)), []);

  // rounded dome cap silhouette (open at the bottom rim)
  const capProfile = useMemo(() => [
    [0.20, 0.0], [0.32, 0.02], [0.33, 0.12], [0.33, 0.24],
    [0.315, 0.31], [0.27, 0.38], [0.17, 0.43], [0.09, 0.44], [0.0, 0.445],
  ].map(([x, y]) => new THREE.Vector2(x, y)), []);

  const matte = { color: bodyColor, metalness: 0.25, roughness: 0.85, roughnessMap: grain, bumpMap: grain, bumpScale: 0.003, clearcoat: 0.08, envMapIntensity: 0.55 };
  const capMatte = { color: "#0c0c0e", metalness: 0.25, roughness: 0.82, roughnessMap: grain, bumpMap: grain, bumpScale: 0.003, clearcoat: 0.1, envMapIntensity: 0.6 };
  const steel = { color: "#cfd0d6", metalness: 1, roughness: 0.16, envMapIntensity: 1.35 };

  return (
    <group ref={group} dispose={null}>
      {/* body */}
      <mesh castShadow>
        <latheGeometry args={[bodyProfile, 96]} />
        <meshPhysicalMaterial {...matte} />
      </mesh>

      {/* subtle base seam */}
      <mesh position={[0, -0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.006, 8, 96]} />
        <meshStandardMaterial color="#050506" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* brushed-steel GRIP decal — centered on the body's vertical mid-line */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.505, 0.505, 0.55, 64, 1, true, Math.PI / 2 - 0.45, 0.9]} />
        <meshStandardMaterial map={grip} transparent alphaTest={0.42} color="#dfe0e6" metalness={1} roughness={0.28} envMapIntensity={1.4} side={THREE.DoubleSide} />
      </mesh>

      {/* polished steel mouth collar (exposed threads) */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.26, 0.265, 0.2, 96]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {[1.25, 1.3, 1.35].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.263, 0.006, 8, 96]} />
          <meshStandardMaterial color="#9a9ba3" metalness={1} roughness={0.3} />
        </mesh>
      ))}
      {/* dark inner cavity */}
      <mesh position={[0, 1.12, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 48, 1, true]} />
        <meshStandardMaterial color="#050508" metalness={0.2} roughness={0.95} side={THREE.BackSide} />
      </mesh>

      {/* ---- rounded dome smart cap (lifts away during the close-up) ---- */}
      <group ref={cap} position={[0, 1.42, 0]}>
        {/* dome shell */}
        <mesh castShadow>
          <latheGeometry args={[capProfile, 96]} />
          <meshPhysicalMaterial {...capMatte} />
        </mesh>
        {/* inner thread collar at the cap opening */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.255, 0.255, 0.12, 64, 1, true]} />
          <meshStandardMaterial color="#141416" metalness={0.5} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* recessed smart button on the (slightly flattened) top */}
        <mesh position={[0, 0.44, 0.03]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 48]} />
          <meshPhysicalMaterial color="#08080b" metalness={0.4} roughness={0.4} clearcoat={0.5} />
        </mesh>
        {/* emissive LED status ring around the button */}
        <mesh ref={led} position={[0, 0.45, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.078, 0.008, 16, 64]} />
          <meshStandardMaterial color="#a06bff" emissive="#a06bff" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>

        {/* USB-C charging port on the side */}
        <group position={[0.325, 0.18, 0]}>
          <mesh>
            <boxGeometry args={[0.03, 0.038, 0.11]} />
            <meshStandardMaterial color="#050507" metalness={0.3} roughness={0.6} />
          </mesh>
          <mesh position={[0.006, 0, 0]}>
            <boxGeometry args={[0.02, 0.02, 0.075]} />
            <meshStandardMaterial color="#20202a" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
});

export default Bottle;
