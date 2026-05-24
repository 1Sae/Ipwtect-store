import Review from "../../models/review.js";
import Product from "../../models/product.js";

export const addReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;

        const userId = req.user._id;

        // ✅ use Review model
        const review = await Review.findOneAndUpdate(
            { user: userId, product: productId },
            { rating, comment },
            { new: true, upsert: true }
        );

        // recalc
        const reviews = await Review.find({ product: productId });

        const avg =
            reviews.length > 0
                ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                : 0;

        await Product.findByIdAndUpdate(productId, {
            averageRating: avg,
            reviewCount: reviews.length,
        });

        return res.status(200).json({
            success: true,
            message: "Review submitted",
            data: review,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ product: productId })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};