    import jwt from "jsonwebtoken";
    import User from "../models/user.js";
    import Admin from "../models/admin.js";

    // 🛡️ Middleware to protect User routes
    export const protectUser = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
        try {
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ user secret

        if (decoded.role !== "user")
            return res.status(403).json({ message: "Not authorized as User" });

        req.user = await User.findById(decoded.id).select("-password");
        next();
        } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token, not authorized, Not User" });
        }
    }

    if (!token)
        return res.status(401).json({ message: "Not authorized, token missing" });
    };

    // 🛡️ Middleware to protect Admin routes
    export const protectAdmin = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
        try {
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN); // ✅ admin secret

        if (decoded.role !== "admin")
            return res.status(403).json({ message: "Not authorized as Admin" });

        req.admin = await Admin.findById(decoded.id).select("-password");
        next();
        } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token, not authorized, Not Admin" });
        }
    }

    if (!token)
        return res.status(401).json({ message: "Not authorized, token missing" });
    };

    // 🛡️ Optional: Middleware to allow either user or admin (useful for common features)
    export const protectEither = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
        try {
        token = req.headers.authorization.split(" ")[1];

        // Try verifying as Admin first
        try {
            const decodedAdmin = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
            req.admin = await Admin.findById(decodedAdmin.id).select("-password");
            req.role = "admin";
            return next();
        } catch {}

        // Then try verifying as User
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedUser.id).select("-password");
        req.role = "user";
        return next();
        } catch {
        return res.status(401).json({ message: "Not authorized, invalid token" });
        }
    }

    if (!token)
        return res.status(401).json({ message: "Not authorized, token missing" });
    };
