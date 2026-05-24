import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
    {
        name: {
        type: String,
        required: [true, "Admin name is required"],
        trim: true,
        minlength: 3,
        maxlength: 50,
        },

        email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        },

        password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
        trim: true,
        },

        phone: {
        type: String,
        trim: true,
        },

        lastLogin: { type: Date },
    },
    { timestamps: true }
);

// ====================
// Hash Password
// ====================
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ====================
// Compare Password
// ====================
adminSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("Admin", adminSchema);
