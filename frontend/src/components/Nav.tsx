"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";
import { Logo } from "./Logo";
import { Roll } from "./Roll";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));

  return (
    <header className="s-nav" data-scrolled={scrolled}>
      <div className="s-nav__in">
        <Logo />
        <nav className="s-nav__links" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={[n.star && "s-nav__star", isActive(n.href) && "is-active"].filter(Boolean).join(" ") || undefined} aria-current={isActive(n.href) ? "page" : undefined}>
              {n.label}{n.star && <span className="s-nav__free">Free</span>}
            </Link>
          ))}
        </nav>
        <div className="s-nav__right">
          <ThemeToggle />
          <a href="#contact" className="s-btn s-btn--line s-btn--sm s-nav__contact"><Roll>Contact Us</Roll></a>
          <Link href="/start" className="s-btn s-btn--grad s-btn--sm s-nav__cta"><Roll>Book a project</Roll></Link>
          <button className="s-nav__burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
              {open
                ? <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                : <path d="M3 7h14M3 13h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>
      <div className="s-nav__sheet" data-open={open}>
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className={[n.star && "s-nav__star", isActive(n.href) && "is-active"].filter(Boolean).join(" ") || undefined}>
            {n.label}{n.star && <span className="s-nav__free">Free</span>}
          </Link>
        ))}
        <div className="s-nav__sheet-ctas">
          <Link href="/start" className="s-btn s-btn--grad">Book a project</Link>
          <a href="#contact" className="s-btn s-btn--line" onClick={() => setOpen(false)}>Contact Us</a>
        </div>
      </div>
    </header>
  );
}
