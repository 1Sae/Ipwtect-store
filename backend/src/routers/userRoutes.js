import express from "express";
import { changeUserPassword, getAllUserData, updateUserData, addUserAddress, updateUserAddress, deleteUserAddress, getAllUserAddresses } from "../controllers/user/userController.js";
import { protectUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/change-user-password", protectUser, changeUserPassword);
router.get("/get-user-data", protectUser, getAllUserData);
router.put("/update-user-data", protectUser, updateUserData);
router.post("/address", protectUser, addUserAddress);
router.put("/address/:index", protectUser, updateUserAddress);
router.delete("/address/:index", protectUser, deleteUserAddress);
router.get("/addresses", protectUser, getAllUserAddresses);



export default router;