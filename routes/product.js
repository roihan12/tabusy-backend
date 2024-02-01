import express from "express";
import upload from "../utils/multer.js";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import { createProduct, getProductsByShop,deleteProductsByShop } from "../controllers/product.js";
import { isSeller } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create-product",
  isSeller,
  upload.array("images"),
  catchAsyncError(createProduct)
);
router.get("/get-all-products-shop/:id", catchAsyncError(getProductsByShop));
router.delete("/delete-shop-product/:id",isSeller, catchAsyncError(deleteProductsByShop));

export default router;
