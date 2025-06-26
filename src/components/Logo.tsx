import { cn } from "@/lib/utils";
import Image from "next/image";

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn("relative", className)}>
    <Image
      src="/logo.png"
      alt="DelApp Logo"
      layout="fill"
      objectFit="contain"
      priority
    />
  </div>
);
