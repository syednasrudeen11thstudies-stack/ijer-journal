-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "ManuscriptStatus" AS ENUM ('RECEIVED', 'UNDER_REVIEW', 'REVISION_REQUIRED', 'ACCEPTED', 'REJECTED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EditorialMemberStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "EditorialDesignation" AS ENUM ('PATRON', 'HONORARY_PATRON', 'CHAIRPERSON_EDITORIAL_COUNCIL', 'EDITOR_IN_CHIEF', 'EXECUTIVE_EDITOR', 'MANAGING_EDITOR', 'DEPUTY_EDITOR', 'ASSOCIATE_EDITOR', 'ASSISTANT_EDITOR', 'SECTION_EDITOR', 'STATISTICAL_EDITOR', 'RESEARCH_METHODOLOGY_EDITOR', 'EDITORIAL_BOARD_MEMBER', 'INTERNATIONAL_EDITORIAL_BOARD_MEMBER', 'SCIENTIFIC_ADVISORY_BOARD_MEMBER', 'ACADEMIC_ADVISORY_BOARD_MEMBER', 'REVIEWER');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manuscript" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "articleType" TEXT NOT NULL,
    "subjectArea" TEXT NOT NULL,
    "abstractText" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "correspondingAuthor" TEXT NOT NULL,
    "qualification" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "department" TEXT,
    "institution" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "orcid" TEXT,
    "coAuthors" TEXT,
    "manuscriptFileUrl" TEXT,
    "supportingFileUrl" TEXT,
    "coverLetterUrl" TEXT,
    "originalWorkConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "notSubmittedElsewhere" BOOLEAN NOT NULL DEFAULT false,
    "authorsApproved" BOOLEAN NOT NULL DEFAULT false,
    "conflictsDeclared" BOOLEAN NOT NULL DEFAULT false,
    "ethicsConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "journalPoliciesConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "status" "ManuscriptStatus" NOT NULL DEFAULT 'RECEIVED',
    "adminNotes" TEXT,
    "reviewNotes" TEXT,
    "revisionNotes" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manuscript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "volumeNumber" INTEGER NOT NULL,
    "issueNumber" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "publicationDate" TIMESTAMP(3),
    "coverImageUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "articleType" TEXT NOT NULL,
    "subjectArea" TEXT,
    "authors" TEXT NOT NULL,
    "affiliations" TEXT,
    "correspondingAuthor" TEXT,
    "correspondenceEmail" TEXT,
    "abstractText" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "introduction" TEXT,
    "methods" TEXT,
    "results" TEXT,
    "discussion" TEXT,
    "conclusion" TEXT,
    "acknowledgements" TEXT,
    "conflictOfInterest" TEXT,
    "fundingStatement" TEXT,
    "ethicsStatement" TEXT,
    "referencesText" TEXT,
    "doi" TEXT,
    "issn" TEXT,
    "startPage" TEXT,
    "endPage" TEXT,
    "receivedDate" TIMESTAMP(3),
    "acceptedDate" TIMESTAMP(3),
    "publishedDate" TIMESTAMP(3),
    "pdfUrl" TEXT,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "manuscriptId" TEXT,
    "issueId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditorialMember" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "qualifications" TEXT,
    "editorialDesignation" "EditorialDesignation" NOT NULL,
    "specialty" TEXT,
    "professionalDesignation" TEXT,
    "department" TEXT,
    "institution" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "email" TEXT,
    "orcidUrl" TEXT,
    "googleScholarUrl" TEXT,
    "researchGateUrl" TEXT,
    "biography" TEXT,
    "researchInterests" TEXT,
    "photoUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "EditorialMemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "showOnWebsite" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EditorialMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalSettings" (
    "id" TEXT NOT NULL,
    "journalName" TEXT NOT NULL DEFAULT 'International Journal of Electro-Homoeopathy & Research',
    "abbreviation" TEXT NOT NULL DEFAULT 'IJER',
    "issnPrint" TEXT,
    "issnOnline" TEXT,
    "publisherName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "websiteUrl" TEXT,
    "publicationFrequency" TEXT,
    "aimsAndScope" TEXT,
    "copyrightText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Manuscript_referenceNumber_key" ON "Manuscript"("referenceNumber");

-- CreateIndex
CREATE INDEX "Manuscript_status_idx" ON "Manuscript"("status");

-- CreateIndex
CREATE INDEX "Manuscript_submittedAt_idx" ON "Manuscript"("submittedAt");

-- CreateIndex
CREATE INDEX "Manuscript_email_idx" ON "Manuscript"("email");

-- CreateIndex
CREATE INDEX "Issue_published_idx" ON "Issue"("published");

-- CreateIndex
CREATE INDEX "Issue_current_idx" ON "Issue"("current");

-- CreateIndex
CREATE UNIQUE INDEX "Issue_volumeNumber_issueNumber_year_key" ON "Issue"("volumeNumber", "issueNumber", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_doi_key" ON "Article"("doi");

-- CreateIndex
CREATE UNIQUE INDEX "Article_manuscriptId_key" ON "Article"("manuscriptId");

-- CreateIndex
CREATE INDEX "Article_status_idx" ON "Article"("status");

-- CreateIndex
CREATE INDEX "Article_issueId_idx" ON "Article"("issueId");

-- CreateIndex
CREATE INDEX "Article_publishedDate_idx" ON "Article"("publishedDate");

-- CreateIndex
CREATE INDEX "EditorialMember_editorialDesignation_idx" ON "EditorialMember"("editorialDesignation");

-- CreateIndex
CREATE INDEX "EditorialMember_displayOrder_idx" ON "EditorialMember"("displayOrder");

-- CreateIndex
CREATE INDEX "EditorialMember_status_idx" ON "EditorialMember"("status");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_manuscriptId_fkey" FOREIGN KEY ("manuscriptId") REFERENCES "Manuscript"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
