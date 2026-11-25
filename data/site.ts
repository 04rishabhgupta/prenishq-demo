import type { MediaName } from "@/lib/image-loader";

export const site = {
  name: "PrenishQ",
  legalName: "Prenishq Pvt. Ltd.", // TODO(client): confirm display casing "PrenishQ" vs "Prenishq"
  url: "https://www.prenishq.com",
  tagline: "Precision diode lasers for the quantum era.",
  description:
    "PrenishQ designs and manufactures narrow-linewidth, fibre-coupled diode lasers, external cavity diode lasers and tapered amplifiers for quantum technologies, spectroscopy and research. An IIT Delhi spin-off supported by the National Quantum Mission.",
  email: "info@prenishq.com",
  departments: [
    { name: "Sales", email: "sales@prenishq.com", blurb: "Quotes, lead times, configurations and volume orders." },
    { name: "Service", email: "service@prenishq.com", blurb: "Installation, alignment, repairs and post-sales support." },
    { name: "Education", email: "education@prenishq.com", blurb: "Teaching labs, student training and academic partnerships." },
  ],
  address: {
    lines: ["2nd Floor, Synergy Building", "TBIU Complex, IIT Delhi", "Hauz Khas, New Delhi 110016"],
    street: "2nd Floor, Synergy Building, TBIU Complex, IIT Delhi, Hauz Khas",
    locality: "New Delhi",
    postalCode: "110016",
    country: "IN",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Synergy+Building+TBIU+IIT+Delhi+Hauz+Khas+New+Delhi+110016",
    mapsEmbed:
      "https://www.google.com/maps?q=Synergy+Building,+IIT+Delhi,+Hauz+Khas,+New+Delhi+110016&output=embed",
  },
  phone: null as string | null, // TODO(client): no company phone is published anywhere
  socials: [] as { label: string; href: string }[], // TODO(client): LinkedIn etc.
} as const;

// Five main pages (PLAN §11). Header and mobile menu.
export const nav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/technology", label: "Technology" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

// Footer index: each main page with its key sections.
export const footerColumns = [
  {
    title: "Products",
    href: "/products",
    links: [
      { href: "/products#catalogue", label: "All products" },
      { href: "/products#find", label: "Find your laser" },
      { href: "/products#systems", label: "Suggested systems" },
      { href: "/products#downloads", label: "Downloads" },
    ],
  },
  {
    title: "Technology",
    href: "/technology",
    links: [
      { href: "/technology#how", label: "How it works" },
      { href: "/technology#applications", label: "Applications" },
      { href: "/technology#results", label: "Lab results" },
      { href: "/technology#glossary", label: "Glossary" },
    ],
  },
  {
    title: "Company",
    href: "/about",
    links: [
      { href: "/about#story", label: "Our story" },
      { href: "/about#lab", label: "Inside the lab" },
      { href: "/about#backers", label: "Backers" },
      { href: "/contact#faq", label: "FAQ" },
    ],
  },
] as const;

export type Funder = { name: string; logo: MediaName; w: number; h: number };

// Order and membership from the live site's "Incubated and funded by" strip.
// TODO(client): SVG logos and permission to display.
export const funders: Funder[] = [
  { name: "Indian Institute of Technology Delhi", logo: "logo-iit-delhi", w: 220, h: 220 },
  { name: "Foundation for Innovation and Technology Transfer (FITT), IIT Delhi", logo: "logo-fitt", w: 176, h: 180 },
  { name: "National Mission on Interdisciplinary Cyber-Physical Systems (NM-ICPS)", logo: "logo-nm-icps", w: 800, h: 800 },
  { name: "I-Hub Quantum Technology Foundation", logo: "logo-ihub-qtf", w: 270, h: 120 },
  { name: "DST NIDHI PRAYAS", logo: "logo-dst-nidhi-prayas", w: 250, h: 150 },
  { name: "KIET Group of Institutions", logo: "logo-kiet", w: 538, h: 464 },
  { name: "National Quantum Mission", logo: "logo-nqm", w: 763, h: 808 },
  { name: "BITS BioCyTiH Foundation", logo: "logo-bits-biocytih", w: 113, h: 174 },
];

// Catalogue p.8, "Why choose our laser systems?"
export const whyUs = [
  {
    title: "Fast delivery",
    icon: "truck",
    points: ["Short lead times", "Faster product availability"],
  },
  {
    title: "Competitive pricing",
    icon: "tag",
    points: ["Cost-effective laser solutions", "Competitive pricing compared with imported systems"],
  },
  {
    title: "High quality, customised",
    icon: "badge",
    points: ["High-performance and reliable laser systems", "Precision-engineered for demanding scientific applications"],
  },
  {
    title: "Technical support",
    icon: "headset",
    points: ["Expert application support", "Assistance with system selection and integration", "Responsive post-sales technical support"],
  },
] as const;

// Catalogue p.2, "Our Mission and Vision"
export const mission = {
  mission:
    "Make high-precision laser technology accessible through reliable, cost-effective solutions that empower research and industry.",
  vision:
    "A future where advanced photonics accelerates scientific discovery, drives industrial innovation, and transforms precision technology into real-world impact.",
  longTerm:
    "Our long-term ambition remains the one we started with: building the lasers, optics and control systems that large-scale quantum computers will need.",
  pillars: [
    { title: "Deep Technology", sub: "Our foundation" },
    { title: "Real Impact", sub: "Our purpose" },
    { title: "Limitless Possibilities", sub: "Our horizon" },
    { title: "A Better Tomorrow", sub: "Our promise" },
  ],
} as const;

// Catalogue p.7, "Precision lasers, limitless possibilities"
export const applicationAreas = [
  "Biomedical",
  "Raman Spectroscopy",
  "Fluorescence",
  "Particle Size Analysis",
  "Quantum Communication",
  "Quantum Sensing",
  "Quantum Optics",
  "Quantum Computing",
  "Atomic/Molecular Spectroscopy",
] as const;
