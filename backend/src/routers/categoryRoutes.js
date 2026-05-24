import express from "express";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import {createCategory, getCategoryById, getAllCategories, deleteCategory, updateCategory} from "../controllers/product/categroyController.js";
import uploadCategory from "../middlewares/uploads/uploadCategory.js";


const router = express.Router();
router.post("/", protectAdmin, uploadCategory.single("image"), createCategory);


router.post("/", protectAdmin, uploadCategory.single("image"), createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.put("/:id", protectAdmin, uploadCategory.single("image"), updateCategory);
router.delete('/:id', protectAdmin, deleteCategory);

export default router;