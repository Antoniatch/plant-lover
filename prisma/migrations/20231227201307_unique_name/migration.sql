/*
  Warnings:

  - You are about to drop the column `plantId` on the `Mix` table. All the data in the column will be lost.
  - You are about to drop the column `trackingId` on the `UserPlant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the column `exposure` on the `Plant` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- DropForeignKey
ALTER TABLE "Mix" DROP CONSTRAINT "Mix_plantId_fkey";

-- AlterTable
ALTER TABLE "Mix" DROP COLUMN "plantId";

-- AlterTable
ALTER TABLE "UserPlant" DROP COLUMN "trackingId",
ADD COLUMN     "birthday" TEXT;

-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Observation" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "userPlantId" TEXT NOT NULL,

    CONSTRAINT "Observation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingSheet" (
    "id" TEXT NOT NULL,
    "watering" TEXT[],
    "repotting" TEXT[],
    "pruning" TEXT[],
    "userPlantId" TEXT NOT NULL,

    CONSTRAINT "TrackingSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Size" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "trackingSheetId" TEXT NOT NULL,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MixToPlant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackingSheet_userPlantId_key" ON "TrackingSheet"("userPlantId");

-- CreateIndex
CREATE UNIQUE INDEX "_MixToPlant_AB_unique" ON "_MixToPlant"("A", "B");

-- CreateIndex
CREATE INDEX "_MixToPlant_B_index" ON "_MixToPlant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlant" ADD CONSTRAINT "UserPlant_mixId_fkey" FOREIGN KEY ("mixId") REFERENCES "Mix"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_userPlantId_fkey" FOREIGN KEY ("userPlantId") REFERENCES "UserPlant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingSheet" ADD CONSTRAINT "TrackingSheet_userPlantId_fkey" FOREIGN KEY ("userPlantId") REFERENCES "UserPlant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Size" ADD CONSTRAINT "Size_trackingSheetId_fkey" FOREIGN KEY ("trackingSheetId") REFERENCES "TrackingSheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MixToPlant" ADD CONSTRAINT "_MixToPlant_A_fkey" FOREIGN KEY ("A") REFERENCES "Mix"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MixToPlant" ADD CONSTRAINT "_MixToPlant_B_fkey" FOREIGN KEY ("B") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
