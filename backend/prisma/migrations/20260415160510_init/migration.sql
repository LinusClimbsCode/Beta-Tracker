-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'moderator', 'admin');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('newbie', 'regular', 'hallenOG');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('de', 'en');

-- CreateEnum
CREATE TYPE "GradeSystemType" AS ENUM ('numeric', 'french', 'american', 'colorBased');

-- CreateEnum
CREATE TYPE "WallType" AS ENUM ('overhang', 'slab', 'vertical', 'roof');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('competition', 'communityEvent', 'communityNight', 'party');

-- CreateEnum
CREATE TYPE "ValidationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('project', 'flash', 'top');

-- CreateEnum
CREATE TYPE "GradeRating" AS ENUM ('easy', 'appropriate', 'hard');

-- CreateEnum
CREATE TYPE "QualityRating" AS ENUM ('liked', 'neutral', 'disliked');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('boulderUploaded', 'boulderValidated', 'boulderClimbed', 'boulderRated');

-- CreateEnum
CREATE TYPE "RelatedEntityType" AS ENUM ('boulder', 'rating', 'validation', 'userBoulder');

-- CreateEnum
CREATE TYPE "Validation" AS ENUM ('approve', 'reject');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT,
    "bio" TEXT,
    "profilePicture" TEXT,
    "city" TEXT NOT NULL,
    "favoriteGymId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'user',
    "setter" BOOLEAN NOT NULL DEFAULT false,
    "experiencePoints" INTEGER NOT NULL DEFAULT 0,
    "level" "Level" NOT NULL DEFAULT 'newbie',
    "trustPoints" INTEGER NOT NULL DEFAULT 0,
    "validationPower" INTEGER NOT NULL DEFAULT 0,
    "preferredLanguage" "Language" NOT NULL DEFAULT 'en',
    "darkModeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "profileVisibility" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModeratorGym" (
    "id" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModeratorGym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gym" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "city" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "openingHours" JSONB NOT NULL,
    "description" TEXT NOT NULL,
    "priceInfo" JSONB NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "gradeSystemType" "GradeSystemType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wall" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "wallType" "WallType"[],
    "isActive" BOOLEAN NOT NULL,
    "lastReset" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hexCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "eventType" "EventType"[],
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "registrationLink" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boulder" (
    "id" TEXT NOT NULL,
    "wallId" TEXT NOT NULL,
    "name" TEXT,
    "setGradeId" TEXT NOT NULL,
    "communityGrade" "GradeRating" NOT NULL,
    "communityFeedback" "QualityRating" NOT NULL,
    "verifiedSetterId" TEXT,
    "unverifiedSetterName" TEXT,
    "uploadedById" TEXT NOT NULL,
    "status" "ValidationStatus" NOT NULL,
    "imageUrl" TEXT,
    "requiredValidationPoints" INTEGER NOT NULL,
    "currentValidationPoints" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boulder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoulderValidation" (
    "id" TEXT NOT NULL,
    "boulderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "validation" "Validation" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoulderValidation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetterConfirmation" (
    "id" TEXT NOT NULL,
    "boulderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SetterConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBoulder" (
    "id" TEXT NOT NULL,
    "boulderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "attempts" INTEGER NOT NULL,
    "firstAttemptAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "xpAwarded" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBoulder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "boulderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gradeRating" "GradeRating" NOT NULL,
    "qualityRating" "QualityRating" NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserArchive" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "xpGained" INTEGER NOT NULL,
    "relatedEntityType" "RelatedEntityType" NOT NULL,
    "relatedEntityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserArchive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BoulderToColor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BoulderToColor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ModeratorGym_moderatorId_gymId_key" ON "ModeratorGym"("moderatorId", "gymId");

-- CreateIndex
CREATE UNIQUE INDEX "Gym_name_city_email_key" ON "Gym"("name", "city", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_gymId_value_key" ON "Grade"("gymId", "value");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_gymId_displayOrder_key" ON "Grade"("gymId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "BoulderValidation_boulderId_userId_key" ON "BoulderValidation"("boulderId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "SetterConfirmation_boulderId_userId_key" ON "SetterConfirmation"("boulderId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBoulder_boulderId_userId_key" ON "UserBoulder"("boulderId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_boulderId_userId_key" ON "Rating"("boulderId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_key" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "_BoulderToColor_B_index" ON "_BoulderToColor"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_favoriteGymId_fkey" FOREIGN KEY ("favoriteGymId") REFERENCES "Gym"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeratorGym" ADD CONSTRAINT "ModeratorGym_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeratorGym" ADD CONSTRAINT "ModeratorGym_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wall" ADD CONSTRAINT "Wall_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boulder" ADD CONSTRAINT "Boulder_wallId_fkey" FOREIGN KEY ("wallId") REFERENCES "Wall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boulder" ADD CONSTRAINT "Boulder_setGradeId_fkey" FOREIGN KEY ("setGradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boulder" ADD CONSTRAINT "Boulder_verifiedSetterId_fkey" FOREIGN KEY ("verifiedSetterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boulder" ADD CONSTRAINT "Boulder_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoulderValidation" ADD CONSTRAINT "BoulderValidation_boulderId_fkey" FOREIGN KEY ("boulderId") REFERENCES "Boulder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoulderValidation" ADD CONSTRAINT "BoulderValidation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetterConfirmation" ADD CONSTRAINT "SetterConfirmation_boulderId_fkey" FOREIGN KEY ("boulderId") REFERENCES "Boulder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetterConfirmation" ADD CONSTRAINT "SetterConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBoulder" ADD CONSTRAINT "UserBoulder_boulderId_fkey" FOREIGN KEY ("boulderId") REFERENCES "Boulder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBoulder" ADD CONSTRAINT "UserBoulder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_boulderId_fkey" FOREIGN KEY ("boulderId") REFERENCES "Boulder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserArchive" ADD CONSTRAINT "UserArchive_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoulderToColor" ADD CONSTRAINT "_BoulderToColor_A_fkey" FOREIGN KEY ("A") REFERENCES "Boulder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoulderToColor" ADD CONSTRAINT "_BoulderToColor_B_fkey" FOREIGN KEY ("B") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;
