import express from "express";
import { addInvestment, bulkCreateAssets, deleteAllAssets, getAllAssets, getAssetById, updateInvestment } from "../controllers/asset.controller";

const router = express.Router();

router.post("/", addInvestment);

router.put("/:investmentId", updateInvestment);

router.post("/bulk", bulkCreateAssets);

router.get("/", getAllAssets);

router.get("/:assetId", getAssetById);

router.delete("/", deleteAllAssets);

export default router;