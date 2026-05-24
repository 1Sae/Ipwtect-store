import express from "express";
import { protectUser, protectAdmin } from "../middlewares/authMiddleware.js";
import {
    createOrderFromCart,
    updateOrder,
    deleteOrder,
    getUserOrders,
    cancelOrder
} from "../controllers/Order/userOrderController.js";

import {
    updateOrderStatusAdmin,
    getAllOrdersAdmin,
    getOrderByIdAdmin,
    getOrderStatusCountsAdmin
} from "../controllers/Order/adminOrderController.js";

const router = express.Router();

// USER ROUTES
router.post("/create", protectUser, createOrderFromCart);
router.get("/", protectUser, getUserOrders);
router.put("/:id", protectUser, updateOrder);
router.delete("/:id", protectUser, deleteOrder);

// cancel order (user can only cancel if status is pending)
router.put("/cancel/:id", protectUser, cancelOrder);

// ADMIN ROUTE
router.get("/admin/stats", protectAdmin, getOrderStatusCountsAdmin);
router.get("/admin", protectAdmin, getAllOrdersAdmin);
router.get("/admin/:id", protectAdmin, getOrderByIdAdmin);
router.put("/status/:id", protectAdmin, updateOrderStatusAdmin);

export default router;
