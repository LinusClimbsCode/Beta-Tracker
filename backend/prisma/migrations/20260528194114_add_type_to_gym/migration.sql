/*
  Warnings:

  - Added the required column `type` to the `Gym` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GymType" AS ENUM ('bouldering', 'climbing', 'mixed');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'gym_admin';
ALTER TYPE "Role" ADD VALUE 'gym_setter';
ALTER TYPE "Role" ADD VALUE 'gym_moderator';
ALTER TYPE "Role" ADD VALUE 'community_moderator';

-- AlterTable
ALTER TABLE "Gym" ADD COLUMN     "type" "GymType" NOT NULL;

-- AlterTable
ALTER TABLE "UserGymStanding" ALTER COLUMN "trustPoints" SET DEFAULT 0;
