/*
  Warnings:

  - You are about to drop the column `slug` on the `Board` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Board_slug_key";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "slug";
