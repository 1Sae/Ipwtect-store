import Cart from "../../models/cart.js";
import Product from "../../models/product.js";
import { handleResponse } from "../../middlewares/handleResponse.js";


// 🟢 Get Cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId })
            .populate("items.product", "name price image ")
            .populate({
                path: "items.product",
                select: "name price image brand category",
                populate: [
                { path: "brand", select: "name" },
                { path: "category", select: "name" }
                ]
            });
        
        // give total price of all products and total quantity
        if (cart) {
            cart.totalPrice = cart.items.reduce((total, item) => {
                return total + item.product.price * item.quantity;
            }, 0);

            cart.totalQuantity = cart.items.reduce((total, item) => {
                return total + item.quantity;
            }, 0);
        }
        return handleResponse(res, 200, true, "Cart fetched successfully", cart || { items: [] });

    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


// 🟢 Add product to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) return handleResponse(res, 404, false, "Product not found");

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity }]
            });
        } else {
            const existingItem = cart.items.find(
                item => String(item.product) === String(productId)
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            cart.updatedAt = Date.now();
            await cart.save();
        }

        return handleResponse(res, 200, true, "Added to cart", cart);

    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) return handleResponse(res, 404, false, "Cart not found");

        const item = cart.items.find(
            i => String(i.product) === String(productId)
        );

        if (!item) return handleResponse(res, 404, false, "Item not in cart");

        if (quantity <= 0) {
            cart.items = cart.items.filter(i => String(i.product) !== String(productId));
        } else {
            item.quantity = quantity;
        }

        cart.updatedAt = Date.now();
        await cart.save();

        return handleResponse(res, 200, true, "Cart updated", cart);

    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


export const removeCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) return handleResponse(res, 404, false, "Cart not found");

        cart.items = cart.items.filter(
            item => String(item.product) !== String(productId)
        );

        cart.updatedAt = Date.now();
        await cart.save();

        return handleResponse(res, 200, true, "Item removed", cart);

    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        await Cart.findOneAndUpdate(
            { user: userId },
            { items: [], updatedAt: Date.now() }
        );

        return handleResponse(res, 200, true, "Cart cleared");

    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};
