"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Sync ScrollTrigger with Lenis on every scroll tick
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so they share one rAF loop
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Ensure ScrollTrigger refreshes after first layout (helps after route mounts)
    const refresh = () => ScrollTrigger.refresh();
    const id = window.setTimeout(refresh, 200);

    return () => {
      window.clearTimeout(id);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
