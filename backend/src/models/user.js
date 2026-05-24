import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const addressSchema = new mongoose.Schema(
    {
        label: { type: String, trim: true }, // Home, Work...
        fullAddress: { type: String, trim: true },
        city: { type: String, trim: true },
        country: { type: String, trim: true },
        postalCode: { type: String, trim: true },
    },
  { _id: false } // Prevents unnecessary IDs
);


const userSchema = new mongoose.Schema(
    {
        name: {
        type: String,
        required: [true, "Name is required"],
        minlength: 3,
        maxlength: 50,
        trim: true,
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
        select: false, // EXCLUDED by default
        trim: true,
        },

        phone: { type: String, trim: true },

        addresses: [addressSchema],

        wishlist: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: [] },
        ],
        role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        },
        referralCode: {
        type: String,
        unique: true,
        sparse: true, // avoids index errors
        },

        companyName: { type: String, trim: true },
        
        twoFactorEnabled: {
        type: Boolean,
        default: false,
        },

    },
    { timestamps: true }
);


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
