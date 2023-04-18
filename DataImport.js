const express = require("express");
const User = require("./models/user");
const users = require("./data/users");
const asyncHandler = require("express-async-handler");

const ImportData = express.Router();

ImportData.post(
  "/user",
  asyncHandler(async (req, res) => {
    await User.deleteMany({});
    const importUser = await User.insertMany(users);
    res.send({ importUser });
  })
);

module.exports = ImportData;
