"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent, TouchEvent, WheelEvent } from "react";
import Link from "next/link";
import { themeFor } from "@/data/projectNavigation";
import type { Project } from "@/data/projects";
import { ProjectVisual } from "./ProjectVisual";
import { DaisyHome } from "./DaisyHome";

const SWITCH_DURATION = 620;

export function PortfolioHome({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [hasExplored, setHasExplored] = useState(false);
  const locked = useRef(false);
  const touchStart = useRef<number | null>(null);

  const selectProject = (nextIndex: number) => {
    const bounded = Math.max(0, Math.min(projects.length - 1, nextIndex));
    if (bounded === activeIndex || locked.current) return;
    locked.current = true;
    setHasExplored(true);
    setActiveIndex(bounded);
    window.setTimeout(() => { locked.current = false; }, SWITCH_DURATION);
  };

  const previewProject = (nextIndex: number) => {
    if (nextIndex === activeIndex) return;
    setHasExplored(true);
    setActiveIndex(nextIndex);
  };

  const onWheel = (event: WheelEvent<HTMLElement>) => {
    if (Math.abs(event.deltaY) < 8) return;
    event.preventDefault();
    selectProject(activeIndex === null ? 0 : activeIndex + (event.deltaY > 0 ? 1 : -1));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (["ArrowDown", "PageDown", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      selectProject(activeIndex === null ? 0 : activeIndex + 1);
    }
    if (["ArrowUp", "PageUp", "ArrowLeft"].includes(event.key)) {
      event.preventDefault();
      selectProject(activeIndex === null ? 0 : activeIndex - 1);
    }
  };

  const onTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStart.current = event.touches[0]?.clientY ?? null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStart.current === null) return;
    const distance = touchStart.current - (event.changedTouches[0]?.clientY ?? touchStart.current);
    if (Math.abs(distance) > 44) selectProject(activeIndex === null ? 0 : activeIndex + (distance > 0 ? 1 : -1));
    touchStart.current = null;
  };

  const activeProject = activeIndex === null ? null : projects[activeIndex];
  const showAbout = activeProject === null || activeProject.slug === "brand-planning";

  return (
    <main
      className="portfolio-home"
      style={{ "--active-accent": activeProject?.accentColor ?? "#747b6d" } as React.CSSProperties}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
    >
      <header className="home-header">
        <Link href="/" className="home-identity">
          <strong>张炎 / Yan Zhang</strong>
        </Link>
      </header>

      <DaisyHome />

      <section
        className="home-directory"
        aria-label="Project directory"
        onMouseLeave={() => setHighlightedIndex(null)}
      >
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            href={themeFor(project.slug).href}
            className={index === activeIndex ? "is-active" : ""}
            data-chinese-visible={index === (highlightedIndex ?? activeIndex)}
            style={{ "--project-nav-color": project.navColor } as React.CSSProperties}
            onMouseEnter={() => {
              setHighlightedIndex(index);
              previewProject(index);
            }}
            onFocus={() => {
              setHighlightedIndex(index);
              previewProject(index);
            }}
            onBlur={() => setHighlightedIndex(null)}
            aria-current={index === activeIndex ? "true" : undefined}
          >
            <span className="home-directory-title">{project.homeTitle}</span>
            <small className="home-directory-chinese" aria-hidden={index !== (highlightedIndex ?? activeIndex)}>{({ "anxiety-fighter": "内容表达", "selected-visuals": "品牌策划", "bloom-with-water": "AI 产品实验", "content-channel": "视觉笔记", "brand-planning": "关于我" } as Record<string,string>)[project.slug]}</small>
          </Link>
        ))}
        <div className="home-directory-description-panel" aria-live="polite" key={`description-${activeProject?.slug ?? "default"}`}>
          <p>{activeProject?.description ?? "\u00a0"}</p>
        </div>
      </section>

      <section className="home-visual-stage" aria-label="Current project preview">
        {showAbout && (
          <div className="home-about-preview">
            <p className="home-about-label">关于我 / ABOUT</p>
            <h1>张炎 <span>/ Yan Zhang</span></h1>
            <h2>内容策划 · 新媒体运营</h2>
            <div className="home-about-copy">
              <p>广告学背景，关注内容策划、品牌表达与 AI 辅助创作。</p>
              <p>有自媒体运营、品牌策划与跨境电商相关项目经验，习惯从选题、文案、视觉和复盘几个维度推进内容。</p>
              <p>最近也在尝试使用 AI，把内容与产品想法快速做成可交互的作品。</p>
            </div>
            <div className="home-about-links">
              <a href="mailto:ian2280395276@gmail.com">Email ↗</a>
              <a href="/downloads/aria-zhang-resume.pdf" download>Download Resume ↓</a>
              <a href="https://aria500.github.io/waterflower/?v=14days-final" target="_blank" rel="noopener noreferrer">Drink to Bloom · Live Project ↗</a>
            </div>
          </div>
        )}
        {projects.map((project, index) => (
          <ProjectVisual
            key={project.slug}
            project={project}
            active={!showAbout && index === activeIndex}
            previewing={index === highlightedIndex}
          />
        ))}
      </section>

      <p className={`home-scroll-hint${hasExplored ? " is-hidden" : ""}`}>SCROLL TO EXPLORE ↓</p>
    </main>
  );
}
