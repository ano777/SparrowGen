import Link from "next/link";
import { brand } from "@/lib/site";
import { Acc, Roll } from "./Roll";

const wa = (n: string) => `https://wa.me/${n.replace(/\D/g, "")}`;

const Arrow = () => (
  <svg className="s-foot__arrow" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);

const socials = [
  { label: "Instagram", href: brand.instagramUrl, icon: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></> },
  { label: "WhatsApp", href: wa(brand.whatsapp), icon: <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z M9 9.5c.3 2.3 2.2 4.2 4.5 4.5l1-1.2 1.8.8c-.2 1-1 1.9-2.3 1.9-3.4 0-6.5-3.1-6.5-6.5 0-1.3.9-2.1 1.9-2.3l.8 1.8z" /> },
  { label: "WhatsApp 2", href: wa(brand.whatsapp2), icon: <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z M9 9.5c.3 2.3 2.2 4.2 4.5 4.5l1-1.2 1.8.8c-.2 1-1 1.9-2.3 1.9-3.4 0-6.5-3.1-6.5-6.5 0-1.3.9-2.1 1.9-2.3l.8 1.8z" /> },
  { label: "Email", href: `mailto:${brand.email}`, icon: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M4 7l8 6 8-6" /></> },
];

const cols = [
  { title: "Company", links: [["About Us", "/about"], ["Works", "/work"], ["Why us", "/why-us"], ["Privacy Policy", "/privacy"], ["Terms & conditions", "/terms"], ["Cookie Policy", "/cookies"]] },
  { title: "Services", links: [["Business websites", "/#services"], ["Online stores", "/#services"], ["Landing pages", "/#services"], ["WhatsApp automation", "/#services"]] },
  { title: "Resources", links: [["See your site first", "/preview"], ["Start a project", "/start"], ["FAQs", "/#faqs"]] },
];

export function Footer() {
  return (
    <footer className="s-foot">
      <div className="s-wrap">
        <h2 className="s-h s-foot__title">Your website,<br /><Acc>live in a week.</Acc></h2>
        <div className="s-ctas s-ctas--center">
          <Link href="/work" className="s-btn s-btn--line"><Roll>See our work</Roll></Link>
          <Link href="/start" className="s-btn s-btn--grad"><Roll>Book a project</Roll></Link>
        </div>
      </div>

      {/* soft, shapeless colour behind the frosted panel, so the panel reads as blurred glass */}
      <div className="s-foot__glow" aria-hidden="true" />

      <div className="s-wrap">
        <div className="s-foot__panel" id="contact">
          <ul className="s-foot__social">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target={s.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">{s.icon}</svg>
                  {s.label}
                  <Arrow />
                </a>
              </li>
            ))}
          </ul>
          <div className="s-foot__cols">
            {cols.map((c) => (
              <div key={c.title}>
                <h3>{c.title}</h3>
                <ul>{c.links.map(([l, h]) => <li key={l}><Link href={h}>{l}</Link></li>)}</ul>
              </div>
            ))}
            <div>
              <h3>Contact</h3>
              <ul>
                <li><a href={`mailto:${brand.email}`}>Email: {brand.email}</a></li>
                <li><a href={wa(brand.whatsapp)} target="_blank" rel="noopener noreferrer">WhatsApp: {brand.whatsapp}</a></li>
                <li><a href={wa(brand.whatsapp2)} target="_blank" rel="noopener noreferrer">WhatsApp: {brand.whatsapp2}</a></li>
                <li>Instagram: {brand.instagram}</li>
                <li>Serving clients across India</li>
              </ul>
            </div>
          </div>
          <p className="s-foot__copy">© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
