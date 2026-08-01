"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, CalendarDays, ChevronDown, MapPin, Users } from "lucide-react";

import { HeroPhysics } from "./hero-physics";
import logo from "../../../public/simbiochemLogo.png";
import proteinSeed from "../../../public/hero/protein.png";

export function ParallaxHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [canvasReady, setCanvasReady] = useState(false);
  // Stable identity, so HeroPhysics's effect does not re-run on every render.
  const handleFirstFrame = useCallback(() => setCanvasReady(true), []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const px = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 45, damping: 22, mass: 0.7 });

  const f = reduce ? 0 : 1;
  const contentX = useTransform(sx, (v) => v * 5 * f);

  const s = reduce ? 0 : 1;
  const contentScrollY = useTransform(scrollYProgress, [0, 1], [0, 60 * s]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
  }
  function onPointerLeave() {
    px.set(0);
  }

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-brand-950 text-white"
    >
      {/* Calm base gradient */}
      <div
        className="absolute inset-0 -z-30"
        style={{
          background:
            "radial-gradient(115% 85% at 80% 20%, rgba(14,165,160,0.18), transparent 55%), linear-gradient(165deg, #030a24 0%, #050f33 60%, #061d2b 100%)",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-30 opacity-20 grid-faint" aria-hidden="true" />

      {/* Interactive molecular physics playground. Shown on phones too, where
          HeroPhysics runs a random pair scaled to the pane.

          The canvas cannot draw anything until the client bundle has loaded,
          and its sprites are requested from JavaScript so the preload scanner
          never sees them — measured at ~1.9s on 4G against a 0.4s first paint.
          So the protein is also rendered as a real <img> in the server markup,
          at the position and size the canvas will place it. It is on screen at
          first paint with no JavaScript at all, and cross-fades out the moment
          the canvas has drawn the same body itself. */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <Image
          src={proteinSeed}
          alt=""
          priority
          aria-hidden="true"
          // Without this next/image serves a 750px variant for a box that is
          // never wider than 340px — four times the bytes on the one asset that
          // has to arrive first.
          sizes="(max-width: 639px) 160px, 340px"
          className={`absolute -translate-x-1/2 -translate-y-1/2 select-none transition-opacity duration-700 ease-out ${
            canvasReady ? "opacity-0" : "opacity-90"
          } left-[74%] top-[15%] sm:top-[50%]`}
          style={{
            // Mirrors SPECS[0].size and layout[0] in hero-physics.tsx — the
            // compact layout puts the protein high, the desktop one centres it.
            width: "clamp(150px, 23vw, 340px)",
            height: "auto",
          }}
        />
        <HeroPhysics onFirstFrame={handleFirstFrame} />
      </div>

      {/* Left scrim keeps the title readable over moving molecules */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(3,10,36,0.78) 0%, rgba(3,10,36,0.4) 32%, rgba(3,10,36,0) 58%)",
        }}
        aria-hidden="true"
      />

      {/* Foreground content */}
      <motion.div
        style={{ x: contentX, y: contentScrollY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-7xl px-5 py-24 lg:px-8"
      >
        <div className="max-w-2xl">
          <Image src={logo} alt="" height={60} className="mb-8 h-14 w-auto drop-shadow-lg" priority />
          <p className="eyebrow text-teal-300">NeurIPS 2026 Workshop · Sydney, Australia</p>
          <h1 className="display mt-5 text-5xl font-bold leading-[1.03] tracking-[-0.035em] text-white sm:text-7xl">
            Machine Learning for Simulations in Biology &amp; Chemistry
          </h1>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-accent-400">
            The 2nd SIMBIOCHEM Workshop
          </p>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
            Fusing molecular simulation, generative models and agentic AI into physics-aligned
            systems that learn from reality.
          </p>

          {/* Highlighted date + location */}
          <div className="mt-8 inline-flex flex-wrap items-stretch gap-x-8 gap-y-4 rounded-2xl border border-teal-400/30 bg-white/[0.05] px-6 py-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <CalendarDays className="size-5 text-teal-300" />
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-teal-300">
                  Dates
                </p>
                <p className="text-lg font-semibold text-white">Dec 11 or 12, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-white/10 sm:border-l sm:pl-8">
              <MapPin className="size-5 text-teal-300" />
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-teal-300">
                  Location
                </p>
                <p className="text-lg font-semibold text-white">Sydney, Australia</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-500/15 px-3 py-1.5 text-xs font-semibold text-accent-300 ring-1 ring-inset ring-accent-500/30">
              <span className="size-1.5 rounded-full bg-accent-400" />
              Call for papers open · deadline 29 Aug 2026
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/call-for-papers"
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-brand-950 shadow-lg shadow-accent-500/20 transition hover:bg-accent-400"
            >
              Call for papers
              <ArrowRight className="size-4" />
            </Link>
            {/* Teal, not green: two peer calls to action that must read as
                different asks. 10.7:1 on brand-950 against the primary's 8.1:1,
                so neither looks like the secondary option. */}
            <Link
              href="/volunteer"
              className="inline-flex items-center gap-2 rounded-full bg-teal-300 px-6 py-3 text-sm font-semibold text-brand-950 shadow-lg shadow-teal-400/20 transition hover:bg-teal-200"
            >
              <Users className="size-4" />
              Call for Programme Committee
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center"
        aria-hidden="true"
      >
        <motion.div
          className="flex flex-col items-center gap-1.5 text-teal-200/70"
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[0.6rem] uppercase tracking-[0.3em]">Scroll</span>
          <ChevronDown className="size-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
