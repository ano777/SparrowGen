// Single source of truth for brand + copy. Change the name here and it updates everywhere.
// Renaming or buying the domain? Follow REBRAND.md in the repo root: it lists every place to update.
export const brand = {
  name: "Sparrowgen",
  botName: "SparrowBot", // the chat assistant's name
  website: "https://sparrowgen.com", // the live address (no trailing slash); Google, the sitemap and link previews use it
  tagline: "More customers. Not more templates.",
  tabTitle: "Websites & Automation, Engineered", // shown in the browser tab on the home page
  email: "business@sparrowgen.com",
  whatsapp: "+91 62918 45804",
  whatsapp2: "+91 80178 12091", // second WhatsApp line, shown alongside the main one
  instagram: "@sparrowgen.in",
  instagramUrl: "https://instagram.com/sparrowgen.in",
  city: "Pan India", // we serve clients across India, fully online
};

// The site's full address, used by Google (sitemap, robots, link previews).
// Falls back to the host's URL build variable, then localhost, only if brand.website is empty.
export const siteUrl = brand.website || process.env.URL || "http://localhost:3000";

// Shown in Google results under the page title. Keep each under ~155 characters.
export const seo = {
  homeTitle: `${brand.name} | Website Design & Development Across India`,
  homeDescription: "Hand-coded websites and online stores for cafés, salons, clinics and shops across India. See your design first, live in a week.",
};

// `star` = our USP, shown as a highlighted pill in the middle of the menu.
export const nav: { href: string; label: string; star?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/work", label: "Works" },
  { href: "/preview", label: "See your site first", star: true },
  { href: "/#services", label: "Services" },
  { href: "/why-us", label: "Why us" },
];

// Footer also links to these.
export const navMore = [
  { href: "/#process", label: "Process" },
];

// Hero hook. Positioning: hand-coded by engineers, AI used as a tool — never a generated template.
export const hero = {
  line1: "More customers.",
  line2: "Not more templates.",
  sub: "Look as good online as you are in person. Our engineers design and build every site around your business, using AI to move faster, never to cut corners. Live in a week.",
};

// "See your website in 5 seconds" — the hero builder. Each type is a mini site template.
export type SiteKind = {
  id: string;
  label: string;
  headline: string;
  cta: string;
  nav: [string, string, string];
  colors: { bg: string; text: string; accent: string; card: string };
};

export const siteKinds: SiteKind[] = [
  { id: "cafe", label: "Café", headline: "Coffee worth the detour.", cta: "See the menu", nav: ["Menu", "Visit", "Order"], colors: { bg: "#2a1610", text: "#fff3e6", accent: "#fa7e1e", card: "#4a2a1e" } },
  { id: "boutique", label: "Boutique", headline: "New drop. Limited pieces.", cta: "Shop the drop", nav: ["New in", "Shop", "Lookbook"], colors: { bg: "#fff1f6", text: "#3a0d24", accent: "#d62976", card: "#ffd6e6" } },
  { id: "salon", label: "Salon", headline: "Walk in. Glow out.", cta: "Book a slot", nav: ["Services", "Stylists", "Book"], colors: { bg: "#1d0f2b", text: "#f6ecff", accent: "#b55ce0", card: "#35204a" } },
  { id: "clinic", label: "Clinic", headline: "Care that runs on time.", cta: "Book a visit", nav: ["Doctors", "Services", "Contact"], colors: { bg: "#eef1ff", text: "#141a46", accent: "#4f5bd5", card: "#d9deff" } },
  { id: "bakery", label: "Bakery", headline: "Baked this morning.", cta: "Order today", nav: ["Cakes", "Bakes", "Order"], colors: { bg: "#fff8e4", text: "#3b2400", accent: "#e8a10c", card: "#ffe9a8" } },
  { id: "studio", label: "Studio", headline: "Ideas, made visible.", cta: "See our work", nav: ["Work", "About", "Contact"], colors: { bg: "#111014", text: "#ffffff", accent: "#feda75", card: "#26242c" } },
];

// "Not prompted. Engineered." — what a generated site gives you vs what we do.
export const compare = {
  them: [
    "A layout 10,000 other sites already use",
    "Code nobody on earth can explain",
    "Breaks the first time you need a change",
    "Copy that sounds like everyone else's",
    "Nobody to call when it goes down",
  ],
  us: [
    "Designed around your customers and your brand",
    "Clean code written and reviewed by engineers",
    "Changes done by the people who built it",
    "Words written for the people who buy from you",
    "A real team on WhatsApp, not a chatbot",
  ],
};

