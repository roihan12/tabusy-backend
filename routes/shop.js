import express from "express";
import upload from "../utils/multer.js";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import {
  getShop,
  registerShop,
  activationShop,
  loginShop,
  logoutShop,
} from "../controllers/shop.js";
import { isSeller } from "../middleware/auth.js";
const router = express.Router();

router.post("/create-shop", upload.single("file"), registerShop);
router.post("/activation", catchAsyncError(activationShop));
router.post("/login-shop", catchAsyncError(loginShop));
router.get("/get-shop", isSeller, catchAsyncError(getShop));
router.get("/logout-shop", isSeller, catchAsyncError(logoutShop));

export default router;
