"use client";

import { useEffect, useState } from "react";

const sections = ["封面", "挑战", "产品", "策略", "打卡", "视觉", "文案", "快闪", "公益", "旅程", "媒介", "影片", "结尾"];

export function XiaopingRail() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>("[data-rail]")];
    let frame = 0;
    const update = () => {
      frame = 0;
      const focus = window.innerHeight * .42;
      const current = nodes.find((node) => {
        const rect = node.getBoundingClientRect();
        return rect.top <= focus && rect.bottom > focus;
      }) ?? nodes.reduce((closest, node) => Math.abs(node.getBoundingClientRect().top - focus) < Math.abs(closest.getBoundingClientRect().top - focus) ? node : closest, nodes[0]);
      if (current) setActive(Number(current.dataset.rail));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return <nav className="xp-rail" aria-label="Campaign chapters">
    {sections.map((label, index) => <a key={label} href={`#xp-${index}`} className={active === index ? "is-active" : ""} aria-label={label} title={label}><span>{label}</span></a>)}
  </nav>;
}
