import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  createAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/address", protectRoute, getAddress);
router.post("/address", protectRoute, createAddress);
router.put("/address/:id", protectRoute, updateAddress);
router.delete("/address/:id", protectRoute, deleteAddress);

export default router;
