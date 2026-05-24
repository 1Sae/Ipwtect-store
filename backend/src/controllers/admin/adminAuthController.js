import Admin from "../../models/admin.js";
import bcrypt from "bcryptjs";
import { generateAdminToken } from "../../middlewares/generateToken.js";
import { handleResponse } from "../../middlewares/handleResponse.js";
import { logEvent } from "../../middlewares/logger.js";
import { validateFields, validateAllowedFields } from "../../middlewares/validator.js";
import { isStrongPassword } from "../../../utils/passwordValidator.js";


// ==========================================================
// REGISTER ADMIN
// ==========================================================
export const registerAdmin = async (req, res) => {
    try {
        // 1. Required fields
        const missing = validateFields(["name", "email", "password"], req.body);
        if (missing) return handleResponse(res, 400, false, missing);

        let { name, email, password } = req.body;

        // 4. Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin)
        return handleResponse(res, 400, false, "Admin already exists");

        // 3. Validate password
        if (!isStrongPassword(password)) {
        return handleResponse(
            res,
            400,
            false,
            "Password must be at least 8 characters and include upper, lower, number, and symbol."
        );
        }

        // 5. Create admin (password hashing handled in model)
        const newAdmin = await Admin.create({
        name,
        email,
        password,
        });

        // 6. Generate admin token
        const token = generateAdminToken(newAdmin._id, "admin");

        logEvent(`New admin registered: ${email}`, "success");

        return handleResponse(res, 201, true, "Admin registered successfully", {
        token,
        admin: {
            _id: newAdmin._id,
            name: newAdmin.name,
            email: newAdmin.email,
            role: newAdmin.role,
        },
        });
    } catch (error) {
        logEvent(`Admin registration failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};



// ==========================================================
// LOGIN ADMIN
// ==========================================================
export const loginAdmin = async (req, res) => {
    try {
        // 1. Required fields
        const missing = validateFields(["email", "password"], req.body);
        if (missing) return handleResponse(res, 400, false, missing);

        // 2. Reject any extra fields
        const disallowed = validateAllowedFields(["email", "password"], req.body);
        if (disallowed) return handleResponse(res, 400, false, disallowed);

        // 3. Normalize email
        let { email, password } = req.body;

        // 4. Find admin + include password
        const admin = await Admin.findOne({ email }).select("+password");
        if (!admin)
        return handleResponse(res, 400, false, "Invalid credentials");

        // 5. Compare passwords using model method
        const isMatch = await admin.comparePassword(password);
        if (!isMatch)
        return handleResponse(res, 400, false, "Invalid credentials");

        // 6. Update last login timestamp
        admin.lastLogin = new Date();
        await admin.save();

        // 7. Generate token
        const token = generateAdminToken(admin._id, "admin");

        logEvent(`Admin logged in: ${email}`, "info");

        return handleResponse(res, 200, true, "Admin login successful", {
        token,
        admin: {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            phone : admin.phone,
            role: admin.role,
            permissions: admin.permissions,
        },
        });
    } catch (error) {
        logEvent(`Admin login failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


