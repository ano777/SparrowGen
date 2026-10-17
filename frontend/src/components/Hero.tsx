"use client";

import Link from "next/link";
import { hero } from "@/lib/site";
import { HandCoded } from "./HandCoded";

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero__grid">
        <div>
          <h1 className="display hero__title">
            <span>{hero.line1}</span>
            <span className="grad-text">{hero.line2}</span>
          </h1>
          <p className="hero__sub">{hero.sub}</p>
          <div className="hero__ctas">
            <Link className="btn btn--grad" href="/start">Book a project</Link>
            <Link className="btn" href="/preview">See your website first</Link>
          </div>
          <p className="hero__hint">Every site we ship is typed like this, by a person. Pick a business and watch.</p>
        </div>

        <HandCoded />
      </div>
    </section>
  );
}
