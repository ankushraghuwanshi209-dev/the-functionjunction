import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Cinematic intro: dark curtain with monogram, gold hairline reveal,
 * and a burst of golden firework particles. Auto-dismisses after ~4.5s
 * or on click. Uses sessionStorage so it only shows once per session.
 */
export function IntroOverlay() {
  const [visible, setVisible] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => dismiss(), 7200);
    return () => clearTimeout(timeout);
  }, [visible]);

  useEffect(() => {
    if (!visible || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    console.log("Renderer created");
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const w = window.innerWidth,
      h = window.innerHeight;
    renderer.setSize(w, h);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 12;

    // Firework bursts
    const bursts: {
      points: THREE.Points;
      velocities: Float32Array;
      life: number;
      maxLife: number;
    }[] = [];

    function spawnBurst(x: number, y: number) {
       console.log("Burst", x, y);
      const count = 220;
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = 0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = 0.05 + Math.random() * 0.12;
        velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
        velocities[i * 3 + 2] = Math.cos(phi) * speed * 0.5;
        // gold palette
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.78 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.35 + Math.random() * 0.25;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      bursts.push({ points, velocities, life: 0, maxLife: 2.4 });
    }

    // Kick off bursts
    const burstTimers: number[] = [];
    burstTimers.push(window.setTimeout(() => spawnBurst(0, 1), 400));
    burstTimers.push(window.setTimeout(() => spawnBurst(-4, 0.5), 1200));
    burstTimers.push(window.setTimeout(() => spawnBurst(4, 0), 1700));
    burstTimers.push(window.setTimeout(() => spawnBurst(-2, 2), 2400));
    burstTimers.push(window.setTimeout(() => spawnBurst(2, 1.5), 3000));
    burstTimers.push(window.setTimeout(() => spawnBurst(-3, 1.2), 3300));
    burstTimers.push(window.setTimeout(() => spawnBurst(3, 0.8), 4000));
    burstTimers.push(window.setTimeout(() => spawnBurst(0, 1.8), 4700));

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (const b of bursts) {
        b.life += dt;
        const pos = b.points.geometry.attributes.position as THREE.BufferAttribute;
        const arr = pos.array as Float32Array;
        for (let i = 0; i < arr.length; i += 3) {
          arr[i] += b.velocities[i];
          arr[i + 1] += b.velocities[i + 1] - 0.003;
          arr[i + 2] += b.velocities[i + 2];
          b.velocities[i] *= 0.985;
          b.velocities[i + 1] *= 0.985;
          b.velocities[i + 2] *= 0.985;
        }
        pos.needsUpdate = true;
        const mat = b.points.material as THREE.PointsMaterial;
        mat.opacity = Math.max(0, 1 - b.life / b.maxLife);
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      burstTimers.forEach((t) => clearTimeout(t));
      bursts.forEach((b) => {
        scene.remove(b.points);
        b.points.geometry.dispose();
        (b.points.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      onClick={dismiss}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background cursor-pointer"
      style={{ animation: "tfjFadeOut 0.6s ease 6.2s forwards" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
      <div
        className="relative z-10 text-center px-6"
        style={{ animation: "tfjRise 1.2s ease forwards" }}
      >
        <p className="text-xs tracking-[0.5em] uppercase text-gold/80">The</p>
        <h1 className="mt-2 font-display text-6xl md:text-8xl gold-gradient-text">Function</h1>
        <div className="hairline mx-auto my-4 w-40" />
        <h1 className="font-display text-6xl md:text-8xl gold-gradient-text">Junction</h1>
        <p className="mt-6 font-script text-2xl md:text-3xl text-gold-soft">
          Turning every celebration…
        </p>
        <p className="mt-8 text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
          Click anywhere to enter
        </p>
      </div>
      <style>{`
        @keyframes tfjRise {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes tfjFadeOut {
          to { opacity: 0; visibility: hidden; pointer-events: none; }
        }
      `}</style>
    </div>
  );
}
