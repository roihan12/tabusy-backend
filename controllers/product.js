import Product from "../models/product.js";
import Shop from "../models/shop.js";
import errorHandler from "../utils/errorHandler.js";
import fs from "fs";

const createProduct = async (req, res, next) => {
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
      const productData = req.body;
      productData.images = imageUrls;
      productData.shop = shop;

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    }
  } catch (error) {
    return next(errorHandler(error.message, 500), 500);
  }
};

// Get all products of shop
const getProductsByShop = async (req, res, next) => {
  try {
    const products = await Product.find({ shopId: req.params.id });
    if (!products) {
      return next(errorHandler("Shop not found", 404), 404);
    }
    res.status(200).json({
      status: true,
      products,
    });
  } catch (error) {
    return next(errorHandler(error.message, 500), 500);
  }
};

const deleteProductsByShop = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const productData = await Product.findById(productId);

    productData.images.forEach((imageUrl) => {
      const filename = imageUrl;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting file" });
        }
      });
    });

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return next(errorHandler("Product not found", 404), 404);
    }
    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return next(errorHandler(error.message, 500), 500);
  }
};

export { createProduct, getProductsByShop, deleteProductsByShop };
