"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import feed from "./MadeForTheFeedPoster.module.css";
import styles from "./EditorialScroll.module.css";

// Shares Feed's actual typography/material stylesheet, not a second title system.
export const editorialPageClass = `feed-poster-page ${feed.page}`;

export function EditorialBackground({ colors }: { colors: readonly string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;
    const anchors = Array.from(layer.parentElement!.querySelectorAll<HTMLElement>("[data-editorial-chapter]"));
    const rgb = colors.map(hex => [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16)));
    let frame = 0;
    // Same viewport sampling and anchor interpolation as FeedBackgroundLayer.
    const update = () => {
      const position = scrollY + innerHeight * .48;
      const points = anchors.map(node => node.getBoundingClientRect().top + scrollY + Math.min(node.offsetHeight * .18, innerHeight * .34));
      let index = 0;
      while (index < points.length - 1 && position >= points[index + 1]) index++;
      const next = Math.min(index + 1, points.length - 1);
      const progress = Math.max(0, Math.min(1, (position - points[index]) / Math.max(1, points[next] - points[index])));
      const color = rgb[index].map((channel, i) => Math.round(channel + (rgb[next][i] - channel) * progress));
      layer.style.backgroundColor = `rgb(${color.join(",")})`;
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    anchors.forEach(node => resize.observe(node));
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); removeEventListener("scroll", schedule); removeEventListener("resize", schedule); };
  }, [colors]);
  return <div ref={ref} className={feed.backgroundLayer} aria-hidden="true" />;
}

export function EditorialChapter({ number, title, english, summary, keywords, children, id, className = "" }: {
  number: string; title: string; english: string; summary: string; keywords: string[]; children: ReactNode; id?: string; className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const nodes = ref.current!.querySelectorAll<HTMLElement>("[data-editorial-reveal], [data-growth-panel]");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      (entry.target as HTMLElement).dataset.active = entry.isIntersecting ? "true" : "false";
    }), { threshold: .18 });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return <section ref={ref} id={id} data-editorial-chapter className={`feed-fixed-story ${styles.chapter} ${className}`} style={{ "--story-bg": "transparent", "--story-title": "#454d39" } as CSSProperties}>
    <div className="feed-fixed-story__sticky">
      <div className="feed-fixed-story__copy">
        <div className="feed-fixed-story__heading"><span className="feed-chapter-part">PART {number}</span><h2>{title}</h2><p lang="en">{english}</p></div>
        <p className="feed-fixed-story__summary">{summary}</p>
        <ul className="feed-fixed-story__keywords">{keywords.map(word => <li key={word}>{word}</li>)}</ul>
      </div>
    </div>
    <div className={`feed-fixed-story__foreground ${styles.foreground}`}>{children}</div>
  </section>;
}
