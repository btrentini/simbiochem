"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Interactive hero physics.
 *
 * Bodies (protein + 4 molecules) float and tumble slowly in 3D (SO(3) — an
 * orthographic projection of the flat render, so it foreshortens and flips).
 * You can DRAG any whole object; while dragged it carries your mouse's momentum
 * and behaves as (near) infinite mass, so it plows through and imparts your
 * mouse force to whatever it hits (F ~ your mouse speed). A firm smash destroys
 * both objects into point clouds: each point disperses a short distance from its
 * centroid at its own rate, holds ~3s, then contracts back and the object fades
 * in rebuilt (bigger objects reform slower).
 *
 * Hitting a wall/corner kicks a body off in a random inward direction (never
 * sticks). Point clouds never collide — their points pass through other clouds
 * and solids; on overlap both vibrate and veer off randomly, and a cloud only
 * begins contracting 2s after its last overlap ends.
 *
 * Rendered on a pointer-events-none canvas; drag is handled on window pointer
 * events (interactive controls in the hero still work).
 */

type Spec = {
  src: string;
  size: number;
  radiusF: number;
  massF: number;
  opacity: number;
  palette: string[];
  atoms: number;
  glow?: boolean;
};

const SPECS: Spec[] = [
  { src: "/hero/protein.png", size: 340, radiusF: 0.4, massF: 3.2, opacity: 0.9, palette: ["#22b9aa", "#52d3c4", "#76b900", "#8ce6da", "#e0503b"], atoms: 22 },
  { src: "/hero/mol-caffeine.png", size: 104, radiusF: 0.46, massF: 1, opacity: 0.88, palette: ["#e8e8e8", "#3f3f3f", "#3b6fe0", "#e0503b"], atoms: 16 },
  { src: "/hero/mol-nacl.png", size: 120, radiusF: 0.44, massF: 1.2, opacity: 0.82, palette: ["#a75bd6", "#7ec13a"], atoms: 16 },
  { src: "/hero/mol-dna.png", size: 132, radiusF: 0.42, massF: 1.1, opacity: 0.85, palette: ["#e0b23b", "#3bb0e0", "#e0503b", "#7ec13a", "#e8e8e8"], atoms: 18 },
  { src: "/hero/mol-c60.png", size: 104, radiusF: 0.46, massF: 1, opacity: 0.95, palette: ["#5a5a5a", "#3a3a3a", "#6d6d6d"], atoms: 20, glow: true },
];

type Atom = {
  rx: number;
  ry: number;
  dispX: number;
  dispY: number;
  tgx: number; // current roaming target (local offset) while shattered
  tgy: number;
  rt: number; // frames until it picks a new roaming target
  trail: { x: number; y: number }[];
  k: number;
  r: number;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
};
type Body = {
  spec: Spec;
  img: HTMLImageElement;
  size: number;
  radius: number;
  mass: number;
  contractK: number;
  maxDisp: number;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  cruise: number;
  ex: number;
  ey: number;
  ez: number;
  vex: number;
  vey: number;
  vez: number;
  m00: number;
  m01: number;
  m10: number;
  m11: number;
  wander: number;
  state: "assembled" | "expanded" | "contract";
  hold: number;
  vib: number;
  jux: boolean;
  cooldown: number;
  pulse: number;
  dust: Particle[];
  emitAcc: number;
  atoms: Atom[];
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  fe: number; // per-speck fade exponent — each fades at its own rate
  c: string;
};

const GOLDEN = 2.399963229728653;
const TAU = Math.PI * 2;

