import type { MediaName } from "@/lib/image-loader";

export type GalleryItem = {
  image: MediaName;
  alt: string;
  caption: string;
  credit?: string;
  kind: "lab" | "product";
};

// The live gallery page is empty. Seeded with catalogue and live-site imagery.
// TODO(client): lab, event and installation photography with captions and credits.
export const gallery: GalleryItem[] = [
  {
    image: "opal-bench-photo",
    alt: "OPAL laser head on an optical breadboard in the PrenishQ lab, with its driver behind it.",
    caption: "OPAL on the bench in the PrenishQ lab.",
    kind: "lab",
  },
  {
    image: "nv-diamond-fluorescence",
    alt: "Diamond cube glowing red under green laser excitation.",
    caption: "NV centre fluorescence captured using the 520 nm OPAL laser at PrenishQ.",
    kind: "lab",
  },
  {
    image: "cs-mot-fluorescence",
    alt: "False-colour fluorescence image of a cloud of laser-cooled caesium atoms, with a 1 mm scale bar.",
    caption: "Magneto-optical trap of Cs atoms, laser-cooled to 15 µK at IIT Delhi.",
    kind: "lab",
  },
  {
    image: "cancer-cell-405",
    alt: "False-colour fluorescence micrograph of cancer tissue with a 200 µm scale bar.",
    caption: "Cancer cell image captured using the 405 nm OPAL laser at BITS Pilani, Hyderabad Campus.",
    credit: "Courtesy of Prof. Sudipta Maiti, BITS Pilani, Hyderabad Campus.",
    kind: "lab",
  },
  {
    image: "agate",
    alt: "AGATE external cavity diode laser on an optical table.",
    caption: "AGATE external cavity diode laser.",
    kind: "product",
  },
  {
    image: "dbrpro-cs-sas",
    alt: "Saturated absorption spectrum of caesium-133 showing the F = 4 and F = 3 manifolds and crossover resonances.",
    caption: "Saturated absorption spectrum of ¹³³Cs recorded at IIT Delhi with DBR PRO.",
    kind: "lab",
  },
  {
    image: "opal-fibre",
    alt: "OPAL compact diode laser with a blue fibre patch cable on an optical table.",
    caption: "OPAL compact diode laser, fibre-coupled.",
    kind: "product",
  },
  {
    image: "agate-linewidth-plot",
    alt: "Self-heterodyne beat note with FWHM 90 ± 3 kHz.",
    caption: "AGATE linewidth, 90 ± 3 kHz FWHM, measured by self-heterodyne at IIT Delhi.",
    kind: "lab",
  },
  {
    image: "opal-fibre-alt",
    alt: "OPAL laser head with fibre output and driver.",
    caption: "OPAL with fibre output.",
    kind: "product",
  },
  {
    image: "opal-free-space",
    alt: "OPAL free-space laser on an optical table, emitting a blue beam.",
    caption: "OPAL free-space configuration.",
    kind: "product",
  },
];
