/*
  Warnings:

  - The values [moderator] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `setter` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `trustPoints` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `validationPower` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ModeratorGym` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SetterConfirmation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `validationPowerUsed` to the `BoulderValidation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('user', 'admin');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';
COMMIT;

-- DropForeignKey
ALTER TABLE "ModeratorGym" DROP CONSTRAINT "ModeratorGym_gymId_fkey";

-- DropForeignKey
ALTER TABLE "ModeratorGym" DROP CONSTRAINT "ModeratorGym_moderatorId_fkey";

-- DropForeignKey
ALTER TABLE "SetterConfirmation" DROP CONSTRAINT "SetterConfirmation_boulderId_fkey";

-- DropForeignKey
ALTER TABLE "SetterConfirmation" DROP CONSTRAINT "SetterConfirmation_userId_fkey";

-- AlterTable
ALTER TABLE "BoulderValidation" ADD COLUMN     "rejectReason" TEXT,
ADD COLUMN     "validationPowerUsed" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Gym" ADD COLUMN     "adminUserId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "setter",
DROP COLUMN "trustPoints",
DROP COLUMN "validationPower",
ADD COLUMN     "quarantinedUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserArchive" ADD COLUMN     "gymId" TEXT;

-- DropTable
DROP TABLE "ModeratorGym";

-- DropTable
DROP TABLE "SetterConfirmation";

-- CreateTable
CREATE TABLE "UserGymStanding" (
    "userId" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "trustPoints" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "UserGymRole" (
    "userId" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastActivityAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "SetterPromotion" (
    "id" TEXT NOT NULL,

    CONSTRAINT "SetterPromotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetterPromotionVote" (
    "id" TEXT NOT NULL,

    CONSTRAINT "SetterPromotionVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGymStanding_userId_gymId_key" ON "UserGymStanding"("userId", "gymId");

-- CreateIndex
CREATE UNIQUE INDEX "UserGymRole_userId_gymId_role_key" ON "UserGymRole"("userId", "gymId", "role");

-- AddForeignKey
ALTER TABLE "UserGymStanding" ADD CONSTRAINT "UserGymStanding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGymStanding" ADD CONSTRAINT "UserGymStanding_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGymRole" ADD CONSTRAINT "UserGymRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGymRole" ADD CONSTRAINT "UserGymRole_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
