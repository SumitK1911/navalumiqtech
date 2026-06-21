import type { Metadata } from "next";

import AuthProvider from "@/providers/SessionProvider";
import AppShell from "@/components/layout/AppShell";
import SplashScreen from "@/components/layout/SplashScreen";
import GSAPProvider from "@/components/animations/GSAPProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Nava Lumiq Tech | Engineering Digital Excellence",

  description:
    "Nava Lumiq Tech builds premium websites, AI solutions, mobile apps, POS systems, and futuristic digital experiences.",

  keywords: [
    "Nava Lumiq Tech",
    "Web Development",
    "AI Solutions",
    "Mobile App Development",
    "POS Systems",
    "UI UX Design",
    "Tech Company",
    "Software Company",
    "Next.js",
    "Flutter",
  ],

  authors: [
    {
      name: "Nava Lumiq Tech",
    },
  ],

  creator: "Nava Lumiq Tech",

  openGraph: {
    title: "Nava Lumiq Tech",

    description:
      "Engineering Digital Excellence through innovation, creativity, and futuristic technology.",

    url: "https://navalumiqtech.com",

    siteName: "Nava Lumiq Tech",

    locale: "en_US",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Nava Lumiq Tech",

    description:
      "Premium digital solutions, AI systems, mobile apps, and futuristic technology experiences.",
  },

  alternates: {
    canonical: "https://navalumiqtech.com",
  },

  metadataBase: new URL("https://navalumiqtech.com"),
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nava Lumiq Tech",
  url: "https://navalumiqtech.com",
  logo: "https://navalumiqtech.com/favicon.ico",
  description:
    "Nava Lumiq Tech builds premium websites, AI solutions, mobile apps, POS systems, and futuristic digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AuthProvider>
          <SplashScreen />
          <GSAPProvider>
            <AppShell>{children}</AppShell>
          </GSAPProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
