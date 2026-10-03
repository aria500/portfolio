type PlaceholderImageProps = {
  colors: [string, string, string];
  label: string;
  className?: string;
};

export function PlaceholderImage({ colors, label, className = "" }: PlaceholderImageProps) {
  return (
    <div
      className={`placeholder-image ${className}`}
      style={{ "--tone-a": colors[0], "--tone-b": colors[1], "--tone-c": colors[2] } as React.CSSProperties}
      role="img"
      aria-label={`${label} image placeholder`}
    >
      <i className="shape shape-a" />
      <i className="shape shape-b" />
      <span>[ IMAGE ]</span>
    </div>
  );
}