// tunables
const HEADING_NOISE = 0.14; // Wiener drift of the heading per frame
const SPEED_RELAX = 0.03; // ease speed back to cruise so bodies never linger
const MAX_SPEED = 12; // headroom for throws / smashes
const MOUSE_R = 150;
const RESTITUTION = 1;
const SHATTER_IMPACT = 1; // min approach speed for a collision to be able to shatter
const SHATTER_PROB = 0.45; // ...and even then it only destroys 45% of the time
const WALL_SPREAD = 1.6;
const DRAG_MAXV = 26;
const GRAB_MARGIN = 16;
const ATOM_DAMP = 0.8;
const ROAM_K = 0.05; // spring toward the roaming target (smooth but quick)
const BROWNIAN = 0.7; // per-frame random wobble while shattered
const REACH = 3;
const HOLD_FRAMES = 3 * 60; // dispersed a few seconds before contracting
const JUX_FRAMES = 1 * 60; // after an overlap ends, wait 1s then collapse back
const CONTRACT_MAX = 10 * 60;
const VIB = 1.9;
const VIB_DECAY = 0.85;
const REFORM_IMMUNITY = 24;
const DUST_ENABLED = false; // dust wake off for now (flip to true to re-enable)
const DUST_LIFE = 300; // base speck lifetime (much longer wake; randomised per speck)
const DUST_MAX = 260; // max dust specks per object
const DUST_ALPHA = 0.42; // subtler / less sparkly
const EMIT_SPACING = 5; // emit a speck per this many px travelled
const ATOM_TRAIL_LEN = 100; // per-point trail while shattered (~1.6s)
const ATOM_TRAIL_ALPHA = 0.09; // thinner + more transparent

// Narrow viewports run the full cast too, but scaled to the pane and with
// dragging off. Matches Tailwind's `sm` breakpoint so it agrees with the CSS
// around it.
const COMPACT_QUERY = "(max-width: 639px)";

function makeAtoms(radius: number, palette: string[], n: number): Atom[] {
  const atoms: Atom[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const ang = i * GOLDEN;
    const rr = radius * 0.82 * Math.sqrt(t);
    atoms.push({ rx: Math.cos(ang) * rr, ry: Math.sin(ang) * rr, dispX: 0, dispY: 0, tgx: 0, tgy: 0, rt: 0, trail: [], k: 0.06, r: 3 + (i % 3), color: palette[i % palette.length], x: 0, y: 0, vx: 0, vy: 0 });
  }
  return atoms;
}

