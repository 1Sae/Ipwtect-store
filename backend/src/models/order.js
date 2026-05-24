import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        items: [orderItemSchema],

        address: {
            label: String,
            fullAddress: String,
            city: String,
            country: String,
            postalCode: String
        },

        totalAmount: { type: Number, required: true },

        paymentMethod: {
            type: String,
            enum: ["CreditCard", "PayPal", "CashOnDelivery"],
            required: true
        },

        paid: { type: Boolean, default: false },

        status: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending"
        }
    },
    { timestamps: true }
);

orderSchema.index({ status: 1 });

export default mongoose.model("Order", orderSchema);
