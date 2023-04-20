const express = require("express");
const asyncHandler = require("express-async-handler");
const {
  authenticate_admin,
  authenticate_api_key,
} = require("../middlewares/auth");
const user_controller = require("../controllers/user");
const router = express.Router();

try {
  router
    .get(
      "/",
      authenticate_api_key,
      authenticate_admin,
      asyncHandler(async (request, _, next) => {
        request.payload = await user_controller.getAllUsers();
        next();
      })
    )
    .post(
      "/login",
      asyncHandler(async (request, _, next) => {
        request.payload = await user_controller.login(request.body);
        next();
      })
    );
} catch (error) {
  console.log(`[Route Error] /users: ${error.message}`);
} finally {
  module.exports = router;
}
