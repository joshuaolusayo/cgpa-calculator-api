const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const SuperController = require("../controllers/_super");
const rootService = new SuperController();

const authenticate_api_key = async (request, __, next) => {
  try {
    const { authorization } = request.headers;
    if (!authorization) {
      return next(process_failed_response("Unauthorized", 403));
    }
    const [, api_key] = authorization.split(" ");

    if (!api_key) {
      return next(rootService.process_failed_response("Unauthorized", 403));
    }

    const decoded = jwt.verify(api_key, process.env.JWT_SECRET);

    request.user = await rootService
      .get_model("User")
      .findById(decoded.id)
      .select("-password");
    next();
  } catch (e) {
    logger.error(e.message, "authenticate_api_key");
    next(rootService.process_failed_response("Unauthorized", 403));
  }
};

const authenticate_user = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log({ token });
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log({ decoded });
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const authenticate_admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(rootService.process_failed_response("Unauthorized", 403));
  }
};

module.exports = {
  authenticate_api_key,
  authenticate_user,
  authenticate_admin,
};
