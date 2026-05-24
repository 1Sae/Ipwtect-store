import Order from "../../models/order.js";
import { handleResponse } from "../../middlewares/handleResponse.js";
import { logEvent } from "../../middlewares/logger.js";
import mongoose from "mongoose";


export const getAllOrdersAdmin = async (req, res) => {
    try {

        const orders = await Order.aggregate([

            {
                $addFields: {
                    itemsCount: { $size: "$items" }
                }
            },

            {
                $sort: { createdAt: -1 }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },

            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "products"
                }
            },
            {
                $addFields: {
                    items: {
                        $map: {
                            input: "$items",
                            as: "item",
                            in: {

                                product: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$products",
                                                as: "p",
                                                cond: { $eq: ["$$p._id", "$$item.product"] }
                                            }
                                        },
                                        0
                                    ]
                                },
                                quantity: "$$item.quantity",
                                unitPrice: "$$item.unitPrice",
                                subtotal: "$$item.subtotal"
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    products: 0
                }
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    items: 1,
                    itemsCount: 1,
                    address: 1,
                    totalAmount: "$totalAmount",
                    totalAmount: 1,
                    paymentMethod: 1,
                    paymentMethod: 1,
                    status: 1,
                    paid: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    totalnumberofspecs: 1
                }
            }

        ]);


        return handleResponse(res, 200, true, "Orders fetched", {
            totalOrders: orders.length,
            orders
        });


    } catch (error) {

        logEvent(`Admin getAllOrders failed: ${error.message}`, "error");

        return handleResponse(res, 500, false, "Server error", error.message);
    }
};





export const getOrderByIdAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return handleResponse(res, 400, false, "Invalid order ID");
        }

        const order = await Order.findById(id)
        .populate("user", "name email phone referralCode")
        .populate({
            path: "items.product",
            select: "name price image brand category specifications",
            populate: [
            { path: "brand", select: "name" },
            { path: "category", select: "name" }
            ]
        });


        if (!order) {
            return handleResponse(res, 404, false, "Order not found");
        }

        return handleResponse(res, 200, true, "Order fetched", order);
    } catch (error) {
        logEvent(`Admin getOrderById failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};

export const updateOrderStatusAdmin = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const validStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!validStatuses.includes(status)) {
            return handleResponse(res, 400, false, "Invalid order status");
        }

        const order = await Order.findById(orderId);
        if (!order)
            return handleResponse(res, 404, false, "Order not found");

        order.status = status;
        await order.save();

        // Log event
        logEvent(`Order ${orderId} status updated to ${status}`);
        return handleResponse(res, 200, true, "Order status updated", order);

    } catch (error) {
        logEvent(`Order status update failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


export const getOrderStatusCountsAdmin = async (req, res) => {
    try {
        const counts = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $project: { _id: 0, status: "$_id", count: 1 } }
        ]);
    
        // optional: normalize to show 0 for missing statuses
        const all = ["Pending","Processing","Shipped","Delivered","Cancelled"];
        const map = Object.fromEntries(counts.map(x => [x.status, x.count]));
        const result = all.map(s => ({ status: s, count: map[s] || 0 }));
    
        return handleResponse(res, 200, true, "Order status counts fetched", result);
    } catch (error) {
        logEvent(`Order stats failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};  