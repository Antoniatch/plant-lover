-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "observationId" TEXT;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "Observation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
