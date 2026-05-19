/*
  Warnings:

  - Added the required column `name` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assets" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "symbol" TEXT NOT NULL;
