const express = require("express");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const {
  authenticate_user,
  authenticate_admin,
} = require("../middlewares/auth");
const generateToken = require("../utilities/generateToken");
const User = require("./../models/user");
const Token = require("./../models/token");
const UserController = require("../controllers/user");

const userRouter = express.Router();

// LOGIN
userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        message: "Successfully registered",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        createdAt: user.createdAt,
        status: 200,
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  })
);

userRouter.post(
  "/",
  asyncHandler((req, _, next) => {
    UserController.create_user(req.body);
    next();
  })
);

// VERIFY USER EMAIL ADDRESS
userRouter.get(
  "/confirm/:emailToken",
  asyncHandler(async (req, res) => {
    // Find the token associated with the email confirmation link
    const token = await Token.findOne({ token: req.params.emailToken });
    if (!token) {
      res.status(404);
      throw new Error("Invalid or expired confirmation link.");
    }

    // Find the user associated with the token
    const user = await User.findById(token._userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's verification status and save to the database
    user.isVerified = true;
    await user.save();

    // Delete the token from the database
    await token.deleteOne();

    // Send a success response
    res.status(200).json({
      message: "Email address verified successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
    });
  })
);

// RESEND EMAIL TOKEN
userRouter.post(
  "/resend-email-token",
  authenticate_user,
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "This account has already been verified" });
    }

    const verificationToken = await Token.create({
      _userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });

    res.status(200).json({
      message: "Verification email has been resent.",
      verificationToken: verificationToken.token,
      token: generateToken(user._id),
    });
  })
);

// GET USER PROFILE
userRouter.get(
  "/profile",
  authenticate_user,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// UPDATE PROFILE
userRouter.put(
  "/profile",
  authenticate_user,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// GET ALL USER ADMIN
userRouter.get(
  "/",
  authenticate_user,
  authenticate_admin,
  asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
  })
);

userRouter.delete(
  "/:id",
  authenticate_user,
  authenticate_admin,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("user not Found");
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully", status: 200 });
  })
);

module.exports = userRouter;

// REGISTER
// userRouter.post(
//   "/",
//   asyncHandler(async (req, res) => {
//     const { name, email, password } = req.body;
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       res.status(400);
//       throw new Error("User already exists");
//     }
//     const user = await User.create({
//       name,
//       email,
//       password,
//     });
//     if (user) {
//       const verificationToken = await Token.create({
//         _userId: user._id,
//         token: crypto.randomBytes(32).toString("hex"),
//       });
//       // console.log(token);
//       res.status(201).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         verificationToken: verificationToken.token,
//         status: 201,
//         // token: generateToken(user._id),
//       });
//     } else {
//       res.status(400);
//       throw new Error("Invalid User Data");
//     }
//   })
// );
