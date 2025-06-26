import { cn } from "@/lib/utils";
import Image from "next/image";

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn(className)}>
    <Image
      src="/logo.png"
      alt="DelApp Logo"
      width={80}
      height={80}
      priority
    />
  </div>
);
