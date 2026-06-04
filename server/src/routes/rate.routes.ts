import express from "express";
import { getAllRates } from "../controllers/rate.controller";

const router = express.Router();

router.get("/", getAllRates);

export default router