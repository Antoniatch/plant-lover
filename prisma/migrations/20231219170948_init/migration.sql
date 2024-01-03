-- CreateEnum
CREATE TYPE "Exposure" AS ENUM ('DIRECT', 'INDIRECT', 'MI', 'OMBRE');

-- CreateEnum
CREATE TYPE "Substrate" AS ENUM ('TERREAU', 'TERRE', 'PERLITE', 'CAILLOUX');

-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('OUTDOOR', 'INDOOR');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FLEUR', 'BONSAI', 'BUISSON', 'ARBRE', 'SUCCULENTE', 'CACTUS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mix" (
    "id" TEXT NOT NULL,
    "substrates" "Substrate"[],
    "plantId" TEXT NOT NULL,

    CONSTRAINT "Mix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plant" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "watering" DOUBLE PRECISION NOT NULL,
    "exposure" "Exposure"[],
    "repotting" DOUBLE PRECISION NOT NULL,
    "minTemperature" DOUBLE PRECISION NOT NULL,
    "maxTemperature" DOUBLE PRECISION NOT NULL,
    "environment" "Environment" NOT NULL,
    "familyId" TEXT NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPlant" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "image" TEXT,
    "nickname" TEXT,
    "watering" DOUBLE PRECISION,
    "exposure" "Exposure",
    "mixId" TEXT,
    "repotting" DOUBLE PRECISION,
    "environment" "Environment",

    CONSTRAINT "UserPlant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mix" ADD CONSTRAINT "Mix_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlant" ADD CONSTRAINT "UserPlant_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlant" ADD CONSTRAINT "UserPlant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
