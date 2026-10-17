import type { Metadata } from "next";
import { brand } from "@/lib/site";

// The site-wide share picture (app/opengraph-image.tsx); a page with its own openGraph would otherwise lose it.
const shareImage = "/opengraph-image";

/** Google title, description, main address and WhatsApp/Instagram link preview for one page. */
export function pageMeta(title: string, description: string, path: string): Metadata {
  const fullTitle = `${title} — ${brand.name}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: { title: fullTitle, description, url: path, siteName: brand.name, locale: "en_IN", type: "website", images: shareImage },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: shareImage },
  };
}
