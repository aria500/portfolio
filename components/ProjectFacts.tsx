export function ProjectFacts({ type, time, role, live = false }: { type: string; time: string; role: string; live?: boolean }) {
  return <div className="project-facts">
    <dl><div><dt>PROJECT TYPE</dt><dd>{type}</dd></div><div><dt>TIME</dt><dd>{time}</dd></div><div><dt>ROLE</dt><dd>{role}</dd></div></dl>
    {live && <a href="https://aria500.github.io/waterflower/?v=14days-final" target="_blank" rel="noopener noreferrer">在线体验 ↗ <small>Live Product</small></a>}
  </div>;
}
