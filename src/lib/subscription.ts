export const subscriptionPackages = [
  {
    id: "basic",
    name: "Basic Package",
    price: 9999,
    durationDays: 30,
    description: "Essential digital marketing support for a consistent online presence.",
    features: [
      "10 custom graphic posts",
      "4 engaging reels / shorts",
      "Festival post free",
      "Meta ads management",
      "Monthly content calendar",
      "Monthly performance report",
      "Basic profile optimization",
      "Community management",
      "Platforms: Facebook + Instagram",
    ],
    popular: false,
  },
  {
    id: "standard",
    name: "Standard Package",
    price: 19999,
    durationDays: 30,
    description: "Growth-focused content, SEO visibility, branding, and campaign planning.",
    features: [
      "16 custom graphic posts",
      "8 engaging reels / shorts",
      "Festival post free",
      "Meta ads management",
      "Content calendar + strategy planning",
      "Monthly insight report",
      "Platforms: Facebook + Instagram + TikTok",
      "Content writing + SEO-friendly captions",
      "Local SEO setup (Google visibility basic)",
      "Website creation",
      "Branding support",
      "Cover & profile design",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium Package",
    price: 29999,
    durationDays: 30,
    description: "Advanced digital marketing with premium creative output and analytics.",
    features: [
      "22 premium graphic posts",
      "12 reels with high engagement + trend research",
      "Festival + campaign-based content",
      "Advanced Meta & Google ads management",
      "Full content strategy + calendar",
      "Detailed monthly analytics report",
      "Advanced content writing + basic SEO optimization",
      "Platforms: Facebook + Instagram + TikTok",
      "Content writing + SEO-friendly captions",
      "Website creation",
      "Branding support",
      "Cover & profile design",
    ],
    popular: false,
  },
] as const;

export const subscriptionAddOns = [
  {
    name: "Voiceover / Video editing",
    price: 2000,
  },
  {
    name: "Extra custom post",
    price: 500,
  },
  {
    name: "AI video",
    price: 2500,
  },
  {
    name: "Videoshoot (1 hour)",
    price: 2000,
  },
] as const;

export type SubscriptionPackageId = (typeof subscriptionPackages)[number]["id"];

export function getSubscriptionPackage(packageId: string) {
  return subscriptionPackages.find((item) => item.id === packageId);
}

export function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function getRemainingSubscriptionTime(subscriptionEnd?: Date | null) {
  if (!subscriptionEnd) {
    return {
      days: 0,
      hours: 0,
      expired: true,
    };
  }

  const remainingMs = subscriptionEnd.getTime() - Date.now();

  if (remainingMs <= 0) {
    return {
      days: 0,
      hours: 0,
      expired: true,
    };
  }

  return {
    days: Math.floor(remainingMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((remainingMs / (1000 * 60 * 60)) % 24),
    expired: false,
  };
}

export function formatSubscriptionDate(date?: Date | null) {
  if (!date) {
    return "Not started";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
