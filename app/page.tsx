import { PortfolioHome } from "@/components/PortfolioHome";
import { themeNavigation } from "@/data/projectNavigation";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <PortfolioHome projects={themeNavigation.map(theme => projects.find(project => project.slug === theme.slug)!)} />
  );
}
