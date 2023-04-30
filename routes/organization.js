const express = require("express");
const asyncHandler = require("express-async-handler");
const AuthService = require("../middlewares/auth");
const organization_controller = require("../controllers/organization");

const router = express.Router();

try {
  router
    .put(
      "/:organizationId",
      AuthService.authenticate_api_key,
      AuthService.authenticate_organization_admin,
      asyncHandler(async (request, _, next) => {
        request.payload =
          await organization_controller.update_organization_details(request);
        next();
      })
    )
    .post(
      "/add-staff",
      AuthService.authenticate_api_key,
      AuthService.authenticate_organization_admin,
      asyncHandler(async (request, _, next) => {
        request.payload =
          await organization_controller.add_user_to_organization(request);
        next();
      })
    );
} catch (error) {
  console.log(`[Route Error] /users: ${error.message}`);
} finally {
  module.exports = router;
}
