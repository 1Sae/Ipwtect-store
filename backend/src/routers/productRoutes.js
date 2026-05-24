import express from "express";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByCategoryName,
    getProductsByBrandName,
    filterProductsBySpecs,
    getProductsByStatus,
    getLowStockProducts,
    getOutOfStockProducts,
    getTopSellingProducts,
    getTopSellingProductsUser,
    getNewestProducts,
    getDiscountedProducts,
    getCategorySpecifications,
    getProducts,
    getSpecsForShopPage,
    searchForProduct
} from "../controllers/product/productController.js";
import uploadProduct from "../middlewares/uploads/uploadProduct.js";
import { handleResponse } from "../middlewares/handleResponse.js";
import { randomUUID } from "crypto";

const router = express.Router();

// upload
router.post(
    "/upload",
    protectAdmin,
    uploadProduct.array("images", 10),
    (req, res) => {
        if (!req.files || req.files.length === 0) {
            return handleResponse(res, 400, false, "No files uploaded");
        }
        const fileUrls = req.files.map((f) => `uploads/products/${f.filename}`);
        return handleResponse(res, 200, true, "Files uploaded successfully", { fileUrls });
        });

    

// 🔥 FILTER ROUTES – MUST COME BEFORE "/:id"
router.get("/category/:categoryName", getProductsByCategoryName);
router.get("/brand/:brandName", getProductsByBrandName);
router.get("/filter", filterProductsBySpecs);
router.get("/status/:status", getProductsByStatus);
router.get("/stock/low", getLowStockProducts);
router.get("/stock/out", getOutOfStockProducts);
router.get("/top-selling-user", getTopSellingProductsUser);
router.get("/newest", getNewestProducts);
router.get("/discounted", getDiscountedProducts);
router.get("/specifications", getCategorySpecifications);
router.get("/filter", getProducts);
router.get("/shop-specs", getSpecsForShopPage);
router.get("/search", searchForProduct);

// CRUD
router.post("/", protectAdmin, createProduct);
router.get("/admin/top-selling", protectAdmin, getTopSellingProducts);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", protectAdmin, updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

export default router;
