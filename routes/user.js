const express = require("express");
const asyncHandler = require("express-async-handler");
const AuthService = require("../middlewares/auth");
const user_controller = require("../controllers/user");
const router = express.Router();

try {
  router
    .get(
      "/",
      AuthService.authenticate_api_key,
      AuthService.authenticate_admin,
      asyncHandler(async (request, _, next) => {
        request.payload = await user_controller.get_all_users();
        next();
      })
    )
    .get(
      "/me",
      AuthService.authenticate_api_key,
      asyncHandler(async (request, _, next) => {
        request.payload = await user_controller.get_current_user_details(
          request.user
        );
        next();
      })
    )
    .get(
      "/confirm/:emailToken",
      asyncHandler(async (request, _, next) => {
        request.payload = await user_controller.verify_user_email_address(
          request.params
        );
        next();
      })
    )
    .post(
      "/resend-verification-token",
      asyncHandler(async (request, _, next) => {
        request.payload = await user_controller.resend_verification_token(
          request.body
        );
        next();
      })
    )
    .post(
      "/create-admin",
      asyncHandler(async (request, _, next) => {
        request.payload = await user_controller.create_admin(
          request.body
        );
        next();
      })
    )
    .post(
      "/login",
      asyncHandler(async (request, _, next) => {
        request.payload = await user_controller.login(request.body);
        next();
      })
    )
    .post(
      "/organization-admin",
      asyncHandler(async (request, _, next) => {
        request.payload = await user_controller.create_organization_admin(
          request.body
        );
        next();
      })
    );
} catch (error) {
  console.log(`[Route Error] /users: ${error.message}`);
} finally {
  module.exports = router;
}
