UPDATE "SubscriptionPlan"
SET "active" = false
WHERE "slug" IN ('starter-plan', 'growth-plan', 'premium-plan', 'starter', 'growth', 'enterprise');

INSERT INTO "SubscriptionPlan" (
  "id",
  "name",
  "slug",
  "description",
  "price",
  "durationDays",
  "features",
  "popular",
  "active",
  "createdAt"
) VALUES
(
  'basic',
  'Basic Package',
  'basic',
  'Essential digital marketing support for a consistent online presence.',
  9999,
  30,
  ARRAY[
    '10 custom graphic posts',
    '4 engaging reels / shorts',
    'Festival post free',
    'Meta ads management',
    'Monthly content calendar',
    'Monthly performance report',
    'Basic profile optimization',
    'Community management',
    'Platforms: Facebook + Instagram'
  ],
  false,
  true,
  CURRENT_TIMESTAMP
),
(
  'standard',
  'Standard Package',
  'standard',
  'Growth-focused content, SEO visibility, branding, and campaign planning.',
  19999,
  30,
  ARRAY[
    '16 custom graphic posts',
    '8 engaging reels / shorts',
    'Festival post free',
    'Meta ads management',
    'Content calendar + strategy planning',
    'Monthly insight report',
    'Platforms: Facebook + Instagram + TikTok',
    'Content writing + SEO-friendly captions',
    'Local SEO setup (Google visibility basic)',
    'Website creation',
    'Branding support',
    'Cover & profile design'
  ],
  true,
  true,
  CURRENT_TIMESTAMP
),
(
  'premium',
  'Premium Package',
  'premium',
  'Advanced digital marketing with premium creative output and analytics.',
  29999,
  30,
  ARRAY[
    '22 premium graphic posts',
    '12 reels with high engagement + trend research',
    'Festival + campaign-based content',
    'Advanced Meta & Google ads management',
    'Full content strategy + calendar',
    'Detailed monthly analytics report',
    'Advanced content writing + basic SEO optimization',
    'Platforms: Facebook + Instagram + TikTok',
    'Content writing + SEO-friendly captions',
    'Website creation',
    'Branding support',
    'Cover & profile design'
  ],
  false,
  true,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "price" = EXCLUDED."price",
  "durationDays" = EXCLUDED."durationDays",
  "features" = EXCLUDED."features",
  "popular" = EXCLUDED."popular",
  "active" = true;
