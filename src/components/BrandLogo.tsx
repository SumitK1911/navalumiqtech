"use client";

import Image from "next/image";
import logoImage from "../../public/logo.png";

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export default function BrandLogo({
  className = "",
  width = 48,
  height = 48,
  alt = "Nava Lumiq Tech logo",
}: BrandLogoProps) {
  return (
    <div className={className}>
      <Image
        src={logoImage}
        alt={alt}
        width={width}
        height={height}
        className="object-contain filter brightness-125 contrast-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]"
        priority
        quality={100}
      />
    </div>
  );
}
