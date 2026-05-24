import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const brandDir = path.resolve(process.cwd(), "uploads/brands");

if (!fs.existsSync(brandDir)) {
  fs.mkdirSync(brandDir, { recursive: true });
  console.log("📁 Created folder:", brandDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, brandDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueName}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  allowed.test(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only image files are allowed"));
};

const uploadBrand = multer({ storage, fileFilter });

export default uploadBrand;
