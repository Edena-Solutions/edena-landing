import React from "react";
import { cn } from "@/lib/utils";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  legacyBehavior?: boolean;
  passHref?: boolean;
  variant?: "default" | "destructive" | "outline" | "subtle" | "ghost" | "link";
}

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className,
  legacyBehavior = false,
  passHref = false,
  variant = "default",
  ...props
}) => {
  const variantStyles = {
    default: "text-primary hover:underline focus:underline",
    destructive: "text-destructive hover:underline focus:underline",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    subtle: "text-muted-foreground hover:text-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  return legacyBehavior ? (
    <a href={href} className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </a>
  ) : (
    <a href={href} className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </a>
  );
};

Link.displayName = "Link";

export default Link;
