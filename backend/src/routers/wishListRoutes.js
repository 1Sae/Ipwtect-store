import express from "express";
import {protectUser} from "../middlewares/authMiddleware.js";
import {
    addToWishlist,
    removeFromWishlist,
    getAllWishlist,
} from "../controllers/product/wishListController.js";

const router = express.Router();

router.get("/", protectUser, getAllWishlist);
router.post("/add/:productId", protectUser, addToWishlist);
router.delete("/remove/:productId", protectUser, removeFromWishlist);

export default router;
