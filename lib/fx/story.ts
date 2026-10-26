// Sticky scroll story (Aceternity "Sticky Scroll Reveal" pattern) driven by GSAP ScrollTrigger.
// Desktop only; loaded when the section is one viewport away. Animates transform/opacity only.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function mountStory(root: HTMLElement): () => void {
  gsap.registerPlugin(ScrollTrigger);
  root.setAttribute("data-story-live", "");

  const steps = [...root.querySelectorAll<HTMLElement>("[data-step]")];
  // Build the sticky stage from the inline diagrams (they're in the HTML only once).
  const stage = root.querySelector<HTMLElement>("[data-story-stage]");
  const scenes = [...root.querySelectorAll<HTMLElement>("[data-scene-src]")].map((src) => {
    const scene = src.cloneNode(true) as HTMLElement;
    scene.removeAttribute("data-scene-src");
    scene.setAttribute("data-scene", src.dataset.sceneSrc!);
    scene.className = "story-scene absolute inset-0";
    stage?.appendChild(scene);
    return scene;
  });
  const progress = root.querySelector<HTMLElement>("[data-story-progress]");
  const list = root.querySelector<HTMLElement>("[data-story-steps]");

  const setActive = (i: number) => {
    steps.forEach((s, k) => s.toggleAttribute("data-active", k === i));
    scenes.forEach((s, k) => s.toggleAttribute("data-active", k === i));
  };

  const ctx = gsap.context(() => {
    steps.forEach((step, i) =>
      ScrollTrigger.create({
        trigger: step,
        start: "top 60%",
        end: "bottom 60%",
        onToggle: (self) => self.isActive && setActive(i),
      }),
    );
    if (progress && list) {
      gsap.fromTo(
        progress,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 60%", end: "bottom 60%", scrub: 0.3 } },
      );
    }
    // Gentle parallax on the stage itself.
    if (stage)
      gsap.fromTo(stage, { y: 24 }, { y: -24, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
  }, root);

  setActive(0);

  return () => {
    ctx.revert();
    scenes.forEach((s) => s.remove());
    root.removeAttribute("data-story-live");
  };
}
