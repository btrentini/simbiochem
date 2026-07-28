import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

/**
 * Scroll reveal.
 *
 * This was a motion.div with initial={{ opacity: 0, y }}. Motion serialises
 * `initial` into the server-rendered markup, so all 26 revealed blocks shipped
 * as style="opacity:0" and stayed invisible until the client bundle had
 * downloaded, parsed and hydrated — the page looked broken until then, and the
 * slower the connection the longer it lasted.
 *
 * Content now renders visible and the animation is progressive enhancement:
 * browsers with scroll-driven timelines animate it, the rest simply show the
 * content. Nothing here depends on JavaScript, and it is a server component,
 * so neither Reveal nor Motion reaches the client bundle for these pages.
 */
export function Reveal({ children, delay = 0, y = 18, className }: RevealProps) {
  return (
    <div
      className={cn("reveal", className)}
      style={
        {
          "--reveal-y": `${y}px`,
          "--reveal-delay": delay,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
