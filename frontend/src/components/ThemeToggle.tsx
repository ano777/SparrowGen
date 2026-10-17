"use client";

import { THEME_KEY, type Theme } from "@/lib/site";

// Light / dark switch in the nav. Cream is the default; the choice is remembered in this browser only (localStorage).
// The knob position comes from CSS (html[data-theme]), so it is right from the first paint.
export function ThemeToggle() {
  const flip = () => {
    const next: Theme = document.documentElement.dataset.theme === "night" ? "cream" : "night";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch {}
  };
  return (
    <button className="s-switch" type="button" onClick={flip} aria-label="Switch between light and dark">
      <span className="s-switch__knob" />
    </button>
  );
}
