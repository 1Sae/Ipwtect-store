import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Always resolve to backend/uploads/categories
const categoryDir = path.resolve(process.cwd(), "uploads/categories");

// Ensure directory exists
if (!fs.existsSync(categoryDir)) {
  fs.mkdirSync(categoryDir, { recursive: true });
  console.log("📁 Created folder:", categoryDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📂 Saving category image to:", categoryDir);
    cb(null, categoryDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  allowed.test(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only image files are allowed"));
};

const uploadCategory = multer({ storage, fileFilter });
export default uploadCategory;
