import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: {
        type: String,
        default: "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg",
        },
        description: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
