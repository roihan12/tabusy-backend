import Event from "../models/event.js";
import Shop from "../models/shop.js";
import errorHandler from "../utils/errorHandler.js";

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

export {createEvent}