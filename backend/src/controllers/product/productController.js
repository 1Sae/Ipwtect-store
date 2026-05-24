import Product from "../../models/product.js";
import Category from "../../models/category.js";
import Brand from "../../models/brand.js";
import { handleResponse } from "../../middlewares/handleResponse.js";
import { logEvent } from "../../middlewares/logger.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

/* =========================================================
    📌 CREATE PRODUCT
    Creates a new product with:
    - Validated name, description, price, brand, category
    - Specifications JSON or array
    - Image URL (already uploaded in /upload route)
    Steps:
        1) Validate fields
        2) Validate category & brand IDs
        3) Parse specifications safely
        4) Save product
========================================================= */
export const createProduct = async (req, res) => {
    try {
        let {
            name,
            description,
            price,
            category,
            brand,
            stock,
            status,
            specifications,
            images,
            discount,
        } = req.body;
    
        if (
            !name ||
            !description ||
            price == null ||
            !category ||
            !brand ||
            stock == null ||
            status == null ||
            discount == null
        ) {
            return handleResponse(res, 400, false, "All fields are required");
        }
    
        const existingCategory = await Category.findById(category);
        if (!existingCategory)
            return handleResponse(res, 400, false, "Category not found");
    
        const existingBrand = await Brand.findById(brand);
        if (!existingBrand)
            return handleResponse(res, 400, false, "Brand not found");
    
        // Parse specifications
        let parsedSpecs = [];
        if (specifications) {
            if (typeof specifications === "string") {
            try {
                parsedSpecs = JSON.parse(specifications);
            } catch {
                return handleResponse(res, 400, false, "Invalid specifications format");
            }
            } else if (Array.isArray(specifications)) {
            parsedSpecs = specifications;
            } else {
            return handleResponse(res, 400, false, "Invalid specifications format");
            }
        }
    
        // Parse images
        let parsedImages = [];
        if (images) {
            if (typeof images === "string") {
            try {
                parsedImages = JSON.parse(images);
            } catch {
                return handleResponse(res, 400, false, "Invalid images format");
            }
            } else if (Array.isArray(images)) {
            parsedImages = images;
            } else {
            return handleResponse(res, 400, false, "Invalid images format");
            }
        }
    
        // Discount validation
        if (discount < 0 || discount > 100) {
            return handleResponse(res, 400, false, "Discount must be between 0 and 100");
        }
    
        // ✅ Apply discount correctly
        const finalPrice =
            discount > 0 ? price - price * (discount / 100) : price;
    
        const product = await Product.create({
            name,
            description,
            price: finalPrice,          // discounted price
            originalPrice: price,       // OPTIONAL but recommended
            discount,
            category,
            brand,
            stock,
            status,
            images: parsedImages,
            image: parsedImages?.[0],
            specifications: parsedSpecs,
        });
    
        logEvent(`Product created: ${name}`, "success");
        return handleResponse(res, 201, true, "Product created successfully", product);
    } catch (error) {
        logEvent(`Product creation failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};  
    

/* =========================================================
    📌 UPDATE PRODUCT
    Updates:
        - name, description, price, category, brand, etc.
        - specifications (string or JSON)
        - image (delete old if replaced)
========================================================= */
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
    
        // Parse specifications
        if (updates.specifications && typeof updates.specifications === "string") {
            try {
            updates.specifications = JSON.parse(updates.specifications);
            } catch {
            return handleResponse(res, 400, false, "Invalid specifications format");
            }
        }
    
        // ✅ Parse images (if provided)
        let nextImages = null;
        if (updates.images) {
            if (typeof updates.images === "string") {
            try {
                nextImages = JSON.parse(updates.images);
            } catch {
                return handleResponse(res, 400, false, "Invalid images format (must be JSON array)");
            }
            } else if (Array.isArray(updates.images)) {
            nextImages = updates.images;
            } else {
            return handleResponse(res, 400, false, "Invalid images format");
            }
        }
    
        const existing = await Product.findById(id);
        if (!existing) return handleResponse(res, 404, false, "Product not found");
    
        // ✅ If images updated: delete removed files
        if (nextImages) {
            const prevImages = Array.isArray(existing.images) ? existing.images : [];
            const removed = prevImages.filter((p) => !nextImages.includes(p));
    
            removed.forEach((imgPath) => {
            if (typeof imgPath === "string" && imgPath.startsWith("uploads/products/")) {
                const abs = path.join(process.cwd(), imgPath); // process.cwd() = backend root
                if (fs.existsSync(abs)) fs.unlinkSync(abs);
            }
            });
    
            updates.images = nextImages;
            // keep main image always synced
            updates.image = nextImages[0] || existing.image;
        }
    
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
        return handleResponse(res, 200, true, "Product updated successfully", updatedProduct);
        } catch (error) {
        logEvent(`Error updating product: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};

/* =========================================================
    📌 GET ALL PRODUCTS
    Returns all products with category & brand populated.
========================================================= */
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("category", "name")
            .populate("brand", "name")
            .sort({ createdAt: -1 });

        logEvent("Fetched all products", "info");
        return handleResponse(res, 200, true, "Fetched products", products);

    } catch (error) {
        logEvent(`Error fetching products: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};



/* =========================================================
    📌 GET PRODUCT BY ID
    Returns a product by its ID.
    Validates ID format.
========================================================= */
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return handleResponse(res, 400, false, "Invalid product ID");
        }

        const product = await Product.findById(id)
            .populate("category", "name")
            .populate("brand", "name");

        if (!product)
            return handleResponse(res, 404, false, "Product not found");
        logEvent(`Fetched product: ${product.name}`, "info");
        return handleResponse(res, 200, true, "Fetched product", product);

    } catch (error) {
        logEvent(`Error fetching product: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


/* =========================================================
    📌 DELETE PRODUCT
    Removes product & deletes its image file if stored locally.
========================================================= */
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product)
            return handleResponse(res, 404, false, "Product not found");

        // Delete local image
        if (product.image && product.image.startsWith("/uploads/products")) {
            const filePath = path.join(process.cwd(), product.image);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        logEvent(`Product deleted: ${product.name}`, "warn");
        return handleResponse(res, 200, true, "Product deleted successfully");

    } catch (error) {
        logEvent(`Error deleting product: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};


/* =========================================================
    📌 GET PRODUCTS BY CATEGORY NAME
    e.g. /api/products/category/laptops
========================================================= */
export const getProductsByCategoryName = async (req, res) => {
    try {
        const { categoryName } = req.params;
        const { minPrice, maxPrice, specs } = req.query;

        if (!categoryName) {
            return handleResponse(res, 400, false, "Category name is required");
        }

        const category = await Category.findOne({
            name: { $regex: `^${categoryName}$`, $options: "i" },
        });

        if (!category) {
            return handleResponse(res, 200, true, "No products found", {
                category: null,
                products: [],
            });
        }

        // 🔥 BASE FILTER
        const filter = {
            category: category._id,
            status: "available"
        };

        // 🔥 PRICE FILTER
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // 🔥 SPECIFICATIONS FILTER
        if (specs) {
            const parsedSpecs = JSON.parse(specs);

            const specsFilters = Object.entries(parsedSpecs).map(([key, values]) => ({
                specifications: {
                    $elemMatch: {
                        key: { $regex: `^${key}$`, $options: "i" },
                        value: {
                            $in: values.map(v => new RegExp(`^${v}$`, "i"))
                        }
                    }
                }
            }));

            filter.$and = specsFilters;
        }

        const products = await Product.find(filter)
            .populate("category", "name")
            .populate("brand", "name");

        return handleResponse(res, 200, true, "Fetched category products", {
            category: {
                _id: category._id,
                name: category.name,
            },
            products,
        });

    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};
    /* =========================================================
        📌 GET PRODUCTS BY BRAND NAME
        e.g. /api/products/brand/asus
    ========================================================= */
export const getProductsByBrandName = async (req, res) => {
        try {
            const { brandName } = req.params;
            const { minPrice, maxPrice, specs } = req.query;
    
            if (!brandName) {
                return handleResponse(res, 400, false, "Brand name is required");
            }
    
            const brand = await Brand.findOne({
                name: { $regex: `^${brandName}$`, $options: "i" },
            });
    
            if (!brand) {
                return handleResponse(res, 200, true, "No products found", {
                    brand: null,
                    products: [],
                });
            }
    
            // 🔥 BASE FILTER
            const filter = {
                brand: brand._id,
                status: "available"
            };
    
            // 🔥 PRICE FILTER
            if (minPrice || maxPrice) {
                filter.price = {};
                if (minPrice) filter.price.$gte = Number(minPrice);
                if (maxPrice) filter.price.$lte = Number(maxPrice);
            }
    
            // 🔥 SPECIFICATIONS FILTER
            if (specs) {
                const parsedSpecs = JSON.parse(specs);
    
                const specsFilters = Object.entries(parsedSpecs).map(([key, values]) => ({
                    specifications: {
                        $elemMatch: {
                            key: { $regex: `^${key}$`, $options: "i" },
                            value: {
                                $in: values.map(v => new RegExp(`^${v}$`, "i"))
                            }
                        }
                    }
                }));
    
                filter.$and = specsFilters;
            }
    
            const products = await Product.find(filter)
                .populate("category", "name")
                .populate("brand", "name");
    
            return handleResponse(res, 200, true, "Fetched brand products", {
                brand: {
                    _id: brand._id,
                    name: brand.name,
                },
                products,
            });
    
        } catch (error) {
            return handleResponse(res, 500, false, "Server error", error.message);
        }
    };
    
    /* =========================================================
        📌 FILTER PRODUCTS BY CATEGORY + BRAND + SPECS + PRICE
        e.g. /api/products/filter?categoryName=laptops&brandName=asus
            &specKey=ram&specValue=32gb
            &minPrice=1000&maxPrice=3000
    
        ✅ Supports MULTIPLE specValue values:
            /api/products/filter?specKey=refreshRate
                &specValue=60&specValue=144&specValue=240
    ========================================================= */
export const filterProductsBySpecs = async (req, res) => {
        try {
            const { categoryName, brandName, specs, minPrice, maxPrice } = req.query;
        
            const filter = { status: "available" };
        
            // CATEGORY
            if (categoryName) {
                const category = await Category.findOne({
                name: { $regex: `^${categoryName}$`, $options: "i" },
                });
        
                if (!category) {
                return handleResponse(res, 200, true, "No products found", {
                    products: [],
                    count: 0,
                });
                }
        
                filter.category = category._id;
            }
        
            // BRAND
            if (brandName) {
                const brand = await Brand.findOne({
                name: { $regex: `^${brandName}$`, $options: "i" },
                });
        
                if (!brand) {
                return handleResponse(res, 200, true, "No products found", {
                    products: [],
                    count: 0,
                });
                }
        
                filter.brand = brand._id;
            }
        
            // PRICE
            if (minPrice || maxPrice) {
                filter.price = {};
                if (minPrice) filter.price.$gte = Number(minPrice);
                if (maxPrice) filter.price.$lte = Number(maxPrice);
            }
        
            // SPECIFICATIONS (MULTIPLE SUPPORT)
            if (specs) {
                const parsedSpecs = JSON.parse(specs);
        
                filter.$and = Object.entries(parsedSpecs).map(([key, values]) => ({
                specifications: {
                    $elemMatch: {
                    key: { $regex: `^${key}$`, $options: "i" },
                    value: {
                        $in: values.map((v) => new RegExp(`^${v}$`, "i")),
                    },
                    },
                },
                }));
            }
        
            const products = await Product.find(filter)
                .populate("category", "name")
                .populate("brand", "name");
        
            return handleResponse(res, 200, true, "Filtered products", {
                products,
                count: products.length,
            });
        
            } catch (error) {
            return handleResponse(res, 500, false, "Server error", error.message);
            }
        };


export const getProductsByStatus = async (req, res) => {
        try {
            const { status } = req.params;
        
            // Validate allowed values
            if (!["available", "unavailable"].includes(status.toLowerCase())) {
                return handleResponse(res, 400, false, "Invalid status value");
            }
        
            const products = await Product.find({ status })
                .populate("category", "name")
                .populate("brand", "name");
        
            return handleResponse(res, 200, true, `Fetched ${status} products`, products);
        } catch (error) {
            logEvent(`Error fetching products by status: ${error.message}`, "error");
            return handleResponse(res, 500, false, "Server error", error.message);
        }
};

export const getLowStockProducts = async (req, res) => {
    try {
        const threshold = 5; // you can make this dynamic later if you want

        const products = await Product.find({ stock: { $lte: threshold } })
            .populate("category", "name")
            .populate("brand", "name");

        return handleResponse(
            res,
            200,
            true,
            `Fetched products with stock <= ${threshold}`,
            products
        );
    } catch (error) {
        logEvent(`Error fetching low stock products: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};  

export const getOutOfStockProducts = async (req, res) => {
    try {
        const products = await Product.find({ stock: 0 })
            .populate("category", "name")
            .populate("brand", "name");
    
        return handleResponse(
            res,
            200,
            true,
            "Fetched out-of-stock products",
            products
    );
    } catch (error) {
        logEvent(`Error fetching out-of-stock products: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};  


export const getTopSellingProducts = async (req, res) => {
    try {
      // default limit = 10 (max 50 for safety)
        const limit = Math.min(Number(req.query.limit) || 10, 50);
    
        const products = await Product.find({
            sold: { $gt: 1 }, // ✅ must be sold at least once
        })
            .sort({ sold: -1 }) // highest sold first
            .limit(limit)
            .populate("category", "name")
            .populate("brand", "name");
    
        return handleResponse(res, 200, true, "Top selling products fetched", {
            count: products.length,
            products,
        });
    } catch (error) {
        logEvent(`Top selling products fetch failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};

export const getTopSellingProductsUser = async (req, res) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 10, 50);
    
        const products = await Product.find({
            sold: { $gt: 1 },
        })
            .sort({ sold: -1 })
            .limit(limit)
            .populate("category", "name")
            .populate("brand", "name");
    
        return handleResponse(res, 200, true, "Top selling products fetched", {
            count: products.length,
            products,
        });
    } catch (error) {
        logEvent(`Top selling products fetch failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
}

export const getNewestProducts = async (req, res) => {
    try {
        const limit = 5;
    
        const products = await Product.find()
            .sort({ createdAt: -1 }) // newest first
            .limit(limit)
            .populate("category", "name")
            .populate("brand", "name");
    
        return handleResponse(res, 200, true, "Newest products fetched", {
            count: products.length,
            products,
        });
    } catch (error) {
        logEvent(`Newest products fetch failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
}

export const getDiscountedProducts = async (req, res) => {
    try {
        const products = await Product.find({ discount: { $gt: 0 } })
            .sort({ discount: -1 }) // highest discount first
            .populate("category", "name")
            .populate("brand", "name");
    
        return handleResponse(res, 200, true, "Discounted products fetched", {
            count: products.length,
            products,
        });
    } catch (error) {
        logEvent(`Discounted products fetch failed: ${error.message}`, "error");
        return handleResponse(res, 500, false, "Server error", error.message);
    }
}

export const getProducts = async (req, res) => {
    try {
        const {
            category,
            brand,
            minPrice,
            maxPrice,
            page = 1,
            limit = 12,
            sort = "newest",
            specs
        } = req.query;

        const filter = {};

        if (category) filter.category = category;
        if (brand) filter.brand = brand;

        // Price filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Specifications filter
        if (specs) {

            const parsedSpecs = JSON.parse(specs);
        
            filter.$and = Object.entries(parsedSpecs).map(([key, values]) => ({
                specifications: {
                    $elemMatch: {
                        key: { $regex: `^${key}$`, $options: "i" },
                        value: {
                            $in: values.map(v => new RegExp(`^${v}$`, "i"))
                        }
                    }
                }
            }));
        
        }

        let sortOption = { createdAt: -1 };

        if (sort === "price_asc") sortOption = { price: 1 };
        if (sort === "price_desc") sortOption = { price: -1 };
        if (sort === "top_selling") sortOption = { sold: -1 };

        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
            .populate("category", "name")
            .populate("brand", "name")
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(filter);

        return handleResponse(res, 200, true, "Products fetched", {
            products,
            total,
            page,
            pages: Math.ceil(total / limit)
        });

    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};
export const getCategorySpecifications = async (req, res) => {
        try {
    
        const { categoryName, brandName } = req.query;
    
        const filter = { status: "available" };
    
        // CATEGORY
        if (categoryName) {
            const category = await Category.findOne({
            name: { $regex: `^${categoryName}$`, $options: "i" }
            });
    
            if (!category) {
            return handleResponse(res, 200, true, "No category found", []);
            }
    
            filter.category = category._id;
        }
    
        // BRAND
        if (brandName) {
            const brand = await Brand.findOne({
            name: { $regex: `^${brandName}$`, $options: "i" }
            });
    
            if (!brand) {
            return handleResponse(res, 200, true, "No brand found", []);
            }
    
            filter.brand = brand._id;
        }
    
        const specs = await Product.aggregate([
            { $match: filter },
    
            { $unwind: "$specifications" },
    
            {
            $group: {
                _id: "$specifications.key",
                values: {
                $addToSet: "$specifications.value"
                }
            }
            },
    
            {
            $project: {
                key: "$_id",
                values: 1,
                _id: 0
            }
            },
    
            { $sort: { key: 1 } }
    
        ]);
    
        logEvent("Fetched dynamic specifications", "info");
    
        return handleResponse(res, 200, true, "Fetched specifications", specs);
    
        } catch (error) {
    
        logEvent(`Error fetching specs: ${error.message}`, "error");
    
        return handleResponse(res, 500, false, "Server error", error.message);
        }
};

export const getSpecsForShopPage = async (req, res) => {
    try {
        const { categoryName, brandName } = req.query;

        const filter = { status: "available" };

        // CATEGORY
        if (categoryName) {
            const category = await Category.findOne({
                name: { $regex: `^${categoryName}$`, $options: "i" }
            });

            if (!category) {
                return handleResponse(res, 200, true, "No specs found", []);
            }

            filter.category = category._id;
        }

        // BRAND
        if (brandName) {
            const brand = await Brand.findOne({
                name: { $regex: `^${brandName}$`, $options: "i" }
            });

            if (!brand) {
                return handleResponse(res, 200, true, "No specs found", []);
            }

            filter.brand = brand._id;
        }

        // 🔥 AGGREGATION
        const specs = await Product.aggregate([
            { $match: filter },

            { $unwind: "$specifications" },

            {
                $group: {
                    _id: "$specifications.key",
                    values: {
                        $addToSet: "$specifications.value"
                    }
                }
            },

            {
                $project: {
                    key: "$_id",
                    values: 1,
                    _id: 0
                }
            },

            { $sort: { key: 1 } }
        ]);

        return handleResponse(res, 200, true, "Fetched shop page specs", specs);

    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};

export const searchForProduct = async (req, res) => {
    try {
        const q = req.query.q;

        const products = await Product.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                },
                },
                { $unwind: "$category" },
            
                {
                $lookup: {
                    from: "brands",
                    localField: "brand",
                    foreignField: "_id",
                    as: "brand",
                },
                },
                { $unwind: "$brand" },
            
                {
                $match: {
                    $or: [
                    { name: { $regex: q, $options: "i" } },
                    { "category.name": { $regex: q, $options: "i" } },
                    { "brand.name": { $regex: q, $options: "i" } },
                    ],
                },
                },
                { $limit: 10 },
            ]);

    return handleResponse(res, 200, true, "Products found", products);
    } catch (error) {
        return handleResponse(res, 500, false, "Server error", error.message);
    }
};