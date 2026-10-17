import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Acc, Roll } from "@/components/Roll";

export const metadata: Metadata = pageMeta("About us", "Meet the engineers behind " + brand.name + ", a website design and development studio building hand-coded sites for small businesses across India.", "/about");

const team = [
  {
    initials: "DP", name: "Dipayan Paul", degree: "B.Tech, Computer Science (CSE)", role: "Frontend engineering · Design · Data analytics", bg: "linear-gradient(135deg, #fa7e1e, #d62976)",
    bio: "Designs what your customers see, guided by real data.",
  },
  {
    initials: "AD", name: "Anoranya Dutta", degree: "B.Tech, Electronics & Communication (ECE)", role: "Backend engineering · Deployment · Creatives", bg: "linear-gradient(135deg, #d62976, #962fbf)",
    bio: "A full-stack engineer with an artist's eye.",
  },
  {
    initials: "RD", name: "Rahul Das", degree: "B.Com, Marketing", role: "Marketing · Finance · Data & business analytics", bg: "linear-gradient(135deg, #962fbf, #4f5bd5)",
    bio: "Finds your niche before we design a thing.",
  },
];

const values = [
  { t: "You talk to makers", b: "No account managers in between. The people on the call are the people building your site." },
  { t: "Design first, code second", b: "You see and approve the design before a single line of code is written." },
  { t: "Fixed price, fixed date", b: "You know the cost and the launch day before we start. No hourly meters running." },
  { t: "Hand-coded, never templated", b: "Every site is written for your business, so it's fast, clean and easy to change." },
  { t: "Built to be found", b: "We add SEO, speed and analytics step by step as your site grows, so it keeps getting easier to find." },
];

export default function AboutPage() {
  return (
    <section className="s-about">
      <div className="s-wrap">
        <header className="s-about__head">
          <div>
            <p className="kicker s-rise">About us</p>
            <h1 className="s-h s-pagehead__title s-rise" style={{ animationDelay: "80ms" }}>Real engineers.<br /><Acc>Serious websites.</Acc></h1>
          </div>
          <div className="s-about__copy s-rise" style={{ animationDelay: "160ms" }}>
            <p><strong>{brand.name}</strong> is a web studio of hands-on designers and engineers. We build <strong>hand-coded websites</strong>, online stores and landing pages for businesses across India.</p>
            <p>Every project starts with understanding your business and ends with a site you&apos;re proud to share: one that <strong>brings in customers</strong>, not one that just sits there looking nice.</p>
            <div className="s-ctas">
              <Link href="/start" className="s-btn s-btn--grad s-btn--sm"><Roll>Book a project</Roll></Link>
              <Link href="/work" className="s-btn s-btn--line s-btn--sm"><Roll>See our work</Roll></Link>
            </div>
          </div>
        </header>

        <blockquote className="s-quote" data-reveal>
          Good design should feel effortless. We use modern tools, AI included, to move faster, but <Acc>people</Acc> design, write and review every line.
        </blockquote>

        <div className="s-about__block" data-reveal>
          <p className="kicker">The team</p>
          <h2 className="s-h s-h--md">The people behind <Acc>the pixels.</Acc></h2>
          <div className="s-team">
            {team.map((m) => (
              <article key={m.name} className="s-team__m">
                <span className="s-team__av" style={{ background: m.bg }}>{m.initials}</span>
                <h3>{m.name}</h3>
                <p className="s-team__deg">{m.degree}</p>
                <p className="s-team__role">{m.role}</p>
                <p>{m.bio}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="s-about__block">
          <div data-reveal>
            <p className="kicker">What we stand for</p>
            <h2 className="s-h s-h--md">Our <Acc>values.</Acc></h2>
          </div>
          <ol className="s-vals">
            {values.map((v, i) => (
              <li key={v.t} data-reveal style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                <span className="s-vals__n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{v.t}</h3>
                <p>{v.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
