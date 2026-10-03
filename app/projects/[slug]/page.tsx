import fs from "node:fs";
import path from "node:path";
import { notFound, redirect } from "next/navigation";
import { About } from "@/components/About";
import { VisualArchive } from "@/components/VisualArchive";
import { themeNavigation, themeFor } from "@/data/projectNavigation";

export function generateStaticParams() { return themeNavigation.map(({ slug }) => ({ slug })); }
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!themeNavigation.some(theme => theme.slug === slug)) notFound();
  if (slug === "content-channel") return <VisualArchive nextSlug="brand-planning" nextTitle="About"/>;
  if (slug === "brand-planning") return <About resumeAvailable={fs.existsSync(path.join(process.cwd(), "public/downloads/aria-zhang-resume.pdf"))}/>;
  redirect(themeFor(slug).href);
}
