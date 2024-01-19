/*
  Warnings:

  - The `date` column on the `Observation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date` column on the `Size` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `watering` column on the `TrackingSheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `repotting` column on the `TrackingSheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `pruning` column on the `TrackingSheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `birthday` column on the `UserPlant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `helpCenter` to the `Observation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public` to the `Observation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Observation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TrackingSheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Observation" ADD COLUMN     "helpCenter" BOOLEAN NOT NULL,
ADD COLUMN     "public" BOOLEAN NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Size" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TrackingSheet" ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "watering",
ADD COLUMN     "watering" TIMESTAMP(3)[],
DROP COLUMN "repotting",
ADD COLUMN     "repotting" TIMESTAMP(3)[],
DROP COLUMN "pruning",
ADD COLUMN     "pruning" TIMESTAMP(3)[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthday" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserPlant" DROP COLUMN "birthday",
ADD COLUMN     "birthday" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "observationId" TEXT,
    "userPlantId" TEXT,
    "plantId" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingSheet" ADD CONSTRAINT "TrackingSheet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "Observation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userPlantId_fkey" FOREIGN KEY ("userPlantId") REFERENCES "UserPlant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
