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
// const { authenticate_user } = require("../middlewares/auth");

/** Route Handlers */
const user_route_handler = require("./user");

/** Cross Origin Handling */
router.use(setup_request);
router.use("/users", user_route_handler);
router.use(process_response);
router.use(handle_404);
router.use(handle_error);

module.exports = router;
