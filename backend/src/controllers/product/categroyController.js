import Category from "../../models/category.js";
import { handleResponse } from "../../middlewares/handleResponse.js";
import { logEvent } from "../../middlewares/logger.js";
import { validateFields, validateAllowedFields } from "../../middlewares/validator.js";
import mongoose from "mongoose";

/* -------------------------------------------------------
    📌 CREATE CATEGORY
    Creates a new category with name, description, and image.
    - Validates required fields
    - Prevents extra fields using validateAllowedFields
    - Handles uploaded image or fallback image
-------------------------------------------------------- */
export const createCategory = async (req, res) => {
    try {
        // 1️⃣ Validate required fields
        const missing = validateFields(["name"], req.body);
        if (missing) return handleResponse(res, 400, false, missing);

        // 2️⃣ Only allow name + description
        const disallowed = validateAllowedFields(["name", "description"], req.body);
        if (disallowed) return handleResponse(res, 400, false, disallowed);

        const { name, description } = req.body;

        // 3️⃣ Check if category already exists
        const existing = await Category.findOne({ name });
        if (existing) return handleResponse(res, 400, false, "Category already exists");

        // 4️⃣ Uploaded image or default
        const image = req.file
            ? `/uploads/categories/${req.file.filename}`
            : "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg";

        // 5️⃣ Create new category
        const category = await Category.create({ name, description, image });

        logEvent(`Category created: ${name}`, "success");
        return handleResponse(res, 201, true, "Category created successfully", category);

    } catch (error) {
        logEvent(`Category creation failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


/* -------------------------------------------------------
    📌 GET ALL CATEGORIES
    Returns all categories sorted by newest first.
-------------------------------------------------------- */
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });

        logEvent("Fetched all categories", "info");
        return handleResponse(res, 200, true, "Categories fetched successfully", categories);

    } catch (error) {
        logEvent(`Error fetching categories: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


/* -------------------------------------------------------
    📌 GET CATEGORY BY ID
    Fetches a single category by its MongoDB ObjectId.
    - Validates ID format
    - Returns 404 if not found
-------------------------------------------------------- */
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logEvent(`Invalid category ID: ${id}`, "warning");
            return handleResponse(res, 400, false, "Invalid category ID");
        }

        const category = await Category.findById(id);

        if (!category) {
            logEvent(`Category not found: ${id}`, "warning");
            return handleResponse(res, 404, false, "Category not found");
        }

        logEvent(`Fetched category: ${category.name}`, "info");
        return handleResponse(res, 200, true, "Category fetched successfully", category);

    } catch (error) {
        logEvent(`Error fetching category: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


/* -------------------------------------------------------
    📌 UPDATE CATEGORY
    Updates category information.
    - Accepts name, description, image
    - Updates image only if uploaded
-------------------------------------------------------- */
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return handleResponse(res, 400, false, "Invalid category ID");
        }

        const updateData = req.body;

        // If new image uploaded → replace image field
        if (req.file) {
            updateData.image = `/uploads/categories/${req.file.filename}`;
        }

        const category = await Category.findByIdAndUpdate(id, updateData, { new: true });

        if (!category) return handleResponse(res, 404, false, "Category not found");

        logEvent(`Category updated: ${category.name}`, "info");
        return handleResponse(res, 200, true, "Category updated successfully", category);

    } catch (error) {
        logEvent(`Error updating category: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


/* -------------------------------------------------------
    📌 DELETE CATEGORY
    Deletes category by ID.
    - Validates ID
    - Removes document from DB
-------------------------------------------------------- */
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return handleResponse(res, 400, false, "Invalid category ID");
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) return handleResponse(res, 404, false, "Category not found");

        logEvent(`Category deleted: ${category.name}`, "warn");

        return handleResponse(res, 200, true, "Category deleted successfully");

    } catch (error) {
        logEvent(`Error deleting category: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};
