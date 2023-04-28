const jwt = require("jsonwebtoken");
// const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const SuperController = require("../controllers/_super");
// const rootService = new SuperController();

class AuthService extends SuperController {
  constructor() {
    super();
    this.authenticate_api_key = this.authenticate_api_key.bind(this);
  }

  async authenticate_api_key(request, _, next) {
    try {
      const { authorization } = request.headers;
      if (!authorization) {
        return next(this.process_failed_response("Unauthorized", 403));
      }
      const [, api_key] = authorization.split(" ");

      if (!api_key) {
        return next(this.process_failed_response("Unauthorized", 403));
      }

      const userDetails = jwt.verify(api_key, process.env.JWT_SECRET);

      request.user = await this.get_model("User")
        .findById(userDetails.id)
        .select("-password");
      next();
    } catch (e) {
      console.log("failed");
      const failedResponse = this.process_failed_response("Unauthorized", 403);
      return next(failedResponse);
    }
  }

  async authenticate_user(req, res, next) {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        // console.log({ token });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log({ decoded });
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
  }

  authenticate_admin(req, res, next) {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      next(this.process_failed_response("Unauthorized", 403));
    }
  }

  authenticate_organization_admin(req, res, next) {
    if (req.user && req.user.role === "organization_admin") {
      next();
    } else {
      next(this.process_failed_response("Unauthorized", 403));
    }
  }
}

module.exports = new AuthService();
