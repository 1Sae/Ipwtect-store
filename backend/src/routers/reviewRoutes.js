import express from "express";
import { protectUser } from "../middlewares/authMiddleware.js";
import { addReview, getProductReviews } from "../controllers/reviews/reviewsController.js";

const router = express.Router();

router.post("/:productId", protectUser, addReview);
router.get("/:productId", getProductReviews);

export default router;
