"use client";

import { useMagnetic } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"a"> & {
  variant?: "solid" | "ghost";
};

/** Magnetic CTA — leans toward the cursor, Netflix red or glass ghost. */
export default function MagneticButton({
  variant = "solid",
  className,
  children,
  ...rest
}: Props) {
  const ref = useMagnetic<HTMLAnchorElement>(0.25);
  return (
    <a
      ref={ref}
      data-cursor="hover"
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-colors duration-300 will-change-transform",
        variant === "solid" &&
          "bg-accent text-white shadow-glow hover:bg-[#f6121d]",
        variant === "ghost" &&
          "border border-line bg-white/5 text-ink backdrop-blur-md hover:border-accent/60 hover:bg-white/10",
        className
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
