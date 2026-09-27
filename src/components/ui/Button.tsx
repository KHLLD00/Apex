import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export function Button({ variant = "primary", size = "md", className, children, asChild, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  const variants = {
    primary: "bg-electric-500 text-white hover:bg-electric-600 shadow-soft",
    secondary: "bg-navy-900 text-white hover:bg-navy-800",
    ghost: "bg-transparent text-navy-900 hover:bg-navy-900/5",
    outline: "border border-navy-900/15 text-navy-900 hover:border-navy-900/30 hover:bg-navy-900/5",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };
  const classes = cn(base, variants[variant], sizes[size], className);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: cn(classes, (children as React.ReactElement<any>).props.className),
      onClick: (e: React.MouseEvent) => {
        (children as React.ReactElement<any>).props.onClick?.(e);
        (props as any).onClick?.(e);
      },
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
