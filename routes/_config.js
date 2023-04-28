/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/
const router = require("express").Router();

const {
  handle_404,
  handle_error,
  setup_request,
  process_response,
} = require("../middlewares/http");

/** Route Handlers */

const user_route_handler = require("./user");
const organization_route_handler = require("./organization");

router.use(setup_request);
router.use("/api/users", user_route_handler);
router.use("/api/organizations", organization_route_handler);
router.use(process_response);
router.use(handle_404);
router.use(handle_error);

module.exports = router;
