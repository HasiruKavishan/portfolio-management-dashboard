/*
  Warnings:

  - Added the required column `pricePerShare` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "pricePerShare" DECIMAL(18,8) NOT NULL;
