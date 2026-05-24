import User from "../../models/user.js";
import { handleResponse } from "../../middlewares/handleResponse.js";
import { isStrongPassword } from "../../../utils/passwordValidator.js";
import { validateFields, validateAllowedFields } from "../../middlewares/validator.js";
import { logEvent } from "../../middlewares/logger.js";


//change user password that requires old and new password
export const changeUserPassword = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Required fields
        const missing = validateFields(["oldPassword", "newPassword"], req.body);
        if (missing) return handleResponse(res, 400, false, missing);

        // 2. Reject extra fields
        const disallowed = validateAllowedFields(["oldPassword", "newPassword"], req.body);
        if (disallowed) return handleResponse(res, 400, false, disallowed);

        const { oldPassword, newPassword } = req.body;

        // 3. Fetch user including password
        const user = await User.findById(userId).select("+password");
        if (!user) return handleResponse(res, 404, false, "User not found");

        // 4. Validate old password
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch){
            logEvent(`Password change failed (wrong old password): ${user.email}`, "warning");
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

        // 6. Prevent same password reuse
        const isSame = await user.comparePassword(newPassword);
        if (isSame) {
            return handleResponse(res, 400, false, "New password cannot be the same as old password");
        }

        // 7. Save new password (model will hash)
        user.password = newPassword;
        await user.save();
        logEvent(`Admin password updated: ${user.email}`, "success");
        return handleResponse(res, 200, true, "Password updated successfully");

    } catch (error) {
        console.error("Error updating password:", error);
        return handleResponse(res, 500, false, "Internal server error");
    }
};


export const getAllUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            logEvent(`User data fetch failed: User not found`, "warning");
            return handleResponse(res, 404, false, "User not found");
        }

        logEvent(`User data fetched: ${user.email}`, "info");
        return handleResponse(res, 200, true, "User data fetched", user);

    } catch (error) {
        logEvent(`User data fetch failed`, "warning");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


export const updateUserData = async (req, res) => {
    try {
        const userId = req.user._id;
    
        const allowedFields = ["name", "email", "phone", "companyName"];
    
        const disallowed = validateAllowedFields(allowedFields, req.body);
        if (disallowed) return handleResponse(res, 400, false, disallowed);
    
        const user = await User.findById(userId);
        if (!user)
            return handleResponse(res, 404, false, "User not found");

    
        if (req.body.name !== undefined && req.body.name.trim() === "")
            return handleResponse(res, 400, false, "Name cannot be empty");
    
        if (req.body.phone !== undefined && req.body.phone.trim() === "")
            return handleResponse(res, 400, false, "Phone cannot be empty");
    
        if (req.body.email !== undefined && req.body.email.trim() === "")
            return handleResponse(res, 400, false, "Email cannot be empty");
    
        // companyName is OPTIONAL → allow empty or undefined
        if (
            req.body.companyName !== undefined &&
            req.body.companyName.trim() === ""
        ) {
            req.body.companyName = ""; // or null if you prefer
        }
    
        if (req.body.email) {
            const newEmail = req.body.email.trim().toLowerCase();
    
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newEmail))
            return handleResponse(res, 400, false, "Invalid email format");
    
            const exists = await User.findOne({
            email: newEmail,
            _id: { $ne: userId },
            });
    
            if (exists)
            return handleResponse(res, 400, false, "Email already in use");
    
            user.email = newEmail;
        }
    
        if (req.body.phone) {
            const phone = req.body.phone.trim();
    
            if (!/^[0-9+\- ]{6,20}$/.test(phone))
            return handleResponse(res, 400, false, "Invalid phone number format");
    
            user.phone = phone;
        }
    
        if (req.body.name)
            user.name = req.body.name.trim();
    
        if (req.body.companyName !== undefined)
            user.companyName = req.body.companyName.trim();

        await user.save();
    
        logEvent(`User data updated: ${user.email}`, "info");
    
        return handleResponse(res, 200, true, "User data updated", {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            companyName: user.companyName,
        });
    
        } catch (error) {
        logEvent(`Error updating user data: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
        }
    };

export const addUserAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { label, fullAddress, city, country, postalCode } = req.body;

        // Required fields
        if (!label || !fullAddress || !city || !country) {
            return handleResponse(res, 400, false, "label, fullAddress, city, and country are required");
        }

        const user = await User.findById(userId);
        if (!user) return handleResponse(res, 404, false, "User not found");

        // Add new address
        const newAddress = { label, fullAddress, city, country, postalCode };
        user.addresses.push(newAddress);

        await user.save();
        logEvent(`Address added for user: ${user.email}`, "info");

        return handleResponse(res, 201, true, "Address added successfully", user.addresses);

    } catch (error) {
        logEvent(`Error adding address: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


export const updateUserAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const index = parseInt(req.params.index);

        const user = await User.findById(userId);
        if (!user) return handleResponse(res, 404, false, "User not found");

        if (!user.addresses[index]) {
            return handleResponse(res, 404, false, "Address not found");
        }

        // Update only provided fields
        const updatedFields = req.body;
        Object.assign(user.addresses[index], updatedFields);

        await user.save();
        logEvent(`Address updated for user: ${user.email}`, "info");

        return handleResponse(res, 200, true, "Address updated successfully", user.addresses[index]);

    } catch (error) {
        logEvent(`Error updating address: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


export const deleteUserAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const index = parseInt(req.params.index);

        const user = await User.findById(userId);
        if (!user) return handleResponse(res, 404, false, "User not found");

        if (!user.addresses[index]) {
            return handleResponse(res, 404, false, "Address not found");
        }

        // Remove address from array
        user.addresses.splice(index, 1);

        await user.save();
        logEvent(`Address deleted for user: ${user.email}`, "info");

        return handleResponse(res, 200, true, "Address deleted successfully", user.addresses);

    } catch (error) {
        logEvent(`Error deleting address: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};

export const getAllUserAddresses = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select("addresses email");
        if (!user) {
            return handleResponse(res, 404, false, "User not found");
        }

        logEvent(`Fetched addresses for: ${user.email}`, "info");

        return handleResponse(
            res,
            200,
            true,
            "Addresses fetched successfully",
            user.addresses
        );

    } catch (error) {
        logEvent(`Error fetching addresses: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};
