import express from "express";
import { protectUser } from "../middlewares/authMiddleware.js";

import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../controllers/cart/cartController.js";

const router = express.Router();

router.get("/", protectUser, getCart);
router.post("/add", protectUser, addToCart);
router.put("/update", protectUser, updateCartItem);
router.delete("/remove", protectUser, removeCartItem);
router.delete("/clear", protectUser, clearCart);

export default router;
