import { ImageResponse } from "next/og";
import { brand, hero } from "@/lib/site";

// The picture shown when the site's link is shared on WhatsApp, Instagram, Facebook or X.
export const alt = `${brand.name}: website design and development across India`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#120a1a", color: "#fff" }}>
        <div style={{ fontSize: 36, opacity: 0.8 }}>{brand.name}</div>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, marginTop: 24 }}>{hero.line1}</div>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, backgroundImage: "linear-gradient(90deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)", backgroundClip: "text", color: "transparent" }}>{hero.line2}</div>
        <div style={{ fontSize: 30, opacity: 0.75, marginTop: 40 }}>{`Hand-coded websites · Serving all of India`}</div>
      </div>
    ),
    size,
  );
}
