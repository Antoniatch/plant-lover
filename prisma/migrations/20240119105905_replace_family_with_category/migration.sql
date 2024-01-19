/*
  Warnings:

  - You are about to drop the column `familyId` on the `UserPlant` table. All the data in the column will be lost.
  - Added the required column `category` to the `UserPlant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserPlant" DROP CONSTRAINT "UserPlant_familyId_fkey";

-- AlterTable
ALTER TABLE "UserPlant" DROP COLUMN "familyId",
ADD COLUMN     "category" "Category" NOT NULL;
