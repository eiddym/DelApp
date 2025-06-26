import Image from "next/image";

export const Logo = ({ className }: { className?: string }) => (
  <Image
    src="/logo.png"
    alt="DelApp Logo"
    width={80}
    height={80}
    priority
  />
);
