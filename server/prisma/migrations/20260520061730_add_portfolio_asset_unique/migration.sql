/*
  Warnings:

  - A unique constraint covering the columns `[portfolio_id,asset_id]` on the table `portfolio_assets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "portfolio_assets_portfolio_id_asset_id_key" ON "portfolio_assets"("portfolio_id", "asset_id");
