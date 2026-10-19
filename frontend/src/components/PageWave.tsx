"use client";

import { useEffect, useState } from "react";
import { GradientWave } from "@/components/ui/gradient-wave";

// Flowing wave background behind every page (fixed, stays put while you scroll), in the brand's Instagram-gradient colours.
// First colour = base (the page background), the rest = waves. Soft tints on Cream so the headline stays readable.
const CREAM = ["#faf3e5", "#fdd3a2", "#f6aecb", "#ddc0f2", "#c2c8f6", "#fde3a0"];
const NIGHT = ["#120a1a", "#6a2b10", "#6b1640", "#45206a", "#232d78", "#3d2a0c"];

export function PageWave() {
  const [night, setNight] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const read = () => setNight(html.dataset.theme === "night");
    read();
    const mo = new MutationObserver(read); // follows the light/dark switch
    mo.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return <GradientWave key={night ? "night" : "cream"} colors={night ? NIGHT : CREAM} className="s-page-wave" resolution={0.34} fps={24} pauseOnScroll />;
}
