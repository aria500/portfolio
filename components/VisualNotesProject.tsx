import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project } from "@/data/projects";
import { Header } from "./Header";

const visualNotesImages = [
  { src: "/images/visual-notes/01-hero-scene.jpg", alt: "Perfume bottle beside a glass vase filled with plants", className: "visual-notes-photo--hero" },
  { src: "/images/visual-notes/02-product-closeup.jpg", alt: "Close-up of a Loewe perfume bottle with a botanical stem", className: "visual-notes-photo--full" },
  { src: "/images/visual-notes/03-botanical-shadow.jpg", alt: "Perfume bottle beneath soft plant shadows", className: "visual-notes-photo--full" },
  { src: "/images/visual-notes/04-tokyo-street.jpg", alt: "Tokyo street view with Tokyo Skytree", className: "visual-notes-photo--contained visual-notes-photo--diary-start" },
  { src: "/images/visual-notes/05-mount-fuji.jpg", alt: "Mount Fuji rising above cloud layers", className: "visual-notes-photo--full" },
  { src: "/images/visual-notes/06-coast.jpg", alt: "Coastal view with a person and yellow foreground", className: "visual-notes-photo--full" },
  { src: "/images/visual-notes/07-field-fence.jpg", alt: "People seen through a sports field fence", className: "visual-notes-photo--full" },
  { src: "/images/visual-notes/08-butterfly-installation.jpg", alt: "White butterfly installation and projected light", className: "visual-notes-photo--contained" },
  { src: "/images/visual-notes/09-window-rose.jpg", alt: "Rose beside a window with reflections", className: "visual-notes-photo--contained" },
  { src: "/images/visual-notes/10-floor-light.jpg", alt: "Sunlight and window shadows across a wooden floor", className: "visual-notes-photo--contained" },
] as const;

export function VisualNotesProject({ project, next }: { project: Project; next: Project }) {
  return (
    <main
      className="visual-notes-page"
      style={{ "--project-accent": project.accentColor } as CSSProperties}
    >
      <Header />
      <div className="visual-notes-layout">
        <aside className="visual-notes-info">
          <p className="visual-notes-index">PROJECT [{project.index}]</p>
          <h1>{project.homeTitle}</h1>
          <div className="visual-notes-copy">
            <p>Photography / Visual Diary</p>
            <p>A visual diary of products, light, travel and everyday observation.</p>
            <p>{project.year}</p>
          </div>
        </aside>

        <section className="visual-notes-gallery" aria-label="Visual Notes photography series">
          {visualNotesImages.map((image) => (
            <img key={image.src} src={image.src} alt={image.alt} className={`visual-notes-photo ${image.className}`} />
          ))}
          <Link className="visual-notes-next" href="/projects/brand-planning">
            NEXT PROJECT · About <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
