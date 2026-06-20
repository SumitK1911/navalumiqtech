ALTER TABLE "CaseStudy" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "CaseStudy" ADD COLUMN IF NOT EXISTS "challenge" TEXT;
ALTER TABLE "CaseStudy" ADD COLUMN IF NOT EXISTS "solution" TEXT;
ALTER TABLE "CaseStudy" ADD COLUMN IF NOT EXISTS "technologies" TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "packageId" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "durationDays" INTEGER;

CREATE TABLE IF NOT EXISTS "SectionItem" (
  "id" TEXT NOT NULL,
  "section" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "description" TEXT,
  "image" TEXT,
  "metadata" JSONB,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SectionItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SectionItem_section_active_sortOrder_idx"
  ON "SectionItem"("section", "active", "sortOrder");

CREATE TABLE IF NOT EXISTS "Vacancy" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "salary" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "requirements" TEXT[],
  "responsibilities" TEXT[],
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Vacancy_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Vacancy_slug_key" ON "Vacancy"("slug");

CREATE TABLE IF NOT EXISTS "Application" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "position" TEXT NOT NULL,
  "coverLetter" TEXT NOT NULL,
  "resumeUrl" TEXT,
  "status" TEXT NOT NULL DEFAULT 'new',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);
