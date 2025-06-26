import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={cn("fill-primary", className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      fill="url(#grad1)"
      d="M50,5c24.8,0,45,20.2,45,45s-20.2,45-45,45S5,74.8,5,50S25.2,5,50,5z M69.9,32.3l-24.1,36.2l-15.6-15.6l5.8-5.8l9.8,9.8 l18.3-27.4L69.9,32.3z"
    />
  </svg>
);
