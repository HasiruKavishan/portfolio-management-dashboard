import express from "express";
import { addInvestment, updateInvestment } from "../controllers/asset.controller";

const router = express.Router();

router.post("/", addInvestment);

router.put("/:investmentId", updateInvestment);

export default router;