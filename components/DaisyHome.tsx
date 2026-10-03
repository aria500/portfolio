"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { BlackFlowerIcon } from "./BlackFlowerIcon";

export function DaisyHome() {
  const [showIntro, setShowIntro] = useState(false);
  const flower = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = flower.current;
    if (!node) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 760px)");
    let frame = 0;
    let angle = 0;
    let target = 0;
    const update = () => {
      const container = node.closest(".feed-page") as HTMLElement | null;
      const distance = container && container.scrollHeight > container.clientHeight && /auto|scroll/.test(getComputedStyle(container).overflowY) ? container.scrollTop : window.scrollY;
      target = reduced.matches ? 0 : distance * (mobile.matches ? .18 : .24);
      if (reduced.matches) {
        cancelAnimationFrame(frame); frame = 0; angle = 0;
        node.style.transform = "rotate(0deg)";
      } else if (!frame) frame = requestAnimationFrame(tick);
    };
    const tick = () => {
      angle += (target - angle) * .25;
      if (Math.abs(target - angle) < .05) angle = target;
      node.style.transform = `rotate(${angle}deg)`;
      frame = angle === target ? 0 : requestAnimationFrame(tick);
    };
    update();
    document.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update);
    reduced.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem("portfolio-home-hint-seen")) return;
      localStorage.setItem("portfolio-home-hint-seen", "1");
    } catch { /* The hint remains available when storage is disabled. */ }
    setShowIntro(true);
    const timer = window.setTimeout(() => setShowIntro(false), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  return <Link className="xp-daisy-home" href="/" aria-label="Back to Home" data-show-intro={showIntro}>
    <span className="xp-daisy-home__label" aria-hidden="true">HOME</span>
    <span ref={flower} className="black-flower-rotation"><BlackFlowerIcon/></span>
  </Link>;
}
