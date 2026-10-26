import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Credibility } from "@/components/home/credibility";
import { KeyNumbers } from "@/components/home/key-numbers";
import { ProductBento } from "@/components/home/product-bento";
import { WavelengthExplorer } from "@/components/home/wavelength-explorer";
import { LabProof } from "@/components/home/lab-proof";
import { Story } from "@/components/home/story";
import { ApplicationsStrip, CtaBand, MissionVision, WhyPrenishQ } from "@/components/home/closing-sections";
import { Section, SectionHeading } from "@/components/ui/section";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: "PrenishQ | Narrow-linewidth diode lasers for quantum technologies, made in India" },
  description:
    "Narrow-linewidth diode lasers, external cavity diode lasers (ECDL), DBR lasers and tapered amplifiers for cold-atom experiments, quantum sensing and spectroscopy. An IIT Delhi spin-off supported by the National Quantum Mission.",
  alternates: { canonical: "/" },
  openGraph: { title: site.tagline, url: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Credibility />
      <KeyNumbers />
      <ProductBento />
      <Story />
      <Section labelledBy="explorer-title" className="border-t border-line">
        <div className="container-x">
          <SectionHeading
            id="explorer-title"
            eyebrow="Wavelength explorer"
            title="Pick a wavelength. See what lights up."
            intro="Drag across the spectrum, choose a preset or jump to an atomic line to see which instruments cover it and where they're used."
          />
          <WavelengthExplorer />
        </div>
      </Section>
      <LabProof />
      <ApplicationsStrip />
      <WhyPrenishQ />
      <MissionVision />
      <CtaBand />
    </>
  );
}
