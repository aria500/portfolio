import Link from "next/link";
import { nextTheme } from "@/data/projectNavigation";
import type { CSSProperties } from "react";
import type { Project } from "@/data/projects";
import { Header } from "./Header";

export type StoryAsset = { src: string; alt: string; kind?: "image" | "video"; contained?: boolean };
export type StoryChapter = { eyebrow: string; title: string; body: string; meta?: string; assets: StoryAsset[] };

export function ProjectStory({ project, next, chapters, downloads = [] }: { project: Project; next: Project; chapters: StoryChapter[]; downloads?: { label: string; href: string }[] }) {
  return (
    <main className="story-page" style={{ "--project-accent": project.accentColor } as CSSProperties}>
      <Header />
      {chapters.map((chapter, chapterIndex) => (
        <section className="story-chapter" id={project.slug === "bloom-with-water" && chapterIndex === 2 ? "ai-next-project" : undefined} key={`${chapter.title}-${chapterIndex}`}>
          <div className="story-copy">
            <p className="story-eyebrow">{chapterIndex === 0 ? `PROJECT [${project.index}]` : chapter.eyebrow}</p>
            <div className="story-copy-body">
              <h1>{chapterIndex === 0 ? project.homeTitle : chapter.title}</h1>
              <p>{chapter.body}</p>
              {chapter.meta && <p className="story-meta">{chapter.meta}</p>}
              {project.slug === "bloom-with-water" && chapterIndex === 0 && <p><Link href="/projects/bloom-with-water/drink-to-bloom">Drink to Bloom — 查看完整案例 ↗</Link></p>}
            </div>
          </div>
          <div className={`story-media ${chapterIndex === 0 ? "story-media--hero" : ""}`}>
            {chapter.assets.map((asset) => asset.kind === "video" ? (
              <video key={asset.src} src={asset.src} muted loop playsInline controls aria-label={asset.alt} />
            ) : (
              <img key={asset.src} src={asset.src} alt={asset.alt} className={asset.contained ? "story-image--contained" : ""} />
            ))}
          </div>
        </section>
      ))}
      <section className="story-chapter story-outro">
        <div className="story-copy">
          <p className="story-eyebrow">ARCHIVE / CONTACT</p>
          <div className="story-copy-body">
            <h2>More details</h2>
            {downloads.map((download) => <a key={download.href} href={download.href} download>{download.label} ↘</a>)}
          </div>
        </div>
        <div className="story-next-wrap">
          <Link className="story-next" href={nextTheme(project.slug).href}>NEXT PROJECT · {nextTheme(project.slug).title} <span>→</span></Link>
        </div>
      </section>
    </main>
  );
}
