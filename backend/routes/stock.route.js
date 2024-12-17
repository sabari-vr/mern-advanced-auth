import express from "express";

import { auth } from "../middleware/auth.js";
import {
  buyStock,
  currentStockPriceBySymbol,
  exitTrade,
  getAllStockPrice,
  getCompletedStocks,
  getHoldingStocks,
  getLatestBalance,
} from "../controllers/stock.controller.js";

const router = express.Router();

router.get("/stock-price", auth, currentStockPriceBySymbol);
router.get("/balance", auth, getLatestBalance);
router.get("/all-stock-price", auth, getAllStockPrice);
router.post("/buy", auth, buyStock);
router.get("/my-holding", auth, getHoldingStocks);
router.get("/my-complete", auth, getCompletedStocks);
router.post("/exit-trade", auth, exitTrade);

export default router;
