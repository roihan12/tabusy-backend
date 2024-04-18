import Event from "../models/event.js";
import Shop from "../models/shop.js";
import errorHandler from "../utils/errorHandler.js";
import fs from "fs";

const createEvent = async (req, res, next) => {
  try {
    const shopId = req.body.shopId;
    if (req.seller._id.toString() !== shopId.toString()) {
      return next(errorHandler("Unauthorize to create products", 401), 400);
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return next(errorHandler("Shop Id is invalid", 400), 400);
    } else {
      const files = req.files;
      const imageUrls = files.map((file) => `${file.filename}`);
      const eventData = req.body;
      eventData.images = imageUrls;
      eventData.shop = shop;

      const event = await Event.create(eventData);

      res.status(201).json({
        success: true,
        event,
      });
    }
  } catch (error) {
    return next(errorHandler(error.message, 500), 500);
  }
};

// Get all products of shop
const getEventsByShop = async (req, res, next) => {
  try {
    const events = await Event.find({ shopId: req.params.id });
    if (!events) {
      return next(errorHandler("Event not found", 404), 404);
    }
    res.status(200).json({
      status: true,
      events,
    });
  } catch (error) {
    return next(errorHandler(error.message, 500), 500);
  }
};

const deleteEventsByShop = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const eventData = await Event.findById(eventId);

    eventData.images.forEach((imageUrl) => {
      const filename = imageUrl;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting file" });
        }
      });
    });

    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
      return next(errorHandler("Event not found", 404), 404);
    }

    res.status(200).json({
      status: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    return next(errorHandler(error.message, 500), 500);
  }
};

export { createEvent, getEventsByShop, deleteEventsByShop };
