import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path"; 
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";


import userAuthRoutes from "./src/routers/userAuthRoutes.js";
import adminAuthRoutes from "./src/routers/adminAuthRoutes.js";
import adminRoutes from "./src/routers/adminRoutes.js";
import userRoutes from "./src/routers/userRoutes.js";
import categoryRoutes from "./src/routers/categoryRoutes.js";
import brandRoutes from "./src/routers/brandRoutes.js";
import productRoutes from "./src/routers/productRoutes.js";
import wishlistRoutes from "./src/routers/wishListRoutes.js";
import orderRoutes from "./src/routers/userOrderRoutes.js";
import cartRoutes from "./src/routers/cartRoutes.js";
import reviewRoutes from "./src/routers/reviewRoutes.js";

const app = express();
dotenv.config();
connectDB();

app.use((req, res, next) => {
  console.log("📩 Incoming request:", req.method, req.url);
  next();
});

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4000",
      "https://ipwtect-store.vercel.app",
    ], 
    credentials: true,              
  })
);
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);
// 🖼️ Serve uploaded images statically 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));




app.use("/api/user/auth", userAuthRoutes);   // user login/register
app.use("/api/admin/auth", adminAuthRoutes); // admin login/register
app.use("/api/admin", adminRoutes);          // admin-only routes (needs protectMiddleware)
app.use("/api/user", userRoutes);            // user-only routes (needs protectMiddleware)
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server started on port ${PORT}`));
