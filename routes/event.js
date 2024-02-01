import express from "express";
import upload from "../utils/multer.js";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import { createEvent } from "../controllers/event.js";
import { isSeller } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create-product",
  isSeller,
  upload.array("images"),
  catchAsyncError(createEvent)
);

export default router;
