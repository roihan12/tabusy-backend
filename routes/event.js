import express from "express";
import upload from "../utils/multer.js";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import { createEvent, deleteEventsByShop, getEventsByShop } from "../controllers/event.js";
import { isSeller } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create-event",
  isSeller,
  upload.array("images"),
  catchAsyncError(createEvent)
);
router.get("/get-all-events-shop/:id", catchAsyncError(getEventsByShop));
router.delete("/delete-shop-event/:id",isSeller, catchAsyncError(deleteEventsByShop));

export default router;
