/*
  Warnings:

  - Added the required column `public` to the `TrackingSheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrackingSheet" ADD COLUMN     "public" BOOLEAN NOT NULL;