export function HeroPhysics() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // null until measured on the client, so we never pick a cast (or load a
  // sprite) before we know which viewport we are on.
  const [compact, setCompact] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY);
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (compact === null) return;
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let bodies: Body[] = [];

    // pointer / drag state
    let mx = -9999;
    let my = -9999;
    let dragging: Body | null = null;
    let dragOX = 0;
    let dragOY = 0;
    let lastPX = 0;
    let lastPY = 0;
    let lastPT = 0;
    let mvx = 0;
    let mvy = 0;

    const imgs = SPECS.map((s) => {
      const im = new Image();
      im.onload = () => {
        if (reduce) draw();
      };
      im.src = s.src;
      return im;
    });

    function updateMatrix(b: Body) {
      // Rigid in-plane rotation (rotate + translate). A flat billboard tumbled
      // through real 3D just goes edge-on and looks like a spinning plate, so we
      // keep the rotation in the screen plane where the 3D-shaded render reads
      // as a solid object turning.
      const c = Math.cos(b.ez);
      const s = Math.sin(b.ez);
      b.m00 = c;
      b.m01 = -s;
      b.m10 = s;
      b.m11 = c;
    }

    function initBodies() {
      // On phones the hero pane is taller than the viewport, so keep the
      // starting points inside the first screenful — anything past ~0.75 begins
      // below the fold and reads as a missing structure.
      const layout = compact
        ? [
            [0.74, 0.14],
            [0.22, 0.30],
            [0.78, 0.45],
            [0.28, 0.60],
            [0.60, 0.72],
          ]
        : [
            [0.74, 0.5],
            [0.14, 0.24],
            [0.2, 0.74],
            [0.56, 0.28],
            [0.5, 0.72],
          ];
      // The protein is 340px, wider than a phone. Scale the cast to the pane so
      // bodies stay whole and have somewhere to travel.
      const sizeScale = compact ? Math.max(0.45, Math.min(1, w / 900)) : 1;
      bodies = SPECS.map((s, i) => {
        const size = s.size * sizeScale;
        const radius = size * s.radiusF;
        const b: Body = {
          spec: s,
          img: imgs[i],
          size,
          radius,
          mass: radius * s.massF,
          contractK: 0.02 * (110 / size),
          maxDisp: radius * 1.6,
          x: layout[i][0] * w,
          y: layout[i][1] * h,
          prevX: layout[i][0] * w,
          prevY: layout[i][1] * h,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          cruise: 1.7 + Math.random() * 0.9,
          ex: Math.random() * TAU,
          ey: Math.random() * TAU,
          ez: Math.random() * TAU,
          vex: 0,
          vey: 0,
          vez: (Math.random() - 0.5) * 0.016,
          m00: 1,
          m01: 0,
          m10: 0,
          m11: 1,
          wander: Math.random() * TAU,
          state: "assembled",
          hold: 0,
          vib: 0,
          jux: false,
          cooldown: 0,
          pulse: 0,
          dust: [],
          emitAcc: 0,
          atoms: makeAtoms(radius, s.palette, s.atoms),
        };
        updateMatrix(b);
        return b;
      });
    }

    function resize() {
      const rect = parent!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!bodies.length && w > 0) initBodies();
      if (reduce && bodies.length) draw();
    }
    resize();

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mx = x;
      my = y;
      const now = performance.now();
      const ddt = Math.max(now - lastPT, 8);
      mvx = ((x - lastPX) / ddt) * 16.667;
      mvy = ((y - lastPY) / ddt) * 16.667;
      const sp = Math.hypot(mvx, mvy);
      if (sp > DRAG_MAXV) {
        mvx = (mvx / sp) * DRAG_MAXV;
        mvy = (mvy / sp) * DRAG_MAXV;
      }
      lastPX = x;
      lastPY = y;
      lastPT = now;
      if (dragging) {
        const r = dragging.radius;
        dragging.x = Math.max(r, Math.min(w - r, x + dragOX));
        dragging.y = Math.max(r, Math.min(h - r, y + dragOY));
        dragging.vx = mvx;
        dragging.vy = mvy;
      }
    }
    function onPointerDown(e: PointerEvent) {
      // Grabbing calls preventDefault(), which on touch would swallow the
      // scroll gesture and trap the page. Phones get the drift, not the drag.
      if (compact) return;
      const el = e.target as HTMLElement | null;
      if (el && typeof el.closest === "function" && el.closest("a,button,input,select,textarea,label")) return;
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > w || y > h) return;
      let best: Body | null = null;
      let bestD = Infinity;
      for (const b of bodies) {
        if (b.state !== "assembled") continue;
        const d = Math.hypot(b.x - x, b.y - y);
        if (d < b.radius + GRAB_MARGIN && d < bestD) {
          bestD = d;
          best = b;
        }
      }
      if (best) {
        dragging = best;
        dragOX = best.x - x;
        dragOY = best.y - y;
        lastPX = x;
        lastPY = y;
        lastPT = performance.now();
        mvx = 0;
        mvy = 0;
        e.preventDefault();
      }
    }
    function onPointerUp() {
      if (dragging) {
        dragging.vx = mvx;
        dragging.vy = mvy;
        dragging = null;
      }
    }
    function onPointerOut(e: PointerEvent) {
      if (!e.relatedTarget) {
        mx = -9999;
        my = -9999;
      }
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    function shatter(b: Body) {
      b.state = "expanded";
      b.hold = HOLD_FRAMES;
      b.cooldown = REFORM_IMMUNITY;
      b.pulse = 0;
      if (dragging === b) dragging = null;
      for (const a of b.atoms) {
        const rr = Math.hypot(a.rx, a.ry);
        let ux: number;
        let uy: number;
        if (rr < 0.01) {
          const ang = Math.random() * TAU;
          ux = Math.cos(ang);
          uy = Math.sin(ang);
        } else {
          ux = a.rx / rr;
          uy = a.ry / rr;
        }
        const dist = rr * (1.25 + Math.random() * 0.7) + (6 + Math.random() * 12);
        a.dispX = ux * dist + (Math.random() - 0.5) * 8;
        a.dispY = uy * dist + (Math.random() - 0.5) * 8;
        a.tgx = a.dispX; // first roam target is the outward burst → quick expand
        a.tgy = a.dispY;
        a.rt = 20 + Math.random() * 16;
        a.k = 0.09 + Math.random() * 0.08;
        a.x = b.x + b.m00 * a.rx + b.m01 * a.ry;
        a.y = b.y + b.m10 * a.rx + b.m11 * a.ry;
        a.vx = 0;
        a.vy = 0;
      }
    }

    function clampSpeed(o: { vx: number; vy: number }, max: number) {
      const sp = Math.hypot(o.vx, o.vy);
      if (sp > max) {
        o.vx = (o.vx / sp) * max;
        o.vy = (o.vy / sp) * max;
      }
    }

    function emitDust(b: Body) {
      const off = b.radius * 0.7;
      const life = DUST_LIFE * (0.5 + Math.random() * 1.5); // each lasts a different length
      const r = Math.random();
      const c = r < 0.04 ? "rgb(205,235,228)" : r < 0.16 ? "rgb(150,210,120)" : "rgb(140,228,216)";
      b.dust.push({
        x: b.x + (Math.random() - 0.5) * off,
        y: b.y + (Math.random() - 0.5) * off,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life,
        max: life,
        size: 0.7 + Math.random() * 1.6,
        fe: 0.6 + Math.random() * 1.6, // each fades at its own rate
        c,
      });
    }

    function bounceOffFixed(t: Body, fixed: Body, nx: number, ny: number, overlap: number, sign: number) {
      // t bounces off "fixed" (treated as infinite mass); push t fully out
      t.x += sign * nx * overlap;
      t.y += sign * ny * overlap;
      const vn = (t.vx - fixed.vx) * nx + (t.vy - fixed.vy) * ny;
      if (vn < 0) {
        t.vx -= (1 + RESTITUTION) * vn * nx;
        t.vy -= (1 + RESTITUTION) * vn * ny;
      }
      if (t.cooldown <= 0 && fixed.cooldown <= 0 && -vn > SHATTER_IMPACT && Math.random() < SHATTER_PROB) {
        shatter(fixed);
        shatter(t);
      }
    }

    function step(dt: number) {
      // record per-point trails while shattered (snake-style ring buffer)
      for (const b of bodies) {
        if (b.state !== "assembled" || b.pulse > 0) {
          for (const a of b.atoms) {
            a.trail.push({ x: a.x, y: a.y });
            if (a.trail.length > ATOM_TRAIL_LEN) a.trail.shift();
          }
        } else if (b.atoms.length && b.atoms[0].trail.length) {
          for (const a of b.atoms) a.trail.length = 0;
        }
      }

      for (const b of bodies) {
        b.jux = false;
        b.prevX = b.x;
        b.prevY = b.y;
        if (b.cooldown > 0) b.cooldown -= dt;
        if (b.pulse > 0) b.pulse = Math.max(0, b.pulse - 0.035 * dt);
        if (b.vib > 0) b.vib *= VIB_DECAY;

        if (b === dragging) {
          // position/velocity are driven by the pointer; still spin
          b.ez += b.vez * dt;
          updateMatrix(b);
          continue;
        }

        // Wiener heading: rotate the velocity by a small random angle each frame
        const dth = (Math.random() - 0.5) * HEADING_NOISE * dt;
        const cd = Math.cos(dth);
        const sd = Math.sin(dth);
        const rot = b.vx * cd - b.vy * sd;
        b.vy = b.vx * sd + b.vy * cd;
        b.vx = rot;

        // cursor repulsion
        const dxm = b.x - mx;
        const dym = b.y - my;
        const dm = Math.hypot(dxm, dym);
        if (dm < MOUSE_R + b.radius && dm > 0.01) {
          const force = (1 - dm / (MOUSE_R + b.radius)) * 1.4;
          b.vx += (dxm / dm) * force * (60 / b.mass);
          b.vy += (dym / dm) * force * (60 / b.mass);
        }

        // ease speed toward a steady cruise: bodies always traverse the pane (no
        // edge-lingering) and a throw/smash decays back to cruise over ~1.5s
        let sp = Math.hypot(b.vx, b.vy);
        if (sp < 0.001) {
          const a = Math.random() * TAU;
          b.vx = Math.cos(a);
          b.vy = Math.sin(a);
          sp = 1;
        }
        const tgt = sp + (b.cruise - sp) * SPEED_RELAX * dt;
        b.vx = (b.vx / sp) * tgt;
        b.vy = (b.vy / sp) * tgt;
        clampSpeed(b, MAX_SPEED);
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        if (b.state === "assembled") {
          b.ez += b.vez * dt;
        }
        updateMatrix(b);

        const r = b.radius;
        let inx = 0;
        let iny = 0;
        if (b.x < r) {
          b.x = r;
          inx = 1;
        } else if (b.x > w - r) {
          b.x = w - r;
          inx = -1;
        }
        if (b.y < r) {
          b.y = r;
          iny = 1;
        } else if (b.y > h - r) {
          b.y = h - r;
          iny = -1;
        }
        if (inx !== 0 || iny !== 0) {
          // shoot back across the pane (DVD-style) in a random inward direction
          const ang = Math.atan2(iny, inx) + (Math.random() - 0.5) * WALL_SPREAD;
          const speed = Math.max(Math.hypot(b.vx, b.vy), b.cruise);
          b.vx = Math.cos(ang) * speed;
          b.vy = Math.sin(ang) * speed;
        }
      }

      // dust wake: age/drift existing specks, emit new ones along the path
      for (const b of bodies) {
        for (let i = b.dust.length - 1; i >= 0; i--) {
          const d = b.dust[i];
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          d.vx *= 0.95;
          d.vy *= 0.95;
          d.life -= dt;
          if (d.life <= 0) b.dust.splice(i, 1);
        }
        if (DUST_ENABLED && b.state === "assembled") {
          const moved = Math.hypot(b.x - b.prevX, b.y - b.prevY);
          b.emitAcc += moved;
          while (b.emitAcc >= EMIT_SPACING && b.dust.length < DUST_MAX) {
            b.emitAcc -= EMIT_SPACING;
            emitDust(b);
          }
          // faster motion (e.g. a fast drag-fling) puffs out extra dust
          const extra = Math.min(Math.floor(moved / 8), 4);
          for (let e = 0; e < extra && b.dust.length < DUST_MAX; e++) {
            if (Math.random() < 0.6) emitDust(b);
          }
        } else {
          b.emitAcc = 0;
        }
      }

      // pairwise
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const min = a.radius + b.radius;
          if (dist >= min) continue;
          const nx = dx / dist;
          const ny = dy / dist;
          const aSolid = a.state === "assembled";
          const bSolid = b.state === "assembled";

          if (aSolid && bSolid) {
            const overlap = min - dist;
            if (a === dragging) {
              bounceOffFixed(b, a, nx, ny, overlap, 1);
            } else if (b === dragging) {
              bounceOffFixed(a, b, nx, ny, overlap, -1);
            } else {
              // two free objects: perfectly elastic
              const tm = a.mass + b.mass;
              a.x -= nx * overlap * (b.mass / tm);
              a.y -= ny * overlap * (b.mass / tm);
              b.x += nx * overlap * (a.mass / tm);
              b.y += ny * overlap * (a.mass / tm);
              const rvx = b.vx - a.vx;
              const rvy = b.vy - a.vy;
              const vn = rvx * nx + rvy * ny;
              if (vn < 0) {
                const jimp = (-(1 + RESTITUTION) * vn) / (1 / a.mass + 1 / b.mass);
                a.vx -= (jimp * nx) / a.mass;
                a.vy -= (jimp * ny) / a.mass;
                b.vx += (jimp * nx) / b.mass;
                b.vy += (jimp * ny) / b.mass;
              }
              if (a.cooldown <= 0 && b.cooldown <= 0 && -vn > SHATTER_IMPACT && Math.random() < SHATTER_PROB) {
                shatter(a);
                shatter(b);
              }
            }
          } else {
            // a cloud is involved: both vibrate, nothing destroyed, veer off
            a.vib = VIB;
            b.vib = VIB;
            if (!aSolid) a.jux = true;
            if (!bSolid) b.jux = true;
            if (a !== dragging && b !== dragging) {
              const sep = Math.atan2(ny, nx) + (Math.random() - 0.5) * 1.2;
              const cx = Math.cos(sep) * 0.5;
              const cy = Math.sin(sep) * 0.5;
              b.vx += cx;
              b.vy += cy;
              a.vx -= cx;
              a.vy -= cy;
            }
          }
        }
      }

      // point-cloud dynamics
      for (const b of bodies) {
        if (b.state === "assembled") continue;
        const toRest = b.state === "contract";
        const bdx = b.x - b.prevX;
        const bdy = b.y - b.prevY;
        let atTarget = true;
        for (const a of b.atoms) {
          a.x += bdx;
          a.y += bdy;
          let ox: number;
          let oy: number;
          let k: number;
          if (toRest) {
            ox = a.rx;
            oy = a.ry;
            k = b.contractK;
          } else {
            // roam to a fresh random spot in the cloud at its own rate, so points
            // drift closer/further and swap places (Brownian) while dispersed
            a.rt -= dt;
            if (a.rt <= 0) {
              const ang = Math.random() * TAU;
              const rad = b.maxDisp * (0.15 + Math.random() * 0.85);
              a.tgx = Math.cos(ang) * rad;
              a.tgy = Math.sin(ang) * rad;
              a.rt = 16 + Math.random() * 34;
            }
            ox = a.tgx;
            oy = a.tgy;
            k = ROAM_K;
          }
          const tx = b.x + b.m00 * ox + b.m01 * oy;
          const ty = b.y + b.m10 * ox + b.m11 * oy;
          a.vx += (tx - a.x) * k * dt;
          a.vy += (ty - a.y) * k * dt;
          if (!toRest) {
            a.vx += (Math.random() - 0.5) * BROWNIAN;
            a.vy += (Math.random() - 0.5) * BROWNIAN;
          }
          if (b.vib > 0.05) {
            a.vx += (Math.random() - 0.5) * b.vib;
            a.vy += (Math.random() - 0.5) * b.vib;
          }
          a.vx *= ATOM_DAMP;
          a.vy *= ATOM_DAMP;
          clampSpeed(a, 12);
          a.x += a.vx * dt;
          a.y += a.vy * dt;
          if (Math.hypot(tx - a.x, ty - a.y) > REACH) atTarget = false;
        }

        if (b.state === "expanded") {
          if (b.jux) b.hold = Math.max(b.hold, JUX_FRAMES);
          else b.hold -= dt;
          if (b.hold <= 0 && !b.jux) {
            b.state = "contract";
            b.hold = CONTRACT_MAX;
          }
        } else {
          if (b.jux) {
            b.state = "expanded";
            b.hold = JUX_FRAMES;
          } else {
            b.hold -= dt;
            if (atTarget || b.hold <= 0) {
              b.state = "assembled";
              b.pulse = 1;
              b.cooldown = REFORM_IMMUNITY;
            }
          }
        }
      }
    }

    function drawAtom(a: Atom, alpha: number) {
      ctx!.globalAlpha = alpha;
      ctx!.beginPath();
      ctx!.arc(a.x, a.y, a.r, 0, TAU);
      ctx!.fillStyle = a.color;
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(a.x - a.r * 0.3, a.y - a.r * 0.3, a.r * 0.4, 0, TAU);
      ctx!.fillStyle = "rgba(255,255,255,0.5)";
      ctx!.fill();
      ctx!.globalAlpha = 1;
    }

    function drawAtomTrail(a: Atom, fade: number) {
      const at = a.trail;
      for (let i = 1; i < at.length; i++) {
        const p = i / at.length;
        ctx!.beginPath();
        ctx!.moveTo(at[i - 1].x, at[i - 1].y);
        ctx!.lineTo(at[i].x, at[i].y);
        ctx!.strokeStyle = `rgba(140,230,218,${ATOM_TRAIL_ALPHA * p * fade})`;
        ctx!.lineWidth = 0.4 + p;
        ctx!.stroke();
      }
    }

    function drawImageBody(b: Body, alpha: number, scale: number, glow: number, jitter: number) {
      if (!(b.img.complete && b.img.naturalWidth > 0) || alpha <= 0.02) return;
      const jx = jitter > 0.05 ? (Math.random() - 0.5) * jitter * 2 : 0;
      const jy = jitter > 0.05 ? (Math.random() - 0.5) * jitter * 2 : 0;
      ctx!.save();
      ctx!.translate(b.x + jx, b.y + jy);
      ctx!.transform(b.m00, b.m10, b.m01, b.m11, 0, 0);
      ctx!.scale(scale, scale);
      ctx!.globalAlpha = alpha;
      if (glow > 0) {
        ctx!.shadowColor = `rgba(140,230,218,${0.55 * glow})`;
        ctx!.shadowBlur = 16 + 30 * glow;
      } else if (b.spec.glow) {
        ctx!.shadowColor = "rgba(82,211,196,0.5)";
        ctx!.shadowBlur = 26;
      }
      ctx!.drawImage(b.img, -b.size / 2, -b.size / 2, b.size, b.size);
      ctx!.restore();
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      // glittering dust wake behind each object, and thin trails behind each
      // point while shattered
      ctx!.lineCap = "round";
      ctx!.lineJoin = "round";
      for (const b of bodies) {
        for (const d of b.dust) {
          const p = d.life / d.max;
          ctx!.globalAlpha = DUST_ALPHA * Math.pow(p, d.fe);
          ctx!.beginPath();
          ctx!.arc(d.x, d.y, d.size * (0.5 + 0.5 * p), 0, TAU);
          ctx!.fillStyle = d.c;
          ctx!.fill();
        }
        ctx!.globalAlpha = 1;
        if (b.state !== "assembled") {
          for (const a of b.atoms) drawAtomTrail(a, 1);
        } else if (b.pulse > 0) {
          for (const a of b.atoms) drawAtomTrail(a, b.pulse);
        }
      }

      for (const b of bodies) {
        if (b.state !== "assembled") {
          for (const a of b.atoms) drawAtom(a, 1);
        } else if (b.pulse > 0) {
          for (const a of b.atoms) drawAtom(a, b.pulse * 0.6);
          drawImageBody(b, b.spec.opacity * (1 - b.pulse), 1 + 0.05 * b.pulse, b.pulse, 0);
        } else {
          drawImageBody(b, b.spec.opacity, 1, 0, b.vib);
        }
      }
    }

    let raf = 0;
    let last = performance.now();
    let running = true;
    function frame(now: number) {
      let dt = (now - last) / 16.667;
      last = now;
      if (dt > 2.2) dt = 2.2;
      step(dt);
      draw();
      if (running) raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (reduce) {
            draw();
          } else if (!running) {
            running = true;
            last = performance.now();
            raf = requestAnimationFrame(frame);
          }
        } else if (running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(parent);

    if (reduce) {
      draw();
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("pointerout", onPointerOut);
      imgs.forEach((im) => (im.onload = null));
      ro.disconnect();
      io.disconnect();
    };
  }, [reduce, compact]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
