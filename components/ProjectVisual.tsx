"use client";

import { assetPath } from "@/lib/assetPath";

import { useEffect, useRef } from "react";
import type { Project } from "@/data/projects";
import { BuiltWithAIHero } from "./BuiltWithAIHero";

export function ProjectVisual({
  project,
  active,
  previewing,
}: {
  project: Project;
  active: boolean;
  previewing: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (active && previewing) {
      void video.play().catch(() => undefined);
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [active, previewing]);

  return (
    <figure
      className={`home-visual home-visual--${project.visualVariant}${active ? " is-active" : ""}`}
      aria-hidden={!active}
    >
      {project.visualVariant === "botanical" ? (
        <BuiltWithAIHero />
      ) : project.image ? (
        <>
          <img src={assetPath(project.image)} alt={project.imageAlt} />
          {project.video ? (
            <video
              ref={videoRef}
              className={`home-visual-video${active && previewing ? " is-previewing" : ""}`}
              src={assetPath(project.video)}
              poster={assetPath(project.image)}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          ) : null}
        </>
      ) : (
        <div className="visual-placeholder" role="img" aria-label={`${project.imageAlt}. Placeholder image.`}>
          <div className="visual-field visual-field--primary" />
          <div className="visual-field visual-field--secondary" />
          <div className="visual-field visual-field--detail" />
        </div>
      )}
    </figure>
  );
}
