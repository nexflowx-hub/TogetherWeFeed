"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";
import { LocaleSwitcher } from "./locale-switcher";

export function SiteHeader() {
  const { messages } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const LINKS = [
    { href: "#missao", label: messages.nav.mission },
    { href: "#doar", label: messages.nav.donate },
    { href: "#impactos", label: messages.nav.impacts },
    { href: "#historias", label: messages.nav.stories },
    { href: "#faq", label: messages.nav.faq },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 twf-safe-top twf-safe-x " +
        (scrolled ? "bg-white/95 shadow-md backdrop-blur" : "bg-transparent")
      }
    >
      <div className="twf-container flex h-16 items-center justify-between sm:h-20">
        <a
          href="#topo"
          className="flex items-center gap-2"
          aria-label="Together We Feed — início"
        >
          <Image
            src="/media/images/logo.webp"
            alt="Together We Feed"
            width={150}
            height={60}
            className={
              "h-auto w-auto transition-opacity " +
              (scrolled ? "opacity-100" : "opacity-90")
            }
            style={{ maxHeight: 48, width: "auto" }}
          />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors " +
                (scrolled
                  ? "text-navy-deep hover:bg-sky-soft"
                  : "text-white hover:bg-white/15")
              }
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className={scrolled ? "" : "[&_button]:bg-white/15 [&_button]:text-white [&_button:hover]:bg-white/25"}>
            <LocaleSwitcher compact />
          </div>
          <a href="#doar" className="twf-btn-green hidden sm:inline-flex">
            {messages.nav.donateNow}
          </a>
          <button
            type="button"
            aria-label={messages.nav.menu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className={
              "flex h-10 w-10 items-center justify-center rounded-full md:hidden " +
              (scrolled ? "bg-sky-soft text-navy-deep" : "bg-white/15 text-white")
            }
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-sky-soft bg-white md:hidden">
          <nav className="twf-container flex flex-col py-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-navy-deep hover:bg-sky-soft"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#doar"
              onClick={() => setMenuOpen(false)}
              className="twf-btn-green mt-2"
            >
              {messages.nav.donateNow}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
