import mongoose from "mongoose";

const specs = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: String, required: true },
    });

    const DEFAULT_IMAGE =
    "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg";

    const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },

        // ✅ Keep old field for compatibility (main/preview image)
        image: { type: String, default: DEFAULT_IMAGE },

        // ✅ New field (gallery)
        images: { type: [String], default: [] },

        category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        },
        brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
        },
        stock: { type: Number, required: true, default: 0 },
        sold: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        status: {
        type: String,
        enum: ["available", "unavailable"],
        default: "available",
        required: true,
        },
        specifications: [specs],
        discount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);
