"use client";

import { assetPath } from "@/lib/assetPath";

import { CSSProperties, MouseEvent, useEffect, useRef, useState } from "react";

type ImageItem = { src: string; alt: string };
type RevealRegion = { left: number; top: number; width: number; height: number };

export function CursorLabel({ text }: { text: "VIEW" | "SCROLL" }) {
  const ref = useRef<HTMLSpanElement>(null);
  const move = (event: MouseEvent<HTMLElement>) => {
    const parent = event.currentTarget.getBoundingClientRect();
    ref.current?.style.setProperty("transform", `translate3d(${event.clientX - parent.left}px,${event.clientY - parent.top}px,0)`);
  };
  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const handler = (event: globalThis.MouseEvent) => move(event as unknown as MouseEvent<HTMLElement>);
    parent.addEventListener("mousemove", handler);
    return () => parent.removeEventListener("mousemove", handler);
  }, []);
  return <span ref={ref} className="cursor-label" aria-hidden="true">{text}</span>;
}

export function SequentialReveal({ src, alt, regions, delay = 170, replayOnHover = false }: { src: string; alt: string; regions: RevealRegion[]; delay?: number; replayOnHover?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(0);
  const timers = useRef<number[]>([]);

  const play = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setVisible(0);
    requestAnimationFrame(() => {
      timers.current = regions.map((_, index) => window.setTimeout(() => setVisible(index + 1), 120 + index * delay));
    });
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(regions.length);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      if (!replayOnHover) play();
      else setVisible(regions.length);
      observer.disconnect();
    }, { threshold: .5 });
    observer.observe(node);
    return () => { observer.disconnect(); timers.current.forEach(window.clearTimeout); };
  }, [delay, regions, replayOnHover]);

  return <section ref={ref} className={`sequential-reveal${replayOnHover ? " is-hover-replay" : ""}`} onMouseEnter={replayOnHover ? play : undefined}>
    <img src={assetPath(src)} alt={alt} />
    {regions.map((region, index) => <i key={index} className={index < visible ? "is-revealed" : ""} style={{ "--left": `${region.left}%`, "--top": `${region.top}%`, "--width": `${region.width}%`, "--height": `${region.height}%` } as CSSProperties} />)}
    {replayOnHover && <CursorLabel text="VIEW" />}
  </section>;
}

export function ScrollHorizontalImage({ images }: { images: ImageItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const section = sectionRef.current, track = trackRef.current;
    if (!section || !track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (reduced.matches || window.innerWidth <= 760) { track.style.transform = "none"; return; }
      const rect = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(section.offsetHeight - window.innerHeight, 1)));
      track.style.transform = `translate3d(${-Math.max(0, track.scrollWidth - window.innerWidth) * progress}px,0,0)`;
    };
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reduced.addEventListener("change", requestUpdate);
    return () => { window.removeEventListener("scroll", requestUpdate); window.removeEventListener("resize", requestUpdate); reduced.removeEventListener("change", requestUpdate); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return <section ref={sectionRef} className="scroll-horizontal-image" aria-label="媒介行程"><div className="scroll-horizontal-image__sticky"><div ref={trackRef} className="scroll-horizontal-image__track">{images.map((image) => <img key={image.src} src={assetPath(image.src)} alt={image.alt} />)}</div><CursorLabel text="SCROLL" /></div></section>;
}

export function AutoDragCarousel({ images, interval = 2200, label }: { images: ImageItem[]; interval?: number; label: string }) {
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const lastWheel = useRef(0);
  const changeLock = useRef(false);
  const wheelForce = useRef(0);
  const wheelReset = useRef<number | null>(null);
  const autoPauseUntil = useRef(0);

  const show = (index: number) => {
    activeRef.current = index;
    setActive(index);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || images.length < 2) return;
    const timer = window.setInterval(() => {
      if (Date.now() < autoPauseUntil.current) return;
      show((activeRef.current + 1) % images.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [images.length, interval]);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const onWheel = (event: globalThis.WheelEvent) => {
      if (Math.abs(event.deltaY) < 3 || images.length < 2) return;
      const now = performance.now();
      const newGesture = now - lastWheel.current > 190;
      lastWheel.current = now;
      const direction = event.deltaY > 0 ? 1 : -1;
      const current = activeRef.current;
      const next = Math.min(images.length - 1, Math.max(0, current + direction));
      if (next === current) {
        if (!newGesture) event.preventDefault();
        return;
      }
      event.preventDefault();
      if (changeLock.current) return;
      wheelForce.current += event.deltaY;
      if (wheelReset.current) window.clearTimeout(wheelReset.current);
      wheelReset.current = window.setTimeout(() => { wheelForce.current = 0; }, 170);
      if (Math.abs(wheelForce.current) < 72) return;
      wheelForce.current = 0;
      autoPauseUntil.current = Date.now() + 3600;
      changeLock.current = true;
      show(next);
      window.setTimeout(() => { changeLock.current = false; }, 560);
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => { node.removeEventListener("wheel", onWheel); if (wheelReset.current) window.clearTimeout(wheelReset.current); };
  }, [images.length]);

  return <div ref={stage} className="auto-drag-carousel" aria-label={label}>
    <div className="auto-drag-carousel__stage">{images.map((image, index) => <img key={image.src} src={assetPath(image.src)} alt={image.alt} className={index === active ? "is-active" : ""} aria-hidden={index !== active} draggable={false} />)}</div>
    <div className="auto-drag-carousel__dots" aria-label="选择图片">{images.map((image, index) => <button key={image.src} type="button" className={index === active ? "is-active" : ""} onClick={() => { autoPauseUntil.current = Date.now() + 3600; show(index); }} aria-label={`显示第 ${index + 1} 张图片`} aria-current={index === active ? "true" : undefined} />)}</div>
    <CursorLabel text="SCROLL" />
  </div>;
}

export function AutoFadeImages({ images, interval = 2200, label }: { images: ImageItem[]; interval?: number; label: string }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || images.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % images.length), interval);
    return () => window.clearInterval(timer);
  }, [images.length, interval]);
  return <div className="auto-fade-images" aria-label={label}>{images.map((image, index) => <img key={image.src} src={assetPath(image.src)} alt={image.alt} className={index === active ? "is-active" : ""} aria-hidden={index !== active} />)}</div>;
}
