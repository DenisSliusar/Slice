import { ReactNode } from "react";
import { cn } from "./ui/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "primary" | "secondary" | "tab";
}

export function GlassCard({ children, className, hover = false, variant = "primary" }: GlassCardProps) {
  const variantStyles = {
    primary: "backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/50 dark:border-gray-700/50",
    secondary: "backdrop-blur-lg bg-white/30 dark:bg-gray-900/30 border border-white/40 dark:border-gray-700/40",
    tab: "backdrop-blur-2xl bg-white/60 dark:bg-gray-900/60 border border-white/70 dark:border-gray-600/50 shadow-lg hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all duration-300"
  };

  return (
    <div 
      className={cn(
        "rounded-3xl shadow-xl",
        variantStyles[variant],
        hover && "transition-all duration-300 hover:bg-white/60 dark:hover:bg-gray-900/60 hover:shadow-2xl hover:scale-[1.02]",
        className
      )}
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      }}
    >
      {children}
    </div>
  );
}