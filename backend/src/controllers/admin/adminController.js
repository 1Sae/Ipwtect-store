import Admin from "../../models/admin.js";
import { handleResponse } from "../../middlewares/handleResponse.js";
import { logEvent } from "../../middlewares/logger.js";
import { validateFields, validateAllowedFields } from "../../middlewares/validator.js";
import { isStrongPassword } from "../../../utils/passwordValidator.js";
import User from "../../models/user.js";
import order from "../../models/order.js";
import product from "../../models/product.js";
import category from "../../models/category.js";
import brand from "../../models/brand.js";

// Change Admin Password
export const changeAdminPassword = async (req, res) => {
    try {
        const adminId = req.admin._id; // Provided by protectAdmin middleware

        // 1. Validate required fields
        const missing = validateFields(["oldPassword", "newPassword"], req.body);
        if (missing) return handleResponse(res, 400, false, missing);

        // 2. Reject extra fields
        const disallowed = validateAllowedFields(["oldPassword", "newPassword"], req.body);
        if (disallowed) return handleResponse(res, 400, false, disallowed);

        const { oldPassword, newPassword } = req.body;

        // 3. Fetch admin + include password
        const admin = await Admin.findById(adminId).select("+password");
        if (!admin) return handleResponse(res, 404, false, "Admin not found");

        // 4. Verify old password
        const isMatch = await admin.comparePassword(oldPassword);
        if (!isMatch) {
            logEvent(`Password change failed (wrong old password): ${admin.email}`, "warning");
            return handleResponse(res, 400, false, "Old password is incorrect");
        }

        // 5. Validate new password strength
        if (!isStrongPassword(newPassword)) {
            return handleResponse(
                res,
                400,
                false,
                "New password must be at least 8 characters and include upper, lower, number, and symbol"
            );
        }

        // 6. Prevent using same password again
        const isSamePassword = await admin.comparePassword(newPassword);
        if (isSamePassword) {
            return handleResponse(res, 400, false, "New password cannot be the same as the old password");
        }

        // 7. Save new password (DO NOT hash manually — the model will hash it)
        admin.password = newPassword;
        await admin.save();

        logEvent(`Admin password updated: ${admin.email}`, "success");

        return handleResponse(res, 200, true, "Password updated successfully");

    } catch (error) {
        logEvent(`Admin password update failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


export const UpdateAdmin = async (req, res) => {
    try {
        const adminId = req.admin._id; // From protectAdmin middleware

        // Allowed fields for updating
        const allowedUpdates = ["name", "email", "phone"];

        // 1. Validate required fields
        const missing = validateFields(allowedUpdates, req.body);
        if (missing) return handleResponse(res, 400, false, missing);

        // 2. Reject extra fields
        const disallowed = validateAllowedFields(allowedUpdates, req.body);
        if (disallowed) return handleResponse(res, 400, false, disallowed);
        // Fetch admin
        let admin = await Admin.findById(adminId).select("-password");
        if (!admin) return handleResponse(res, 404, false, "Admin not found");

        // prevents duplicate emails for admins
        const existingAdmin = await Admin.findOne({ email: req.body.email });
        if (existingAdmin && existingAdmin._id.toString() !== adminId) {
            return handleResponse(res, 400, false, "Admin with this email already exists");
        }

        // Update fields
        admin.name = req.body.name;
        admin.email = req.body.email;
        admin.phone = req.body.phone;

        // Save with validation
        await admin.save();

        logEvent(`Admin updated: ${admin.email}`, "success");
        return handleResponse(res, 200, true, "Admin updated successfully", admin);

    } catch (error) {
        logEvent(`Admin update failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};



export const GetAllAdminData = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select("-password");
        if (!admin) {
            logEvent(`User data fetch failed: User not found`, "warning");
            return handleResponse(res, 404, false, "User not found");
        }
        logEvent(`User data fetched: ${admin.email}`, "info");
        return handleResponse(res, 200, true, "User data fetched", admin);
    } catch (error) {
        logEvent(`User data fetch failed`, "warning");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
}

export const deleteAdmin = async (req, res) => {
    try {
        const adminId = req.admin._id; // Provided by protectAdmin middleware
        const admin = await Admin.findById(adminId);
        if (!admin) return handleResponse(res, 404, false, "Admin not found");
        await Admin.findByIdAndDelete(adminId);
        logEvent(`Admin deleted: ${admin.email}`, "success");
        return handleResponse(res, 200, true, "Admin deleted successfully");
    } catch (error) {
        logEvent(`Admin delete failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
}


export const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        logEvent(`Admins fetched: ${admins.length} admin(s)`, "info");
        return handleResponse(res, 200, true, "Admins fetched successfully", admins);
    } catch (error) {
        logEvent(`Admins fetch failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
}


export const getAllUsers = async (req,res) => {
    try {
        const users = await User.find();
        logEvent(`Users fetched: ${users.length} user(s)`, "info");
        return handleResponse(res, 200, true, "Users fetched successfully", users);
    } catch (error) {
        logEvent(`Users fetch failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
}

export const getNewUsers = async (req, res) => {
    try {
        // Default: last 7 days
        const days = Number(req.query.days) || 7;

        const now = new Date();
        const fromDate = new Date(now);
        fromDate.setDate(now.getDate() - days);

        // Find users created in the last X days
        const users = await User.find({
            createdAt: { $gte: fromDate }
        }).sort({ createdAt: -1 }); // newest first

        logEvent(
            `New users fetched: ${users.length} user(s) in the last ${days} day(s)`,
            "info"
        );

        return handleResponse(
            res,
            200,
            true,
            "New users fetched successfully",
            {
                days,
                total: users.length,
                users,
            }
        );
    } catch (error) {
        logEvent(`New users fetch failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
    
        const user = await User.findById(userId);
        if (!user) return handleResponse(res, 404, false, "User not found");
    
        const orders = await order.find({ user: userId })
            .populate({
            path: "items.product",
            select: "name image images brand category",
            populate: [
                { path: "brand", select: "name image images" },
                { path: "category", select: "name image images" },
            ],
            })
            .select("items totalAmount paymentMethod paid status address createdAt")
            .sort({ createdAt: -1 });
    
        logEvent(`User fetched: ${user.email}`, "info");
        return handleResponse(res, 200, true, "User fetched successfully", {
            user,
            orders,
        });
    } catch (error) {
        logEvent(`User fetch failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};

// get dashboard data for new users, totalusers, totalorders, products number, outofstock count, lowstock count, top selling products, newest categories and brands and products created
const startOfDay = (d) => new Date(d.setHours(0, 0, 0, 0));
const endOfDay = (d) => new Date(d.setHours(23, 59, 59, 999));

export const getDashboardData = async (req, res) => {
    try {

        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());
        const sevenDaysAgo = startOfDay(
            new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        );
        const thirtyDaysAgo = startOfDay(
            new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)
        );
            
        // ================= ORDERS CHART =================

        // TODAY (orders per hour)
        const todayOrders = await order.aggregate([
            {
            $match: {
                createdAt: { $gte: todayStart, $lte: todayEnd },
            },
            },
            {
            $group: {
                _id: { $hour: "$createdAt" },
                count: { $sum: 1 },
            },
            },
            { $sort: { "_id": 1 } },
            {
            $project: {
                _id: 0,
                label: { $concat: [{ $toString: "$_id" }, ":00"] },
                value: "$count",
            },
            },
        ]);
        
        // LAST 7 DAYS (orders per day)
        const last7DaysOrders = await order.aggregate([
            {
            $match: {
                createdAt: { $gte: sevenDaysAgo },
            },
            },
            {
            $group: {
                _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                count: { $sum: 1 },
            },
            },
            { $sort: { "_id": 1 } },
            {
            $project: {
                _id: 0,
                label: "$_id",
                value: "$count",
            },
            },
        ]);
        
        // LAST 30 DAYS (orders per day)
        const last30DaysOrders = await order.aggregate([
            {
            $match: {
                createdAt: { $gte: thirtyDaysAgo },
            },
            },
            {
            $group: {
                _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                count: { $sum: 1 },
            },
            },
            { $sort: { "_id": 1 } },
            {
            $project: {
                _id: 0,
                label: "$_id",
                value: "$count",
            },
            },
        ]);  

        const todaySales = await order.aggregate([
        {
            $match: {
            status: "Delivered",
            createdAt: { $gte: todayStart, $lte: todayEnd },
            },
        },
        {
            $group: {
            _id: { $hour: "$createdAt" },
            total: { $sum: "$totalAmount" },
            },
        },
        { $sort: { "_id": 1 } },
        {
            $project: {
            _id: 0,
            label: {
                $concat: [{ $toString: "$_id" }, ":00"],
            },
            value: "$total",
            },
        },
        ]);

        const last7DaysSales = await order.aggregate([
                {
                $match: {
                    status: "Delivered",
                    createdAt: { $gte: sevenDaysAgo },
                },
                },
                {
                $group: {
                    _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    total: { $sum: "$totalAmount" },
                },
                },
                { $sort: { "_id": 1 } },
                {
                $project: {
                    _id: 0,
                    label: "$_id",
                    value: "$total",
                },
                },
            ]);
        

        const last30DaysSales = await order.aggregate([
                    {
                    $match: {
                        status: "Delivered",
                        createdAt: { $gte: thirtyDaysAgo },
                    },
                    },
                    {
                    $group: {
                        _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                        },
                        total: { $sum: "$totalAmount" },
                    },
                    },
                    { $sort: { "_id": 1 } },
                    {
                    $project: {
                        _id: 0,
                        label: "$_id",
                        value: "$total",
                    },
                    },
            ]);

        const limit = Math.min(Number(req.query.limit) || 5, 50); // limit is 5 by default

        const newestProducts = await product.aggregate([
            { $sort: { createdAt: -1 } },
            { $limit: limit },
            { $project: { name: 1, image: 1, price: 1, createdAt: 1 } },
        ])
        const totalUsers = await User.countDocuments();
        const totalOrders = await order.countDocuments();
        // newest users, and shows how many orders did they make as count
        const newUsers = await User.aggregate([
            { $sort: { createdAt: -1 } },
            { $limit: limit },
            { $lookup: {
                from: "orders",
                localField: "_id",
                foreignField: "user",
                as: "orders"

            },
            },
            {
                $addFields: {
                    orders: { $size: "$orders" }
                }
            },
            { $project: { name: 1, email: 1, createdAt: 1, orders: 1 } },
        ])
        const totalProducts = await product.countDocuments();
        const totalCategories = await category.countDocuments();
        const totalBrands = await brand.countDocuments();
        const [{ totalSales = 0 } = {}] = await order.aggregate([
            { $match: { status: "Delivered" } },
            { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
        ]);          
        const totalStock = await product.countDocuments({ stock: { $gt: 0 } });
        const totalLowStock = await product.countDocuments({ stock: { $lt: 10 } });
        const totalOutOfStock = await product.countDocuments({ stock: 0 });
        const totalDelivered = await order.countDocuments({
            status: "Delivered"
        });          
        const totalCancelled = await order.countDocuments({
            status: "Cancelled"
        })
        const totalPending = await order.countDocuments({
            status: "Pending"
        })
        const totalProcessing = await order.countDocuments({
            status: "Processing"
        })
        const totalShipped = await order.countDocuments({
            status: "Shipped"
        })
        const threshold = 5; // you can make this dynamic later if you want
        const lowStockProducts = await product.aggregate([
            { $match: { stock: {$gt: 0, $lt: threshold } } },
            { $limit: limit },
            { $project: { name: 1, image: 1, price: 1, stock: 1 } },
        ])
        const outOfStockProducts = await product.aggregate([
            { $match: { stock: 0 } },
            { $limit: limit },
            { $project: { name: 1, image: 1, price: 1, stock: 1 } },
        ])
        const topSellingProducts = await product.aggregate([
                {
                $match: { sold: { $gt: 0 } },
                },
                {
                $addFields: {
                    totalSales: { $multiply: ["$sold", "$price"] },
                },
                },
                {
                $sort: { sold: -1 },
                },
                {
                $limit: 5,
                },
                {
                $project: {
                    name: 1,
                    sold: 1,
                    price: 1,
                    totalSales: 1,
                    image: 1,
                },
            },
        ]);          
        const newestCategories = await category.find().sort({ createdAt: -1 }).limit(limit);
        const newestBrands = await brand.find().sort({ createdAt: -1 }).limit(limit);
        const newestOrders = await order.aggregate([
                { $sort: { createdAt: -1 } },
                { $limit: limit },
            
                // USER
                {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [{ $project: { name: 1, email: 1 } }]
                }
                },
                { $unwind: "$user" },
            
                // PRODUCTS INSIDE ITEMS
                {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "products",
                    pipeline: [{ $project: { name: 1, image: 1, price: 1 } }]
                }
                },
            
            // MERGE product data into items
                {
                $addFields: {
                    items: {
                    $map: {
                        input: "$items",
                        as: "item",
                        in: {
                        quantity: "$$item.quantity",
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
                        }
                        }
                    }
                    }
                }
                },
            
            {
                $project: {
                    user: 1,
                    items: 1,
                    totalAmount: 1,
                    createdAt: 1
                }
            }
        ]);          
        logEvent("Dashboard data fetched", "info");
        return handleResponse(res, 200, true, "Dashboard data fetched", {
            newestProducts,
            totalUsers,
            totalOrders,
            newUsers,
            lowStockProducts,
            outOfStockProducts,
            topSellingProducts,
            newestCategories,
            newestBrands,
            newestOrders,
            totalProducts,
            totalCategories,
            totalBrands,
            totalSales,
            totalStock,
            totalLowStock,
            totalOutOfStock,
            totalDelivered,
            totalCancelled,
            totalPending,
            totalProcessing,
            totalShipped,
            salesChart: {
                today: todaySales,
                last7Days: last7DaysSales,
                last30Days: last30DaysSales,
            },   
            ordersChart: {
                today: todayOrders,
                last7Days: last7DaysOrders,
                last30Days: last30DaysOrders,
            },           
        });
    } catch (error) {
        logEvent(`Dashboard data fetch failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
}