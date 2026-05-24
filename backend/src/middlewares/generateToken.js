import jwt from "jsonwebtoken";

export const generateUserToken = (id) => {
    return jwt.sign(
        { id, role: "user" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};


export const generateAdminToken = (id) => {
    return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET_ADMIN, {
        expiresIn: "1d",
    });
};
