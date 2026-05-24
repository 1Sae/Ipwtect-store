import Brand from "../../models/brand.js";
import { handleResponse } from "../../middlewares/handleResponse.js";
import { logEvent } from "../../middlewares/logger.js";
import { validateFields, validateAllowedFields } from "../../middlewares/validator.js";
import mongoose from "mongoose";



/* -------------------------------------------------------
    📌 CREATE BRAND
    Creates a new brand with optional uploaded image.
    - Validates required fields (name)
    - Blocks extra fields using validateAllowedFields
    - Checks for duplicate names
    - Saves uploaded image or uses default image
-------------------------------------------------------- */
export const createBrand = async (req, res) => {
    try {
        // 1️⃣ Validate required fields
        const missing = validateFields(["name"], req.body);
        if (missing) return handleResponse(res, 400, false, missing);

        // 2️⃣ Only allow specific fields
        const disallowed = validateAllowedFields(["name", "description"], req.body);
        if (disallowed) return handleResponse(res, 400, false, disallowed);

        const { name, description } = req.body;

        // 3️⃣ Ensure brand does not already exist
        const existing = await Brand.findOne({ name });
        if (existing) return handleResponse(res, 400, false, "Brand already exists");

        // 4️⃣ Use uploaded image or fallback default image
        const image = req.file
            ? `/uploads/brands/${req.file.filename}`
            : "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg";

        // 5️⃣ Create brand
        const brand = await Brand.create({ name, description, image });

        logEvent(`Brand created: ${name}`, "success");
        return handleResponse(res, 201, true, "Brand created successfully", brand);

    } catch (error) {
        logEvent(`Brand creation failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


/* -------------------------------------------------------
    📌 GET ALL BRANDS
    Returns a list of all brands sorted by newest first.
-------------------------------------------------------- */
export const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find().sort({ createdAt: -1 });

        logEvent("Fetched all brands", "info");
        return handleResponse(res, 200, true, "Fetched brands", brands);

    } catch (error) {
        logEvent(`Error fetching brands: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


/* -------------------------------------------------------
    📌 GET BRAND BY ID
    Returns a single brand by its MongoDB ObjectId.
    - Validates ObjectId format
    - Checks if brand exists
-------------------------------------------------------- */
export const getBrandById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate Mongo ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logEvent(`Invalid brand ID: ${id}`, "warning");
            return handleResponse(res, 400, false, "Invalid brand ID");
        }

        const brand = await Brand.findById(id);

        if (!brand) {
            logEvent(`Brand not found: ${id}`, "warning");
            return handleResponse(res, 404, false, "Brand not found");
        }

        logEvent(`Fetched brand: ${brand.name}`, "info");
        return handleResponse(res, 200, true, "Fetched brand", brand);

    } catch (error) {
        logEvent(`Error fetching brand: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


/* -------------------------------------------------------
    📌 UPDATE BRAND
    Updates brand info (name, description, image).
    - Validates ObjectId
    - Updates image only if a new one is uploaded
-------------------------------------------------------- */
export const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID before updating
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return handleResponse(res, 400, false, "Invalid brand ID");
        }

        const updateData = req.body;

        // If new image uploaded → update image field
        if (req.file) {
            updateData.image = `/uploads/brands/${req.file.filename}`;
        }

        const brand = await Brand.findByIdAndUpdate(id, updateData, { new: true });

        if (!brand) return handleResponse(res, 404, false, "Brand not found");

        logEvent(`Brand updated: ${brand.name}`, "info");
        return handleResponse(res, 200, true, "Brand updated successfully", brand);

    } catch (error) {
        logEvent(`Error updating brand: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


/* -------------------------------------------------------
    📌 DELETE BRAND
    Deletes a brand using ObjectId.
    - Validates ObjectId
    - Deletes brand from DB
-------------------------------------------------------- */
export const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return handleResponse(res, 400, false, "Invalid brand ID");
        }

        const brand = await Brand.findByIdAndDelete(id);

        if (!brand) return handleResponse(res, 404, false, "Brand not found");

        logEvent(`Brand deleted: ${brand.name}`, "warn");
        return handleResponse(res, 200, true, "Brand deleted successfully");

    } catch (error) {
        logEvent(`Error deleting brand: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};