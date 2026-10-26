import type { ProductSlug } from "@/data/products";
import type { PaletteNm } from "@/data/wavelengths";

export type Schematic = "atoms" | "ions" | "nv" | "clock" | "spectroscopy" | "memory";

export type Application = {
  slug: string;
  title: string;
  /** Card copy, 40–60 words. */
  summary: string;
  /** Expanded copy. */
  detail: string[];
  /** Each link states why the product fits, derived from catalogue ranges or demonstrated results. */
  products: { slug: ProductSlug; why: string }[];
  schematic: Schematic;
  accent: PaletteNm;
};

export const applications: Application[] = [
  {
    slug: "neutral-atoms",
    title: "Quantum computing with neutral atoms",
    summary:
      "Neutral-atom processors hold individual atoms, laser-cooled to microkelvin temperatures, in arrays of optical tweezers. Lasers prepare, entangle and read out every qubit, and Rydberg excitation switches on strong interactions between neighbours for two-qubit gates. Each step depends on frequency-stable, narrow-linewidth light at the atom's transitions.",
    detail: [
      "A typical experiment starts with a magneto-optical trap (MOT): cooling and repump beams tuned close to an alkali D2 line, such as Rb at 780 nm or Cs at 852 nm, slow a vapour of atoms to tens of microkelvin. Tightly focused tweezer beams then pick out single atoms and arrange them into reconfigurable arrays.",
      "The cooling light must stay locked within a fraction of the transition linewidth for hours, and tweezer arrays and large MOT beams need watt-level optical power. This combination of narrow linewidth, stable referencing and power is what the PrenishQ line is built around.",
    ],
    products: [
      { slug: "agate", why: "< 100 kHz linewidth for cooling and repump light; Cs MOT at 15 µK demonstrated at IIT Delhi." },
      { slug: "dbr-pro", why: "Spectroscopy-locked reference at the Rb (780 nm) and Cs (852 nm) D2 lines." },
      { slug: "ta", why: "> 2 W saturated output to power MOT beams and tweezer arrays." },
    ],
    schematic: "atoms",
    accent: 785,
  },
  {
    slug: "trapped-ions",
    title: "Quantum computing with trapped ions",
    summary:
      "Trapped-ion qubits are single charged atoms held in electromagnetic traps and controlled entirely with light. Lasers cool the ions, prepare and read out their internal states, and drive high-fidelity gates. Common species such as Yb⁺ and Ca⁺ need narrow-linewidth sources in the violet and near-UV, plus infrared repump lasers.",
    detail: [
      "Each ion species sets its own wavelength list. Yb⁺ is Doppler-cooled at 369.5 nm and repumped near 935 nm; Ca⁺ is cooled at 397 nm with repumpers near 866 nm. Because the qubit is read out through fluorescence, laser frequency noise directly limits state-detection fidelity.",
      "Systems scale by adding ions to a chain or linking traps, so the same lasers must be reproducible from one setup to the next.",
    ],
    products: [
      { slug: "agate", why: "369–1600 nm range covers the Yb⁺ (369.5 nm) and Ca⁺ (397 nm) cooling lines; Yb⁺ and Ca⁺ listed in the catalogue." },
      { slug: "dbr", why: "730–1090 nm covers common IR repumpers such as Ca⁺ 866 nm and Yb⁺ 935 nm." },
    ],
    schematic: "ions",
    accent: 405,
  },
  {
    slug: "nv-centres",
    title: "Nitrogen-vacancy centres in diamond",
    summary:
      "Nitrogen-vacancy (NV) centres are point defects in diamond whose electron spin can be initialised and read out optically at room temperature. Green excitation produces red fluorescence whose brightness depends on the spin state, enabling sensitive magnetometry, thermometry and nanoscale imaging in compact, cryogen-free instruments.",
    detail: [
      "In optically detected magnetic resonance (ODMR), a green laser pumps the NV spin into a known state while a microwave field is swept. Dips in the red fluorescence reveal the local magnetic field through the Zeeman shift.",
      "Sensitivity depends on stable excitation power and low intensity noise, which makes a compact, power-stable source the core of an NV sensor.",
    ],
    products: [
      { slug: "opal", why: "520 nm OPAL used to capture NV centre fluorescence at PrenishQ; < 1 % power drift over 10+ hours." },
    ],
    schematic: "nv",
    accent: 520,
  },
  {
    slug: "metrology-clocks",
    title: "Quantum metrology and atomic clocks",
    summary:
      "Atomic clocks and quantum sensors measure time, frequency and fields against atomic transitions. Lasers interrogate the atoms, and their linewidth and frequency stability set the floor of the measurement. The SI second is defined by the caesium-133 hyperfine transition; optical clocks using strontium atoms or single ions now reach far higher precision.",
    detail: [
      "Compact vapour-cell clocks and magnetometers lock a laser to an alkali line using saturated absorption or similar Doppler-free techniques. Cold-atom clocks and atom interferometers add laser cooling and state preparation.",
      "Applications range from telecom and power-grid timing to satellite navigation and inertial sensing, wherever a measurement must trace back to an atomic standard.",
    ],
    products: [
      { slug: "agate", why: "Optical clocks listed among AGATE's applications; < 100 kHz linewidth." },
      { slug: "dbr-pro", why: "Integrated spectroscopy and lock-in detection for ultra-stable Rb/Cs referencing." },
      { slug: "dbr", why: "High frequency stability; interferometry and atomic spectroscopy." },
    ],
    schematic: "clock",
    accent: 633,
  },
  {
    slug: "laser-spectroscopy",
    title: "High-precision laser spectroscopy",
    summary:
      "Laser spectroscopy measures atomic and molecular structure by scanning a narrow-linewidth laser across a transition. Saturated absorption removes Doppler broadening to reveal hyperfine structure, and the same signal can lock a laser to an atomic reference. Raman and non-linear techniques extend the method to chemical identification and materials analysis.",
    detail: [
      "In a saturated absorption setup, a strong pump and a weak probe counter-propagate through a vapour cell. Only atoms at zero velocity interact with both beams, so sharp sub-Doppler features appear, including crossover resonances halfway between hyperfine lines.",
      "Raman spectroscopy instead measures the small frequency shift of light scattered by molecular vibrations. It needs a spectrally narrow, stable excitation line, commonly at 785 nm to reduce fluorescence background.",
    ],
    products: [
      { slug: "dbr-pro", why: "¹³³Cs saturated absorption spectrum with crossover resonances recorded at IIT Delhi." },
      { slug: "agate", why: "5 GHz mode-hop-free scan across hyperfine structure." },
      { slug: "opal", why: "< 0.1 pm linewidth at 785 nm for Raman spectroscopy." },
      { slug: "ta", why: "Watt-class power for non-linear spectroscopy and frequency conversion." },
    ],
    schematic: "spectroscopy",
    accent: 633,
  },
  {
    slug: "quantum-memory",
    title: "Quantum memory with laser-cooled atoms",
    summary:
      "A quantum memory stores a photon's quantum state in matter and releases it on demand, a building block for quantum repeaters and long-distance quantum networks. Leading approaches use clouds of laser-cooled atoms, in which a control laser maps light into long-lived atomic coherences through effects such as electromagnetically induced transparency.",
    detail: [
      "Memory efficiency and storage time depend on optical depth and coherence, so the atoms are cooled and trapped first. Phase-stable probe and control fields are then tuned to a lambda-type transition.",
      "The same cold-atom toolkit used for quantum computing applies: locked cooling light, frequency-agile probe lasers and enough power for large, dense clouds.",
    ],
    products: [
      { slug: "agate", why: "Narrow-linewidth probe and control light across alkali lines." },
      { slug: "ta", why: "Cold-atom experiments listed among TA applications; > 2 W output." },
      { slug: "dbr-pro", why: "Stable atomic frequency reference at 780 and 852 nm." },
    ],
    schematic: "memory",
    accent: 785,
  },
];
