"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GridBackground from "@/components/effects/GridBackground";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

const publicChromeRoutes = ["/", "/blog", "/portfolio", "/careers", "/vacancies"];

function usesPublicChrome(pathname: string) {
  return publicChromeRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );
}

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showPublicChrome = usesPublicChrome(pathname);

  if (!showPublicChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <GridBackground />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
