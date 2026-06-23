"use client";

import Image from "next/image";
import logoImage from "../../public/logo.png";

interface BrandLogoProps {
  className?: string;
  width?: number;
  alt?: string;
}

export default function BrandLogo({
  className = "",
  width = 48,
  alt = "Nava Lumiq Tech logo",
}: BrandLogoProps) {
  // Automatically calculate height to match the original 140x42 (10:3) aspect ratio,
  // preventing Next.js console warnings about aspect ratio mismatch.
  const calculatedHeight = Math.round(width * (42 / 140));

  return (
    <div className={className}>
      <Image
        src={logoImage}
        alt={alt}
        width={width}
        height={calculatedHeight}
        style={{ height: "auto" }}
        className="object-contain filter brightness-125 contrast-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]"
        priority
        quality={100}
      />
    </div>
  );
}
