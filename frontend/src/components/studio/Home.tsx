import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AskBotButton } from "@/components/AskBotButton";
import { brand, faqs, projects, steps } from "@/lib/site";
import { Acc, Roll } from "../Roll";
import { HandCoded } from "../HandCoded";
import { CardStack } from "./CardStack";
import { CardGlow } from "./CardGlow";
import { Shot } from "./Mini";

const turf = projects.find((p) => p.slug === "spotturf")!, tolly = projects.find((p) => p.slug === "tolly-cafe")!;

/* ------------------------------------------------------------ hero */
// Three promises we already make elsewhere on the site (FAQ, About values). No made-up numbers.
const PROMISES: [string, string, string][] = [
  ["Live in a week", "Landing pages in 2 days", "M13 2L4 14h7l-1 8 9-12h-7z"],
  ["See it first", "Approve the design before we code", "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  ["Automation", "Enquiries straight to WhatsApp", "M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
];

export function StudioHero() {
  return (
    <section className="s-hero">
      <div className="s-wrap s-hero__grid">
        <div className="s-hero__in">
          <p className="kicker s-rise">Hand-coded, never templated</p>
          <h1 className="s-h s-hero__title s-rise" style={{ animationDelay: "80ms" }}>
            <span>More <span className="grad-text">customers.</span></span>
            <span>Not more templates.</span>
          </h1>
          <p className="s-hero__sub s-rise" style={{ animationDelay: "180ms" }}>Websites and automation for businesses across India, designed around your customers and live in a week.</p>
          <div className="s-ctas s-rise" style={{ animationDelay: "260ms" }}>
            <Link href="/start" className="s-btn s-btn--grad"><Roll>Book a project</Roll></Link>
            <Link href="/preview" className="s-btn s-btn--line"><Roll>See your site first</Roll></Link>
          </div>
          <p className="s-hero__hint s-rise" style={{ animationDelay: "320ms" }}><b>Hand-coded by engineers.</b> Every site we ship is typed like this, by a person. Pick a business and watch.</p>
          <ul className="s-promise s-rise" style={{ animationDelay: "380ms" }}>
            {PROMISES.map(([t, d, icon]) => (
              <li key={t}>
                <span className="s-promise__ic"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icon} /></svg></span>
                <span><b>{t}</b><small>{d}</small></span>
              </li>
            ))}
          </ul>
        </div>
        {/* the live editor: code typed by a person while the site builds above it */}
        <div className="s-hand s-rise" style={{ animationDelay: "340ms" }}><HandCoded /></div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ tools we build with */
const TOOLS: [string, React.ReactNode][] = [
  ["Next.js", <><circle cx="12" cy="12" r="9" /><path d="M9 16V8l7 9" /></>],
  ["React", <><ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" /></>],
  ["Figma", <><rect x="7" y="3" width="10" height="6" rx="3" /><rect x="7" y="9" width="10" height="6" rx="3" /><circle cx="15" cy="12" r="0.1" /><path d="M10 15h0a3 3 0 1 0 0 6 3 3 0 0 0 3-3v-3" /></>],
  ["TypeScript", <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 11h6M10 11v7M18 11.5c-.5-.6-1.2-.8-2-.6-.9.3-1 1.5 0 1.9s1.3 1.6.2 2.1c-.9.4-1.8.1-2.3-.6" /></>],
  ["Node.js", <path d="M12 2l9 5v10l-9 5-9-5V7z" />],
  ["Python", <><path d="M12 3h-2a3 3 0 0 0-3 3v3h6M12 21h2a3 3 0 0 0 3-3v-3h-6" /><path d="M7 9H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2M17 15h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2" /></>],
  ["Netlify", <path d="M12 2l10 10-10 10L2 12z" />],
  ["Analytics", <path d="M5 20V12M12 20V5M19 20v-9" />],
];
export function Tools() {
  return (
    <section className="s-tools" aria-label="Tools we build with">
      <div className="s-wrap s-tools__in">
        <p className="s-tools__label"><span className="kicker">Our stack</span>Real code, built with tools the best teams use.</p>
        <ul>
          {TOOLS.map(([n, icon]) => (
            <li key={n}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>{n}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ intro + wall of designs */
export function Speaks() {
  return (
    <section className="s-speaks">
      <div className="s-wrap s-speaks__in">
        <div className="s-speaks__text" data-reveal>
          <h2 className="s-h s-h--md">Sites that look right.<br />Sites that sell.</h2>
          <p>{brand.name} designs and hand-codes websites around your customers: clean design, real engineering, and automation that answers enquiries for you, so your site keeps working long after launch.</p>
          <div className="s-ctas">
            <Link href="/about" className="s-btn s-btn--dark s-btn--sm"><Roll>About Us</Roll></Link>
            <Link href="/work" className="s-btn s-btn--line s-btn--sm"><Roll>See our work</Roll></Link>
          </div>
        </div>
        <div className="s-wall">
          {projects.map((p, i) => (
            <a key={p.slug} href={p.url} target="_blank" rel="noopener noreferrer" className={`s-wall__t ${i % 2 ? "s-wall__t--b" : "s-wall__t--a"}`} data-reveal style={{ transitionDelay: `${i * 90}ms` }} aria-label={`Open ${p.name}${p.concept ? " (demo)" : ""} in a new tab`}>
              <span className="s-wall__img"><Image src={p.image!} alt={`${p.name} website homepage`} fill sizes="(max-width: 860px) 100vw, 620px" /></span>
              <span className="s-wall__cap"><b>{p.name}</b>{p.concept && <span className="s-tag">Demo</span>}<em>{p.kind} ↗</em></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ how it works */
export function Steps() {
  return (
    <section className="s-section s-steps" id="process">
      <div className="s-wrap">
        <div className="s-steps__head" data-reveal>
          <p className="kicker">How it works</p>
          <h2 className="s-h s-h--md">From DM to <Acc>live site.</Acc></h2>
        </div>
        <ol className="s-steps__list">
          {steps.map((st, i) => (
            <li key={st.title} className="s-step" data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="s-step__n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{st.title}</h3>
              <p>{st.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ why it works (animated bento) */
// Each card has its own colour world (a slow drifting aurora) and a small looping scene, so the section
// shows what we build instead of just describing it.
const Tick = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l4 4 10-10" /></svg>;

export function Approach() {
  return (
    <>
      <CardGlow />
      <CardStack>
          <article className="s-card s-card--a">
            <span className="s-card__bg" aria-hidden="true" />
            <h3>We listen first</h3>
            <p>We start with <strong>your customers</strong>: who they are, what they ask, and why they should pick you.</p>
            <div className="s-art s-art--chat" aria-hidden="true">
              <span className="s-bubble s-bubble--in s-chat0">Hi! I run a café. Can you make us a website?</span>
              <span className="s-bubble s-bubble--out s-chat1">Sure! What do your customers ask you most?</span>
              <span className="s-bubble s-bubble--in s-chat2">Opening hours, the menu, and if they can order ahead.</span>
              <span className="s-typing s-chat3"><i /><i /><i /></span>
            </div>
          </article>

          <article className="s-card s-card--b">
            <span className="s-card__bg" aria-hidden="true" />
            <h3>Made for every screen</h3>
            <p>Built phone-first, then polished for laptops and desktops, so it looks right <strong>wherever your visitors are</strong>.</p>
            <div className="s-art s-art--phone" aria-hidden="true">
              <div className="s-desk">
                <div className="s-desk__screen"><Image src={tolly.image!} alt="" fill sizes="220px" /></div>
                <span className="s-desk__stand" />
              </div>
              <div className="s-phone"><Image src={tolly.image!} alt="" fill sizes="220px" /><span className="s-phone__notch" /></div>
              <span className="s-chip s-chip--1">👆 Thumb-friendly</span>
              <span className="s-chip s-chip--2">🖥️ Sharp on desktop</span>
              <span className="s-chip s-chip--3">📞 Tap to call</span>
            </div>
          </article>

          <article className="s-card s-card--c">
            <span className="s-card__bg" aria-hidden="true" />
            <h3>Built to get enquiries</h3>
            <p>Clear buttons and short forms that turn visitors into <strong>enquiries</strong>.</p>
            <div className="s-art s-art--form" aria-hidden="true">
              <div className="s-form">
                <b>Book a table</b>
                <i><span className="s-type s-type--1">Priya Sharma</span></i>
                <i><span className="s-type s-type--2">+91 98300 •••••</span></i>
                <span className="s-form__btn">Send enquiry</span>
              </div>
              <div className="s-toast"><em><Tick /></em> New enquiry on WhatsApp</div>
            </div>
          </article>

          <article className="s-card s-card--e">
            <span className="s-card__bg" aria-hidden="true" />
            <h3>See it before we build</h3>
            <p>You approve the design first. <strong>No surprises</strong> on launch day.</p>
            <div className="s-art s-art--ba" aria-hidden="true">
              <div className="s-ba">
                <div className="s-ba__wire"><i className="w1" /><i className="w2" /><i className="w3" /><i className="w4" /><i className="w5" /></div>
                <div className="s-ba__real"><Shot p={turf} sizes="420px" /></div>
                <span className="s-ba__handle"><b>‹ ›</b></span>
                <span className="s-ba__tag s-ba__tag--l">Sketch</span>
                <span className="s-ba__tag s-ba__tag--r">Design</span>
              </div>
              <span className="s-approve-btn"><span>Approve design</span><em><Tick /> Approved</em></span>
            </div>
          </article>

          <article className="s-card s-card--g">
            <span className="s-card__bg" aria-hidden="true" />
            <h3>Found on Google</h3>
            <p>Fast pages and Google-ready SEO, so people searching nearby <strong>find you first</strong>.</p>
            <div className="s-art s-art--search" aria-hidden="true">
              <div className="s-search">
                <div className="s-search__bar"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg><span className="s-search__q">café near me</span></div>
                <div className="s-search__list">
                  <div className="s-search__res s-search__res--top"><i>yourcafe.in</i><b>Your Café · Order ahead</b><em>Open now · 1.2 km · Menu online</em><span className="s-search__badge">#1</span></div>
                  <div className="s-search__res s-search__res--o1"><i>listings-site.com</i><b /><em /></div>
                  <div className="s-search__res s-search__res--o2"><i>old-directory.com</i><b /><em /></div>
                </div>
              </div>
            </div>
          </article>

          <article className="s-card s-card--f">
            <span className="s-card__bg" aria-hidden="true" />
            <h3>Works while you sleep</h3>
            <p>Orders, bookings and enquiries land on <strong>your WhatsApp</strong>, sorted and answered, even at 2 am.</p>
            <div className="s-art s-art--notify" aria-hidden="true">
              {[["New order", "2 cappuccinos · pickup 9:30 am"], ["Booking confirmed", "Saturday · 6 pm · 4 people"], ["New enquiry", "From your website contact form"]].map(([t, d], i) => (
                <div key={t} className="s-note" style={{ "--n": i } as CSSProperties}>
                  <em><Tick /></em>
                  <span><b>{t}</b><small>{d}</small></span><i>now</i>
                </div>
              ))}
            </div>
          </article>
      </CardStack>
    </>
  );
}

/* ------------------------------------------------------------ FAQ */
export function StudioFaq() {
  return (
    <section className="s-section s-faq" id="faqs">
      <div className="s-wrap s-faq__in">
        <div className="s-faq__side" data-reveal>
          <p className="kicker">Questions</p>
          <h2 className="s-h s-h--md">Asked before <Acc>you asked.</Acc></h2>
          <p>Don&apos;t feel like scrolling? Ask {brand.botName} for an instant answer. Still stuck? Message us on WhatsApp and a real person replies.</p>
          <AskBotButton />
        </div>
        <div className="s-faq__list" data-reveal>
          {faqs.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary><span><b>{String(i + 1).padStart(2, "0")}</b>{f.q}</span><i aria-hidden="true" /></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
