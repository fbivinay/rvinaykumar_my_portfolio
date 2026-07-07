"use client";

import { motion, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Scroll-triggered cinematic reveal: rise + de-blur + slight scale-in.
 * Triggers as soon as the element clears the bottom 8% of the viewport,
 * so entrances are felt on short mobile screens too.
 */
export default function Reveal({
  children,
  delay = 0,
  x = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  /** Optional horizontal slide distance (e.g. -48 from left, 48 from right) */
  x?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  const variants: Variants = {
    hidden: { opacity: 0, y: x === 0 ? 48 : 24, x, scale: 0.97, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
    >
      {children}
    </motion.div>
  );
}
