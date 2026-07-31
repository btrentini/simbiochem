"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

import { navLinks } from "@/content/site";
import { cn } from "@/lib/utils";

import logo from "../../public/simbiochemLogo.png";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the mobile menu (and release the scroll-lock) when the layout
  // crosses to the desktop breakpoint, where the menu is hidden.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-mist bg-white/85 backdrop-blur-md"
          : "border-transparent bg-white/60 backdrop-blur-sm",
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Image
            src={logo}
            alt=""
            height={34}
            className="h-8 w-auto"
            priority
          />
          <span className="display text-lg font-semibold text-brand">
            SIMBIOCHEM
            <span className="ml-1 align-super text-[0.6rem] font-semibold tracking-normal text-teal-600">
              II
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-[0.82rem] font-medium text-slate-1 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/call-for-papers"
            className="hidden items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-[0.82rem] font-semibold text-brand-950 shadow-sm transition hover:bg-accent-400 sm:inline-flex"
          >
            Call for papers
            <ArrowRight className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-full text-brand xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-mist bg-white xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-1 hover:bg-paper"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/call-for-papers"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-accent-500 px-4 py-2.5 text-sm font-semibold text-brand-950"
            >
              Call for papers
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
