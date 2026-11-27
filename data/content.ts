// Site-wide editorial content (FAQ, glossary, technology status) and client-supplied lists.
// Lists marked TODO(client) are intentionally empty: their sections are hidden until filled,
// so the site never shows "coming soon" placeholders.
import type { QA, Paper } from "@/data/product-extras";
import type { MediaName } from "@/lib/image-loader";
import { site } from "@/data/site";

/** Home + Resources FAQ (Infleqtion/Nireos pattern: answers buyers' routing questions). */
export const siteFaq: QA[] = [
  {
    q: "What does PrenishQ make?",
    a: "Precision diode lasers for quantum technologies, spectroscopy and research: the OPAL compact diode laser, the AGATE external cavity diode laser, DBR and DBR PRO single-frequency lasers, and the TA tapered amplifier.",
  },
  {
    q: "Which laser is right for my experiment?",
    a: "Start from the wavelength and linewidth you need. The Find your laser tool on the Products page shows which instruments cover each wavelength, or send us your setup and our team will recommend a configuration.",
  },
  {
    q: "Can you build lasers at wavelengths not listed in the catalogue?",
    a: "AGATE covers 369–1600 nm and the TA 632–1590 nm, with output power depending on the diode. Tell us your target wavelength and we will confirm availability.",
  },
  {
    q: "How do lead times and pricing compare with imported systems?",
    a: "Our lasers are designed and built in India for short lead times and competitive pricing compared with imported systems. Request a quote for a specific configuration and timeline.",
  },
  {
    q: "Do you help with installation and integration?",
    a: `Yes. We offer application support, help with system selection and integration, and post-sales technical support. Write to ${site.departments[1].email} for service.`,
  },
  {
    q: "Do you work with teaching labs and students?",
    a: `We aim to be a skill-development partner for students in quantum technologies. Write to ${site.departments[2].email} about teaching labs and academic partnerships.`,
  },
];

/** Glossary (textbook definitions, Q-CTRL/QuEra pattern). Sorted alphabetically when rendered. */
export const glossary: { term: string; def: string }[] = [
  { term: "Diode laser", def: "A semiconductor laser in which current through a p–n junction produces coherent light. Compact, efficient and available at many wavelengths." },
  { term: "Linewidth", def: "The spectral width of a laser's output, usually quoted as full width at half maximum (FWHM) in Hz or pm. Narrower linewidth means a purer frequency." },
  { term: "FWHM", def: "Full width at half maximum: the width of a peak measured at half its maximum height." },
  { term: "External cavity diode laser (ECDL)", def: "A diode laser with an external optical cavity, often containing a grating, that feeds one frequency back into the diode to narrow its linewidth and allow tuning." },
  { term: "Distributed Bragg reflector (DBR) laser", def: "A diode laser with a Bragg grating built into the chip that selects a single frequency without an external cavity." },
  { term: "Tapered amplifier (TA)", def: "A semiconductor optical amplifier whose gain region widens along its length, boosting a seed laser to watt-level power." },
  { term: "Mode hop", def: "A sudden jump of a laser's frequency from one cavity mode to another. A mode-hop-free scan tunes continuously without such jumps." },
  { term: "Fibre-coupled", def: "Laser output delivered through an optical fibre, simplifying alignment and integration." },
  { term: "Saturated absorption spectroscopy (SAS)", def: "A pump–probe technique that removes Doppler broadening in an atomic vapour, revealing narrow hyperfine features used to lock lasers." },
  { term: "Lock-in detection", def: "A technique that extracts a small modulated signal from noise; used to generate an error signal for frequency locking." },
  { term: "Frequency locking", def: "Holding a laser's frequency on a reference, such as an atomic line, using feedback." },
  { term: "D2 line", def: "The strong 2S1/2 → 2P3/2 transition of alkali atoms: 780 nm in rubidium and 852 nm in caesium, widely used for laser cooling." },
  { term: "Hyperfine structure", def: "Small splittings of atomic energy levels caused by the interaction between the electron and the nucleus." },
  { term: "Crossover resonance", def: "A feature in saturated absorption spectra appearing midway between two transitions that share a level." },
  { term: "Magneto-optical trap (MOT)", def: "Laser beams plus a magnetic field gradient that cool and confine atoms to microkelvin temperatures." },
  { term: "Laser cooling", def: "Slowing atoms using the momentum of absorbed photons, reaching temperatures of microkelvin or below." },
  { term: "Optical tweezers", def: "Tightly focused laser beams that trap individual atoms or particles, used to build neutral-atom qubit arrays." },
  { term: "Rydberg state", def: "A highly excited atomic state with strong interactions, used for two-qubit gates in neutral-atom quantum computers." },
  { term: "Trapped-ion qubit", def: "A qubit encoded in the internal states of a single ion held in an electromagnetic trap and controlled with lasers." },
  { term: "NV centre", def: "A nitrogen-vacancy defect in diamond whose spin can be read out optically at room temperature, used for magnetometry." },
  { term: "ODMR", def: "Optically detected magnetic resonance: reading a spin state through changes in fluorescence while sweeping a microwave field." },
  { term: "Raman spectroscopy", def: "Identifying molecules from the small frequency shift of laser light scattered by molecular vibrations." },
  { term: "Polarisation", def: "The orientation of a light wave's electric field. Many experiments need it stable and well defined." },
  { term: "Optical clock", def: "A clock that counts the oscillations of light locked to a narrow atomic or ionic transition." },
];

