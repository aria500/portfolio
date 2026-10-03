import Link from "next/link";
import { themeFor } from "@/data/projectNavigation";
import type { Project } from "@/data/projects";
import { PlaceholderImage } from "./PlaceholderImage";

export function ProjectPreview({ project }: { project: Project }) {
  return (
    <article className={`project-preview project-preview--${project.layout}`}>
      <Link href={themeFor(project.slug).href} className="project-image-link" aria-label={`View ${themeFor(project.slug).title}`}>
        <PlaceholderImage colors={project.palette} label={themeFor(project.slug).title} className="project-cover" />
      </Link>
      <div className="project-number">[{project.index}]</div>
      <h2><Link href={themeFor(project.slug).href}>{themeFor(project.slug).title}</Link></h2>
      <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div>
    </article>
  );
}
