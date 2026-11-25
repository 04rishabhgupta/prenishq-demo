import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Credibility } from "@/components/home/credibility";
import { KeyNumbers } from "@/components/home/key-numbers";
import { ProductBento } from "@/components/home/product-bento";
import { LabProof } from "@/components/home/lab-proof";
import { HowTeaser } from "@/components/home/how-teaser";
import { CtaBand, WhyPrenishQ } from "@/components/home/closing-sections";
import { ApplicationOutcomes } from "@/components/home/application-outcomes";
import { Updates, Voices } from "@/components/home/client-sections";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: "PrenishQ | Narrow-linewidth diode lasers for quantum technologies, made in India" },
  description:
    "Narrow-linewidth diode lasers, external cavity diode lasers (ECDL), DBR lasers and tapered amplifiers for cold-atom experiments, quantum sensing and spectroscopy. An IIT Delhi spin-off supported by the National Quantum Mission.",
  alternates: { canonical: "/" },
  openGraph: { title: site.tagline, url: "/" },
};

// Home is an overview that routes to the four main pages (PLAN §11).
export default function HomePage() {
  return (
    <>
      <Hero />
      <Credibility />
      <KeyNumbers />
      <ProductBento />
      <ApplicationOutcomes />
      <HowTeaser />
      <LabProof />
      <Voices />
      <Updates />
      <WhyPrenishQ />
      <CtaBand />
    </>
  );
}
