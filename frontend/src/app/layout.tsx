import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ScrollManager } from "@/components/ScrollManager";
import { ChatBot } from "@/components/ChatBot";
import { brand, DEFAULT_THEME, seo, siteUrl, THEME_KEY, THEMES } from "@/lib/site";

const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--font-display", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
// Accent only: labels, nav, captions, code. Never headlines or body copy.
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seo.homeTitle,
  description: seo.homeDescription,
  alternates: { canonical: "/" },
  openGraph: { title: seo.homeTitle, description: seo.homeDescription, url: "/", siteName: brand.name, locale: "en_IN", type: "website" },
  twitter: { card: "summary_large_image", title: seo.homeTitle, description: seo.homeDescription },
};

// Business details Google can show in search (structured data, schema.org).
const businessInfo = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: brand.name,
  description: seo.homeDescription,
  url: siteUrl,
  email: brand.email,
  telephone: brand.whatsapp.replace(/\s/g, ""),
  areaServed: { "@type": "Country", name: "India" },
  sameAs: [brand.instagramUrl],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme={DEFAULT_THEME} data-scroll-behavior="smooth" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});if(t==="bright"||t==="beige"||t==="dotted")t="cream";if(${JSON.stringify(THEMES.map((t) => t.id))}.indexOf(t)>-1)document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessInfo) }} />
      </head>
      <body>
        <ScrollManager />
          <Nav />
          <main>{children}</main>
          <Footer />
          <ChatBot />
      </body>
    </html>
  );
}
