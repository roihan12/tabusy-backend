import Shop from "../models/shop.js";
import errorHandler from "../utils/errorHandler.js";
import CoupounCode from "../models/coupounCode.js";

const createCouponCode = async (req, res, next) => {
  try {
    const shopId = req.body.shopId;
    if (req.seller._id.toString() !== shopId.toString()) {
      return next(errorHandler("Unauthorize to create products", 401), 400);
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return next(errorHandler("Shop Id is invalid", 400), 400);
    } else {
      const isCoupounCodeExist = await CoupounCode.find({
        name: req.body.name,
      });

      if (isCoupounCodeExist) {
        return next(errorHandler("Coupoun code already exists!", 400), 400);
      }

      const coupounCode = await CoupounCode.create(req.body);
      res.status(201).json({
        success: true,
        coupounCode,
      });
    }
  } catch (error) {
    return next(errorHandler(error.message, 500), 500);
  }
};

export { createCouponCode };
