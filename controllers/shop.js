// import express from "express";
import path from "path";
// import upload from "../utils/multer.js";
import Shop from "../models/shop.js";
import ErrorHandler from "../utils/errorHandler.js";
import fs from "fs";
import errorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";
// import catchAsyncError from "../middleware/catchAsyncErrors.js";
// import { isAuthenticated, isSeller } from "../middleware/auth.js";
import sendShopToken from "../utils/sendShopToken.js";
import { createActivationToken } from "../utils/createActivationToken.js";

// const router = express.Router();

// router.post("/create-shop", upload.single("file"),

const registerShop = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, address, zipCode, password } = req.body;

    const sellerEmail = await Shop.findOne({ email });

    if (sellerEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting file" });
        }
      });
      return next(ErrorHandler("User already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const seller = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
      zipCode: zipCode,
      password: password,
      avatar: fileUrl,
    };
    const activationToken = createActivationToken(seller);

    const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;

    try {
      await sendMail({
        email: seller.email,
        subject: "Activation Your Shop",
        message: `Hi ${seller.name}, Please click on the link below to activate your shop: ${activationUrl}`,
      });
      res.status(200).json({
        success: true,
        message: `Please check your email:- ${seller.email} to activate your account`,
      });
    } catch (error) {
      return next(errorHandler(error.message), 500);
    }
  } catch (error) {
    return next(errorHandler(error.message), 400);
  }
};

// const createActivationToken = (user) => {
//   return jwt.sign(user, process.env.ACTIVATION_SECRET, {
//     expiresIn: "5m",
//   });
// };

// router.post(
//   "/activation",
//   catchAsyncError(

const activationShop = async (req, res, next) => {
  try {
    const { activation_token } = req.body;
    const newSeller = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET
    );

    if (!newSeller) {
      return next(errorHandler("Invalid activation token", 400));
    }

    const { name, email, phoneNumber, address, zipCode, password, avatar } =
      newSeller;

    let seller = await Shop.findOne({ email });

    if (seller) {
      return next(ErrorHandler("User already exists", 400));
    }

    seller = await Shop.create({
      name,
      email,
      zipCode,
      address,
      phoneNumber,
      avatar,
      password,
    });

    sendShopToken(seller, 201, res);
  } catch (error) {
    return next(errorHandler(error.message, 500));
  }
};

// router.post(
//   "/login-shop",
//   catchAsyncError(

const loginShop = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(ErrorHandler("Please provide the all fields!", 400));
    }
    const user = await Shop.findOne({ email }).select("+password");
    if (!user) {
      return next(ErrorHandler("User doesn't exist", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(
        ErrorHandler("Invalid password, Please check your paswword!", 400)
      );
    }

    sendShopToken(user, 201, res);
  } catch (error) {
    return next(errorHandler(error.message, 500));
  }
};

// router.get(
//   "/get-shop",
//   isSeller,
//   catchAsyncError(

const getShop = async (req, res, next) => {
  try {
    const seller = await Shop.findById(req.seller.id);

    if (!seller) {
      return next(ErrorHandler("Shop doesn't exist", 400));
    }
    res.status(200).json({
      success: true,
      message: "Get Shop successfully",
      seller,
    });
  } catch (error) {
    return next(ErrorHandler(error.message, 500));
  }
};

const logoutShop = async (req, res) => {
  try {
    res.cookie("seller_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Log out successfully",
    });
  } catch (error) {
    return next(ErrorHandler(error.message, 500));
  }
};

export { registerShop, activationShop, getShop, loginShop, logoutShop };
