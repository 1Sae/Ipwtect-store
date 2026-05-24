import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import { generateUserToken } from "../../middlewares/generateToken.js";
import { handleResponse } from "../../middlewares/handleResponse.js";
import { logEvent } from "../../middlewares/logger.js";
import { validateFields, validateAllowedFields } from "../../middlewares/validator.js";
import { generateReferralCode } from "../../../utils/generateReferralCode.js";
import { isStrongPassword } from "../../../utils/passwordValidator.js";



export const registerUser = async (req, res) => {
    try {
        // 1. Required fields
        const missing = validateFields(["name", "email", "password"], req.body);
        if (missing) return handleResponse(res, 400, false, missing);

        let { name, email, password, referredCode, companyName } = req.body;
        email = email.trim().toLowerCase();

        // 2. Password strength
        if (!isStrongPassword(password)) {
        return handleResponse(
            res,
            400,
            false,
            "Password must be at least 8 characters and include upper, lower, number, and symbol."
        );
        }

        // 3. Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
        return handleResponse(res, 400, false, "Email already registered");

        // 4. Unique referral code
        let referralCode;
        let unique = false;

        while (!unique) {
        referralCode = generateReferralCode(name);
        const exists = await User.findOne({ referralCode });
        if (!exists) unique = true;
        }

        // 5. Check referredCode (if provided)
        let referredBy = null;
        if (referredCode) {
        const refUser = await User.findOne({ referralCode: referredCode });
        if (refUser) referredBy = refUser._id;
        }

        // 6. Create user (password hashing handled by model)
        const newUser = await User.create({
        name,
        email,
        password,
        referralCode,
        referredBy,
        companyName,
        });

        // 7. Generate JWT
        const token = generateUserToken(User._id);

        // 8. Send response
        logEvent(`New user registered: ${email}`, "success");

        return handleResponse(res, 201, true, "User registered successfully", {
        token,
        user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            referralCode: newUser.referralCode,
            referredBy: newUser.referredBy,
            companyName: newUser.companyName,
        },
        });
    } catch (error) {
        logEvent(`User registration failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};



export const loginUser = async (req, res) => {
    try {
        // 1. Required fields
        const missing = validateFields(["email", "password"], req.body);
        if (missing) return handleResponse(res, 400, false, missing);

        // 2. Reject extra fields
        const disallowed = validateAllowedFields(["email", "password"], req.body);
        if (disallowed) return handleResponse(res, 400, false, disallowed);

        // 3. Normalize email
        let { email, password } = req.body;
        email = email.trim().toLowerCase();

        // 4. Find user + include password
        const user = await User.findOne({ email }).select("+password");
        if (!user)
        return handleResponse(res, 400, false, "Invalid credentials");

        // 5. Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
        return handleResponse(res, 400, false, "Invalid credentials");

        // 6. Generate token
        const token = generateUserToken(user._id);

        logEvent(`User logged in: ${email}`, "info");

        return handleResponse(res, 200, true, "Login successful", {
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            referralCode: user.referralCode,
        },
        });
    } catch (error) {
        logEvent(`User login failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};
