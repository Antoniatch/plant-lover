/*
  Warnings:

  - Added the required column `familyId` to the `UserPlant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserPlant" DROP CONSTRAINT "UserPlant_plantId_fkey";

-- AlterTable
ALTER TABLE "UserPlant" ADD COLUMN     "familyId" TEXT NOT NULL,
ALTER COLUMN "plantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserPlant" ADD CONSTRAINT "UserPlant_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlant" ADD CONSTRAINT "UserPlant_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
