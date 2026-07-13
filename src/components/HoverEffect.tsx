import { cn } from "../lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";

export const HoverEffect = ({
  items,
  className,
  children,
}: {
  items: {
    title: string;
    description?: string;
    link?: string;
    [key: string]: any;
  }[];
  className?: string;
  children?: (item: any) => React.ReactNode;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.title || idx}
          className="relative group block p-1.5 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gradient-to-br from-[var(--theme-accent-color)]/[0.08] via-[var(--theme-accent-color)]/[0.02] to-transparent border border-[var(--theme-accent-color)]/[0.18] block rounded-2xl z-0 shadow-[0_0_25px_rgba(var(--theme-color-rgb),0.06)]"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.1 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            {children ? (
              children(item)
            ) : (
              <div className="p-4 flex flex-col justify-between h-full">
                <div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
              </div>
            )}
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full overflow-hidden bg-slate-900/20 group-hover:bg-slate-950/75 border border-white/[0.04] group-hover:border-[var(--theme-accent-color)]/45 relative z-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.65)] group-hover:shadow-[var(--theme-accent-color)]/[0.08] transform-gpu",
        className
      )}
    >
      <div className="relative z-20 h-full flex flex-col flex-grow">
        {children}
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-2", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-4 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
