"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { projects } from "@/lib/site";
import { Roll } from "../Roll";

// Project cards with category filters. Hovering a card pans across the screenshot and shows an "Open live site" sticker.
export function WorksGrid() {
  const cats = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const [cat, setCat] = useState("All");
  const shown = projects.filter((p) => cat === "All" || p.category === cat);
  return (
    <>
      <div className="s-works__bar">
      <div className="s-chips" role="group" aria-label="Filter by business type">
        {cats.map((c) => <button key={c} type="button" aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      <p className="s-works__note">Concept sites we designed and built ourselves. Client projects are added as they go live.</p>
      </div>
      <div className="s-works__grid">
        {shown.map((p) => (
          <article key={p.slug} className="s-wcard">
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="s-wcard__img" aria-label={`Open ${p.name} (concept) in a new tab`}>
              <Image src={p.image!} alt={`${p.name} website homepage`} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
              <span className="s-wcard__open" aria-hidden="true">Open live site ↗</span>
            </a>
            <div className="s-wcard__foot">
              <div>
                <h2>{p.name} {p.concept && <span className="s-tag">Concept</span>}</h2>
                <p>{p.kind}</p>
              </div>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--soft s-btn--xs"><Roll>Visit site</Roll></a>
            </div>
          </article>
        ))}
        <article className="s-wcard s-wcard--next">
          <div className="s-wcard__next">
            <p className="s-h s-h--sm">Your business<br />could be next.</p>
            <p>Tell us what you sell and who you sell to. We&apos;ll come back with a plan and a first look.</p>
            <Link href="/start" className="s-btn s-btn--dark s-btn--sm"><Roll>Start a project</Roll></Link>
          </div>
        </article>
      </div>
    </>
  );
}
