import Order from "../../models/order.js";
import Cart from "../../models/cart.js";
import Product from "../../models/product.js";
import User from "../../models/user.js";
import { handleResponse } from "../../middlewares/handleResponse.js";
import { logEvent } from "../../middlewares/logger.js";



export const createOrderFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { addressIndex, paymentMethod } = req.body;

        // Validate payment method
        if (!["CreditCard", "PayPal", "CashOnDelivery"].includes(paymentMethod)) {
            return handleResponse(res, 400, false, "Invalid payment method");
        }

        // Get user
        const user = await User.findById(userId);
        if (!user) return handleResponse(res, 404, false, "User not found");

        // Validate address
        if (addressIndex < 0 || addressIndex >= user.addresses.length) {
            return handleResponse(res, 400, false, "Invalid address index");
        }

        const deliveryAddress = user.addresses[addressIndex];

        // Get cart
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return handleResponse(res, 400, false, "Cart is empty");
        }

        let processedItems = [];
        let totalAmount = 0;

        // Validate stock & prepare items
        for (let item of cart.items) {
            const product = item.product;

            if (product.stock < item.quantity) {
                return handleResponse(res, 400, false, `${product.name} has insufficient stock`);
            }

            // 🔥 Reduce stock & increase sold
            product.stock -= item.quantity;
            product.sold = (product.sold || 0) + item.quantity;
            await product.save();

            const subtotal = product.price * item.quantity;
            totalAmount += subtotal;

            processedItems.push({
                product: product._id,
                quantity: item.quantity,
                unitPrice: product.price,
                subtotal
            });
        }

        // Payment status
        const isPaid = paymentMethod !== "CashOnDelivery";

        // Create order
        const order = await Order.create({
            user: userId,
            items: processedItems,
            address: deliveryAddress,
            totalAmount,
            paymentMethod,
            paid: isPaid,
            status: "Pending"
        });

        // Empty cart
        cart.items = [];
        await cart.save();

        return handleResponse(res, 201, true, "Order created successfully", order);

    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};




// -------------------------------------------
// 🟡 UPDATE ORDER (only if not shipped yet)
// -------------------------------------------
export const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user._id;

        const order = await Order.findById(orderId);
        if (!order)
            return handleResponse(res, 404, false, "Order not found");

        if (String(order.user) !== String(userId)) {
            return handleResponse(res, 403, false, "Not authorized");
        }

        // Cannot edit after processing or shipping
        if (["Shipped", "Delivered", "Cancelled"].includes(order.status)) {
            return handleResponse(res, 400, false, "Cannot update this order");
        }

        // Update address
        if (req.body.addressIndex !== undefined) {
            const user = await User.findById(userId);
            const address = user.addresses[req.body.addressIndex];

            if (!address)
                return handleResponse(res, 400, false, "Invalid address index");

            order.address = address;
        }

        // Update quantities
        if (req.body.items) {
            for (let item of req.body.items) {
                const orderItem = order.items.find(
                    i => String(i.product) === String(item.product)
                );

                if (!orderItem)
                    return handleResponse(res, 404, false, "Product not in order");

                if (item.quantity <= 0)
                    return handleResponse(res, 400, false, "Quantity must be >= 1");

                orderItem.quantity = item.quantity;
                orderItem.subtotal = orderItem.unitPrice * item.quantity;
            }
        }

        order.totalAmount = order.items.reduce((s, i) => s + i.subtotal, 0);
        await order.save();

        return handleResponse(res, 200, true, "Order updated", order);

    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


// -------------------------------------------
// 🔴 DELETE ORDER (only if Pending)
// -------------------------------------------
export const deleteOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const orderId = req.params.id;

        const order = await Order.findOne({ _id: orderId, user: userId });

        if (!order)
            return handleResponse(res, 404, false, "Order not found");

        if (order.status !== "Pending") {
            return handleResponse(
                res,
                400,
                false,
                "Only Pending orders can be deleted"
            );
        }

        // 🔥 Restore stock AND reduce sold count
        for (let item of order.items) {
            const product = await Product.findById(item.product);
            if (!product) continue;

            product.stock += item.quantity;

            // Decrease sold but never go below 0
            product.sold = Math.max(0, (product.sold || 0) - item.quantity);

            await product.save();
        }

        await Order.findByIdAndDelete(orderId);

        return handleResponse(res, 200, true, "Order deleted");

    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ user: userId })
            .populate("items.product", "name price image")
            .sort({ createdAt: -1 });

        return handleResponse(res, 200, true, "Orders fetched", {
            orderCount: orders.length,
            orders
        });

    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


// cancel order only if its pernding
export const cancelOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const orderId = req.params.id;

        const order = await Order.findOne({ _id: orderId, user: userId });

        if (!order)
            return handleResponse(res, 404, false, "Order not found");

        if (order.status !== "Pending") {
            return handleResponse(
                res,
                400,
                false,
                "Only Pending orders can be cancelled"
            );
        }

        order.status = "Cancelled";
        await order.save();

        return handleResponse(res, 200, true, "Order cancelled");

    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


