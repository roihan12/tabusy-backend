// import express from "express";
import path from "path";
// import upload from "../utils/multer.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import fs from "fs";
import errorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";
// import catchAsyncError from "../middleware/catchAsyncErrors.js";
import sendToken from "../utils/jwtToken.js";
// import { isAuthenticated } from "../middleware/auth.js";
import { createActivationToken } from "../utils/createActivationToken.js";

// const router = express.Router();

// router.post("/create-user", upload.single("file"),

const registerUsers = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
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

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
    };
    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:5173/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Account Activation",
        message: `Hi ${user.name}, Please click on the link below to activate your account: ${activationUrl}`,
      });
      res.status(200).json({
        success: true,
        message: `Please check your email:- ${user.email} to activate your account`,
      });
    } catch (error) {
      return next(errorHandler(error.message), 500);
    }
  } catch (error) {
    return next(errorHandler(error.message), 500);
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

const activationUsers = async (req, res, next) => {
  try {
    const { activation_token } = req.body;
    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

    if (!newUser) {
      return next(errorHandler("Invalid activation token", 400));
    }

    const { name, email, password, avatar } = newUser;

    let user = await User.findOne({ email });

    if (user) {
      return next(ErrorHandler("User already exists", 400));
    }

    user = await User.create({
      name,
      email,
      avatar,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    return next(errorHandler(error.message, 500));
  }
};

// router.post(
//   "/login-user",
//   catchAsyncError(

const loginUsers = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(ErrorHandler("Please provide the all fields!", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(ErrorHandler("User doesn't exist", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(
        ErrorHandler("Invalid password, Please check your paswword!", 400)
      );
    }

    sendToken(user, 201, res);
  } catch (error) {
    return next(errorHandler(error.message, 500));
  }
};

// router.get(
//   "/get-user",
//   isAuthenticated,
//   catchAsyncError(

const getUsers = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(ErrorHandler("User doesn't exist", 400));
    }
    res.status(200).json({
      success: true,
      message: "Get User successfully",
      user,
    });
  } catch (error) {
    return next(ErrorHandler(error.message, 500));
  }
};

//Logout User
// router.get(
//   "/logout",
//   isAuthenticated,
//   catchAsyncError(

const logoutUsers = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(201).json({
      success: true,
      message: "Log out successfully",
    });
  } catch (error) {
    return next(ErrorHandler(error.message, 500));
  }
};

export { registerUsers, activationUsers, loginUsers, logoutUsers, getUsers };
