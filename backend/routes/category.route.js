import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  protectRoute,
  adminRoute,
  upload.array("images"),
  createCategory
);
router.get("/", protectRoute, adminRoute, getCategories);
router.get("/:id", protectRoute, adminRoute, getCategoryById);
router.put("/:id", protectRoute, adminRoute, updateCategory);
router.delete("/:id", protectRoute, adminRoute, deleteCategory);

export default router;