/** Technology status (Infleqtion-style availability labels). TODO(client): confirm wording and add dates. */
export const technologyStatus = [
  { area: "Precision diode lasers", status: "available" as const, detail: "OPAL, AGATE, DBR, DBR PRO and TA, from the catalogue." },
  { area: "Quantum sensors", status: "development" as const, detail: "Building on our lasers, optics and electronics." },
  { area: "Quantum computing subsystems", status: "development" as const, detail: "Ultra-high-vacuum chambers, narrow-linewidth lasers and control electronics for neutral-atom systems." },
];

// ── Client-supplied lists (hidden while empty) ──────────────────────────────

/** Named testimonials (LEOS/Toptica pattern). TODO(client): quote, name, role, institution, optional paper. */
export const testimonials: { quote: string; name: string; role: string; institution: string; paper?: Paper }[] = [];

/** Labs and institutions using PrenishQ lasers. TODO(client). */
export const usedIn: { name: string; url?: string }[] = [];

/** Publications that used PrenishQ lasers. TODO(client). */
export const publications: (Paper & { product?: string })[] = [];

/** Application notes. TODO(client). */
export const appNotes: { title: string; href: string; summary: string }[] = [];

/** Events and trade shows. TODO(client). */
export const events: { name: string; date: string; place: string; url?: string }[] = [];

/** News items. TODO(client). */
export const news: { title: string; date: string; summary: string; url?: string }[] = [];

export type TeamMember = {
  name: string;
  role: string;
  bio?: string;
  /** Square portrait from the media pipeline (scripts/media.config.mjs → `team`). */
  photo?: MediaName;
  linkedin?: string;
  /** Shown as a styled placeholder card until real details are supplied. */
  placeholder?: boolean;
};

/**
 * People behind PrenishQ (About → Team). TODO(client): founders' short bios. To add someone,
 * append an entry (photo via scripts/media.config.mjs → `team`).
 */
export const team: TeamMember[] = [
  {
    name: "Dr Suranita Kanjilal",
    role: "Co-founder and Director",
    // Source: client-supplied LinkedIn summary.
    bio: "Computational scientist and quantum technology entrepreneur. Former postdoctoral researcher at Johannes Kepler University Linz (2018–2021), modelling granular and multiphase flows, and at the Heidelberg Institute for Theoretical Studies, applying high-performance computing.",
    photo: "team-suranita-kanjilal",
    linkedin: "https://www.linkedin.com/in/suranita281kanjilal83/",
  },
  {
    name: "Dr Bodhaditya Santra",
    role: "Co-founder and CTO",
    // Source: IIT Delhi / IRINS faculty profile and his publications (LinkedIn blocks automated
    // access). TODO(client): confirm wording.
    bio: "Assistant Professor of Physics at IIT Delhi since 2019. His research covers cold-atom quantum experiments, including compact external cavity diode lasers and laser frequency stabilisation for atom trapping.",
    photo: "team-bodhaditya-santra",
    linkedin: "https://www.linkedin.com/in/bodhaditya-santra-b3069783/",
  },
];

/** Dated milestones. TODO(client). */
export const milestones: { date: string; title: string; detail?: string }[] = [];
