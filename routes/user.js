import express from "express";
import upload from "../utils/multer.js";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import { isAuthenticated } from "../middleware/auth.js";
import {
  registerUsers,
  activationUsers,
  loginUsers,
  getUsers,
  logoutUsers,
} from "../controllers/user.js";

const router = express.Router();

router.post("/create-user", upload.single("file"), registerUsers);
router.post("/activation", catchAsyncError(activationUsers));
router.post("/login-user", catchAsyncError(loginUsers));
router.get("/get-user", isAuthenticated, catchAsyncError(getUsers));
router.get("/logout", isAuthenticated, catchAsyncError(logoutUsers));

export default router;
