"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SPARROW } from "./Logo";

// Page change: the screen clears from the centre out, the sparrow flies in, then the new page opens from the centre.
// Also plays once on the first visit. Skipped entirely for visitors who ask for reduced motion.
type Phase = "intro" | "cover" | "hold" | "reveal" | "idle";
const COVER_MS = 450; // centre-out wipe
const MIN_HOLD_MS = 420; // the logo stays at least this long
const REVEAL_MS = 750;

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhaseState] = useState<Phase>("intro");
  const phaseRef = useRef<Phase>("intro");
  const coveredAt = useRef(0);
  const lastPath = useRef(pathname);
  const setPhase = (p: Phase) => { phaseRef.current = p; setPhaseState(p); };

  // Lets CSS hold the new page's entrance animations until the overlay opens.
  useEffect(() => { document.documentElement.dataset.pt = phase; }, [phase]);

  // First visit: show the logo briefly, then open the page.
  useEffect(() => {
    if (reducedMotion()) { setPhase("idle"); return; }
    const id = setTimeout(() => setPhase("reveal"), 700);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (phase === "reveal") {
      const id = setTimeout(() => setPhase("idle"), REVEAL_MS);
      return () => clearTimeout(id);
    }
    if (phase === "cover" || phase === "hold") { // safety net: never leave the screen covered
      const id = setTimeout(() => setPhase("reveal"), 5000);
      return () => clearTimeout(id);
    }
  }, [phase]);

  // Clicks on links to another page on this site: cover first, then navigate.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || reducedMotion()) return;
      e.preventDefault();
      e.stopPropagation();
      if (phaseRef.current === "cover" || phaseRef.current === "hold") return; // already on the way
      setPhase("cover");
      coveredAt.current = performance.now() + COVER_MS;
      const href = url.pathname + url.search + url.hash;
      setTimeout(() => router.push(href), COVER_MS);
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [router]);

  // The new page is in: keep the logo up a moment, then open.
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    if (phaseRef.current !== "cover" && phaseRef.current !== "hold") return;
    setPhase("hold");
    const id = setTimeout(() => setPhase("reveal"), Math.max(0, coveredAt.current + MIN_HOLD_MS - performance.now()));
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <div className="s-pt" data-phase={phase} aria-hidden="true">
      <svg className="s-pt__mark" viewBox="0 0 32 26">
        <defs>
          <linearGradient id="pt-wing" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#fa7e1e" />
            <stop offset="1" stopColor="#d62976" />
          </linearGradient>
        </defs>
        <path className="s-pt__body" d={SPARROW.body} fillRule="evenodd" />
        <path className="s-pt__wing" d={SPARROW.wing} fill="url(#pt-wing)" />
        <path className="s-pt__beak" d={SPARROW.beak} />
        <path className="s-pt__spark" d={SPARROW.spark} />
      </svg>
    </div>
  );
}
