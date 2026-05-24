import Product from "../../models/product.js";
import User from "../../models/user.js";
import {handleResponse} from "../../middlewares/handleResponse.js";
import {logEvent} from "../../middlewares/logger.js";



export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) {
            return handleResponse(res, 404, false, "Product not found");
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return handleResponse(res, 404, false, "User not found");
        }

        if (!Array.isArray(user.wishlist)) {
            user.wishlist = [];
        }

        if (user.wishlist.includes(productId)) {
            return handleResponse(res, 400, false, "Product already in wishlist");
        }

        user.wishlist.push(productId);
        await user.save();

        const updatedUser = await User.findById(req.user._id).populate("wishlist");

        return handleResponse(
            res,
            200,
            true,
            "Product Added to wishlist",
            updatedUser.wishlist
        );

    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};
export const getAllWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({path: "wishlist", options: {sort: {createdAt: -1}}});
    
        if (!user) {
            return handleResponse(res, 404, false, "User not found");
        }
    
        if (!Array.isArray(user.wishlist)) {
            user.wishlist = [];
        }
    
        return handleResponse(res, 200, true, "Wishlist fetched", user.wishlist);
        } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
        }
};  


export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user._id);
        if (!user) {
            return handleResponse(res, 404, false, "User not found");
        }

        if (!Array.isArray(user.wishlist)) {
            user.wishlist = [];
        }

        if (!user.wishlist.includes(productId)) {
            return handleResponse(res, 400, false, "Product not in wishlist");
        }

        user.wishlist = user.wishlist.filter(
            (id) => id.toString() !== productId
        );

        await user.save();

        // 🔥 IMPORTANT FIX
        const updatedUser = await User.findById(req.user._id).populate("wishlist");

        return handleResponse(
            res,
            200,
            true,
            "Removed from wishlist",
            updatedUser.wishlist
        );

    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};