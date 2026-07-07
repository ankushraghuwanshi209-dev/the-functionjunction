import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#packages", label: "Packages" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border/50" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 flex items-center justify-between h-20">
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full border border-gold flex items-center justify-center">
            <span className="font-display text-gold text-lg">F</span>
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-display text-sm tracking-[0.2em] text-foreground">THE FUNCTION</div>
            <div className="font-display text-sm tracking-[0.2em] text-gold -mt-0.5">JUNCTION</div>
          </div>
        </a>
        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[11px] tracking-[0.25em] uppercase text-foreground/80 hover:text-gold transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#booking"
            className="hidden md:inline-flex items-center border border-gold px-5 py-2.5 text-[11px] tracking-[0.25em] uppercase text-gold hover:bg-gold hover:text-primary-foreground transition-all"
          >
            Book Now
          </a>
          <Link
            to="/admin"
            className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground hover:text-gold transition-colors"
          >
            Admin
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden text-foreground p-2"
            aria-label="Menu"
          >
            <div className="flex flex-col gap-1.5">
              <span className={`block h-px w-6 bg-current transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`block h-px w-6 bg-current transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-px w-6 bg-current transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border">
          <nav className="flex flex-col p-6 gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm tracking-[0.2em] uppercase text-foreground/80 hover:text-gold"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-charcoal/60 mt-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center">
              <span className="font-display text-gold text-xl">F</span>
            </div>
            <div>
              <div className="font-display tracking-[0.2em] text-foreground">THE FUNCTION</div>
              <div className="font-display tracking-[0.2em] text-gold -mt-0.5">JUNCTION</div>
            </div>
          </div>
          <p className="font-script text-2xl text-gold-soft mb-3">Turning every celebration…</p>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            A bespoke luxury event management house crafting timeless weddings,
            corporate galas, and milestone celebrations with quiet precision.
          </p>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4">Studio</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><a href="#about" className="hover:text-gold">About</a></li>
            <li><a href="#services" className="hover:text-gold">Services</a></li>
            <li><a href="#portfolio" className="hover:text-gold">Portfolio</a></li>
            <li><a href="#packages" className="hover:text-gold">Packages</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4">Contact</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>hello@thefunctionjunction.com</li>
            <li>+1 (555) 010-0100</li>
            <li>By appointment only</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} The Function Junction. All rights reserved.</p>
          <p className="tracking-[0.25em] uppercase">Crafted with intention</p>
        </div>
      </div>
    </footer>
  );
}
