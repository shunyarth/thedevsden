type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  /** "up" fades up (default); "zoom" grows in from slightly smaller. */
  variant?: "up" | "zoom";
  className?: string;
};

// Fades content in when it scrolls into view. The animation itself is pure CSS
// (see [data-reveal] in globals.css) and one shared observer triggers it, so it costs almost nothing.
export function Reveal({ children, delay = 0, y = 32, variant = "up", className }: RevealProps) {
  return (
    <div
      data-reveal={variant === "up" ? "" : variant}
      className={className}
      style={{ "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