export const services = [
  {
    tone: "sun",
    title: "Business websites",
    line: "Look established from day one.",
    points: ["5–15 page sites", "Built-in enquiry forms", "Google-ready SEO", "Built-in automation"],
  },
  {
    tone: "bloom",
    title: "Online stores",
    line: "Stop taking orders in DMs.",
    points: ["Mobile-first storefront", "Product catalogue", "WhatsApp order alerts", "Website chatbot"],
  },
  {
    tone: "dusk",
    title: "Landing pages",
    line: "One page. One job. Converts.",
    points: ["Ad campaign pages", "Launch & event pages", "Lead capture forms", "Live in 2 days"],
  },
];

export type Project = {
  slug: string;
  name: string;
  kind: string;
  result: string;
  palette: [string, string, string];
  headline: string;
  url?: string; // live site. When set, the card opens it in a new tab
  image?: string; // real screenshot in /public (e.g. "/work/spotturf-cover.webp"). Replaces the drawn mock
  nav?: [string, string, string]; // words in the mock's nav bar (defaults to Shop / About / Contact)
  concept?: boolean; // a sample site we made ourselves, not client work. Shown with a "Demo" label (required: misleading-ads rules)
  category: string; // filter chip on /work
};

// Our work: client sites first, then demo sites. Keep this list short.
// Real client projects must NOT have concept: true; demo ones must keep it.
export const projects: Project[] = [
  { slug: "dk-banquet", category: "Banquet", name: "D. K. Banquet", kind: "Banquet hall website", result: "Book-your-date enquiries", palette: ["#6e1424", "#fbf7f0", "#c9a86a"], headline: "Where every celebration becomes a memory.", url: "https://client-demo--dk-banquet-kolkata.netlify.app/", image: "/work/dk-banquet-hero.jpg", nav: ["Rooms", "Gallery", "Contact"] },
  { slug: "tolly-cafe", category: "Café", name: "Tolly Café", kind: "Cafe & restaurant website", result: "Table bookings on WhatsApp", palette: ["#12302e", "#fbfbf6", "#c7302a"], headline: "A home-style café & restaurant in Tollygunge.", url: "https://tolly-cafe-restaurant.netlify.app/", image: "/work/tolly-cafe-cover.webp", nav: ["Our story", "Menu", "Visit"] },
  { slug: "kerbside-cafe", category: "Café", name: "The Kerbside Café", kind: "Cafe website", result: "Directions and calls in one tap", palette: ["#1e2a1a", "#f1e7d3", "#e8920f"], headline: "Craft coffee and Kolkata Bhetki in Golf Gardens.", url: "https://kerbside-cafe.netlify.app/", image: "/work/kerbside-cafe-cover.webp", nav: ["Menu", "Visit", "Call"] },
  { slug: "spotturf", concept: true, category: "Sports", name: "SpotTurf Kolkata", kind: "Turf booking website", result: "Live slot booking", palette: ["#0f3d27", "#f2efe4", "#f6c21c"], headline: "Play till midnight in Kasba.", url: "https://spot-turfs.netlify.app/", image: "/work/spotturf-cover.webp", nav: ["Book", "Rates", "Photos"] },
];

export const steps = [
  { title: "Say hi", body: "Message us or fill the 3-question form. We call you within a day." },
  { title: "See it first", body: "You get a design to approve before a single line of code is written." },
  { title: "Watch it build", body: "A live preview link updates as we go. Comment on anything." },
  { title: "Go live", body: "Domain and hosting set up, your site goes live. SEO and analytics follow in steps as it grows." },
];

export const faqs = [
  { q: "How long does a website take?", a: "Most sites go live in 1 week. Landing pages can be done in 2 days." },
  { q: "Do I need to write the content?", a: "No. Send us what you have — even voice notes or your Instagram captions — and we'll shape it into copy that sells." },
  { q: "Can I edit the site myself later?", a: "Just contact us and we'll make the changes for you. Someone will reach out to you within 24 hours." },
  { q: "What about domain and hosting?", a: "We set both up for you, so you never have to touch a server." },
  { q: "What if I don't like the design?", a: "You approve the design before we build, and revisions are part of the process." },
];

// Backgrounds (the light/dark switch in the nav). Cream (beige, light) is the default; visitors can switch to Night (dark).
// White and Lavender are kept in the code and CSS but hidden: set `hidden: false` to bring one back. Colours live in globals.css.
export const THEMES = [
  { id: "cream", label: "Cream", mode: "Light", swatch: "#faf3e5", hidden: false },
  { id: "night", label: "Night", mode: "Dark", swatch: "#120a1a", hidden: false },
  { id: "white", label: "White", mode: "Light", swatch: "#ffffff", hidden: true },
  { id: "lavender", label: "Lavender", mode: "Light", swatch: "#f3ecfb", hidden: true },
] as const;
export type Theme = (typeof THEMES)[number]["id"];
export const VISIBLE_THEMES = THEMES.filter((t) => !t.hidden);
export const DEFAULT_THEME: Theme = "cream";
export const THEME_KEY = "site-theme-v3"; // bumped when Cream became the default again, so everyone starts on it

