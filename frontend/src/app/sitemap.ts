import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Served at /sitemap.xml. Add new public pages here.
const pages = [
  { path: "", priority: 1 },
  { path: "/preview", priority: 0.9 },
  { path: "/work", priority: 0.8 },
  { path: "/why-us", priority: 0.8 },
  { path: "/about", priority: 0.7 },
  { path: "/start", priority: 0.7 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
  { path: "/cookies", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => ({ url: `${siteUrl}${p.path}`, lastModified: new Date(), priority: p.priority }));
}
