const express = require("express");
const asyncHandler = require("express-async-handler");
const AuthService = require("../middlewares/auth");
const password_controller = require("../controllers/password");
const router = express.Router();

try {
  router
    .post(
      "/",
      asyncHandler(async (request, _, next) => {
        request.payload = await password_controller.send_reset_password_link(
          request
        );
        next();
      })
    )
    .post(
      "/reset",
      asyncHandler(async (request, _, next) => {
        request.payload = await password_controller.reset_password(request);
        next();
      })
    )
    .post(
      "/update",
      AuthService.authenticate_api_key,
      asyncHandler(async (request, _, next) => {
        request.payload = await password_controller.update_password(request);
        next();
      })
    )
    .post(
      "/reset-staff-password",
      AuthService.authenticate_api_key,
      asyncHandler(async (request, _, next) => {
        request.payload = await password_controller.reset_staff_password(
          request
        );
        next();
      })
    );
} catch (error) {
  console.log(`[Route Error] /users: ${error.message}`);
} finally {
  module.exports = router;
}
