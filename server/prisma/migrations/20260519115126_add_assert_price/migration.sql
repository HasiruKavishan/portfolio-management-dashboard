/*
  Warnings:

  - Added the required column `currentPrice` to the `assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assets" ADD COLUMN     "currentPrice" DECIMAL(18,8) NOT NULL;
