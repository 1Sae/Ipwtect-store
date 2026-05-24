import express from "express";
import { changeAdminPassword,getAdmins,deleteAdmin,GetAllAdminData,getDashboardData,UpdateAdmin, getAllUsers, getNewUsers, getUserById } from "../controllers/admin/adminController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import { get } from "mongoose";

const router = express.Router();

router.put("/change-password", protectAdmin, changeAdminPassword);
router.get("/get-admins", protectAdmin, getAdmins);
router.delete("/delete-admin", protectAdmin, deleteAdmin);
router.get("/get-all-admin-data", protectAdmin, GetAllAdminData);
router.put("/update-admin", protectAdmin, UpdateAdmin);
router.get("/get-all-users-data", protectAdmin, getAllUsers);
router.get("/users/new", protectAdmin, getNewUsers);
router.get("/userdata/:id", protectAdmin, getUserById);
router.get("/get-dashboard-data", protectAdmin, getDashboardData);

export default router;
