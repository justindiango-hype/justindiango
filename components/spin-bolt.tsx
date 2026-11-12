"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type SpinBoltHandle = {
  /** Spin much faster for a moment (e.g. during a strike). */
  kick: (amount?: number) => void;
  /** Hold an extra spin speed (degrees per second) until changed. */
  setSpin: (extra: number) => void;
};

/**
 * The glossy 3D bolt, rendered live with three.js (same model, material and
 * lights as the brand renders), so it spins perfectly smoothly at any speed.
 * It turns on its own, spins faster when you scroll, leans toward the mouse,
 * and flashes on the 2-second "jd:beat" (the same beat as "FAST").
 */
export const SpinBolt = forwardRef<SpinBoltHandle, { className?: string; speed?: number }>(function SpinBolt(
  { className = "", speed = 40 },
  ref,
) {
  const wrap = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const boost = useRef(0);
  const extra = useRef(0);

  useImperativeHandle(
    ref,
    () => ({
      kick: (amount = 1400) => (boost.current = Math.max(boost.current, amount)),
      setSpin: (v: number) => (extra.current = v),
    }),
    [],
  );

  useEffect(() => {
    const host = wrap.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: the bolt simply isn't drawn
    }
    const size = () => host.clientWidth || 300;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size(), size(), false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const canvas = renderer.domElement;
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
    host.prepend(canvas);

    const scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(renderer);
    const env = pm.fromScene(new RoomEnvironment(), 0.03).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.28;

    // Bolt outline (same as the logo), in a 58×96 box, centred.
    const pts = [[30, 0], [0, 52], [24, 52], [14, 96], [58, 38], [34, 38], [52, 0]];
    const shape = new THREE.Shape();
    pts.forEach(([x, y], i) => {
      const X = (x - 29) / 40;
      const Y = -(y - 48) / 40;
      if (i) shape.lineTo(X, Y);
      else shape.moveTo(X, Y);
    });
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.32, bevelEnabled: true, bevelThickness: 0.09, bevelSize: 0.07, bevelSegments: 10, curveSegments: 4 });
    geo.center();
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#DEF434"),
      metalness: 0.05,
      roughness: 0.28,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: new THREE.Color("#a8c400"),
      emissiveIntensity: 0.18,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.z = -0.2;
    const spin = new THREE.Group();
    spin.add(mesh);
    const tilt = new THREE.Group();
    tilt.rotation.x = 0.18;
    tilt.add(spin);
    scene.add(tilt);

    const key = new THREE.DirectionalLight("#fffbe0", 1.6);
    key.position.set(-2, 3, 4);
    const rim1 = new THREE.DirectionalLight("#0F7FC4", 5);
    rim1.position.set(4, -1, -2);
    const rim2 = new THREE.DirectionalLight("#3a5cff", 3);
    rim2.position.set(-4, -2, -3);
    scene.add(key, rim1, rim2);

    const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    cam.position.set(0, 0, 5.4);

    let angle = Math.random() * Math.PI * 2;
    let last = performance.now();
    let raf = 0;
    let lastY = window.scrollY;
    let mx = 0;
    let my = 0;
    let lx = 0;
    let ly = 0;
    let glow = 0;

    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const ro = new ResizeObserver(() => renderer.setSize(size(), size(), false));
    ro.observe(host);

    const draw = () => {
      spin.rotation.y = angle;
      tilt.rotation.x = 0.18 + ly * 0.25;
      tilt.rotation.z = -lx * 0.18;
      mat.emissiveIntensity = 0.18 + glow * 0.9;
      renderer.render(scene, cam);
    };

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (document.hidden) return;
      // Scroll speed adds spin.
      const y = window.scrollY;
      const v = Math.abs(y - lastY) / Math.max(dt, 0.001);
      lastY = y;
      boost.current = Math.max(boost.current * Math.pow(0.04, dt), Math.min(900, v * 0.6));
      angle += ((speed + extra.current + boost.current) * Math.PI) / 180 * dt;
      // Lean toward the mouse, eased.
      const k = Math.min(1, dt * 4);
      lx += (mx - lx) * k;
      ly += (my - ly) * k;
      glow *= Math.pow(0.02, dt);
      draw();
    }
    if (reduce) draw();
    else raf = requestAnimationFrame(tick);

    // Flash on the beat.
    const onBeat = () => {
      glow = 1;
      boost.current = Math.max(boost.current, 500);
      const fl = flash.current;
      if (!fl) return;
      fl.classList.remove("is-beat");
      void fl.offsetWidth;
      fl.classList.add("is-beat");
    };
    if (!reduce) window.addEventListener("jd:beat", onBeat);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("jd:beat", onBeat);
      geo.dispose();
      mat.dispose();
      env.dispose();
      pm.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [speed]);

  return (
    <div ref={wrap} className={`relative aspect-square ${className}`} aria-hidden="true">
      <div ref={flash} className="bolt-beat pointer-events-none absolute inset-[-20%] rounded-full" />
    </div>
  );
});
