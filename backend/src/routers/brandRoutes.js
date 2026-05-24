import express from "express";
import {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
} from "../controllers/product/brandController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import uploadBrand from "../middlewares/uploads/uploadBrand.js";

const router = express.Router();

router.post("/", protectAdmin, uploadBrand.single("image"), createBrand);
router.get("/", getAllBrands);
router.get("/:id", getBrandById);
router.put("/:id", protectAdmin, uploadBrand.single("image"), updateBrand);
router.delete("/:id", protectAdmin, deleteBrand);

export default router;
