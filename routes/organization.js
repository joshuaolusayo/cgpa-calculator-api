const express = require("express");
const asyncHandler = require("express-async-handler");
const AuthService = require("../middlewares/auth");
const organization_controller = require("../controllers/organization");

const router = express.Router();

try {
  router.put(
    "/:organizationId",
    AuthService.authenticate_api_key,
    // AuthService.authenticate_organization_admin,
    asyncHandler(async (request, _, next) => {
      console.log("hhh");
      request.payload =
        await organization_controller.update_organization_details(request);
      next();
    })
  );
} catch (error) {
  console.log(`[Route Error] /users: ${error.message}`);
} finally {
  module.exports = router;
}
