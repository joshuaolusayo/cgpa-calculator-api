import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import SuperController from "../controllers/_super";
import Environment from "../config/env";
import { CustomRequest } from "@/utilities/interface";

class AuthService extends SuperController {
  user;
  constructor() {
    super();
    this.authenticate_api_key = this.authenticate_api_key.bind(this);
    this.user = this.get_model("User");
  }

  authenticate_api_key = async (
    request: CustomRequest,
    _: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { authorization } = request.headers;
      if (!authorization) {
        return next(this.process_failed_response("Unauthorized", 403));
      }
      const [, api_key] = authorization.split(" ");

      if (!api_key) {
        return next(this.process_failed_response("Unauthorized", 403));
      }

      const userDetails = jwt.verify(api_key, Environment.JWT_SECRET as string);

      request.user = await this.user
        .findById(userDetails._id)
        .select("-password");
      next();
    } catch (e) {
      const failedResponse = this.process_failed_response("Unauthorized", 403);
      return next(failedResponse);
    }
  };

  optional_authenticate_api_key = async (
    request: CustomRequest,
    _: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { authorization } = request.headers;
      if (!authorization) {
        return next();
      }
      const [, api_key] = authorization.split(" ");

      if (!api_key) {
        return next(this.process_failed_response("Unauthorized", 403));
      }

      const userDetails = jwt.verify(api_key, Environment.JWT_SECRET as string);

      request.user = await this.user
        .findById(userDetails._id)
        .select("-password");
      next();
    } catch (e) {
      const failedResponse = this.process_failed_response("Unauthorized", 403);
      return next(failedResponse);
    }
  };

  authenticate_user = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.authenticate_api_key(req, res, async (error) => {
        if (error) {
          // Handle authentication error
          return next(error);
        }

        if (req.user) {
          next();
        } else {
          next(this.process_failed_response("Unauthorized", 403));
        }
      });
    } catch (error) {}
  };

  authenticate_admin = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.authenticate_api_key(req, res, async (error) => {
        if (error) {
          // Handle authentication error
          return next(error);
        }

        // Check if the authenticated user has the 'admin' role
        if (req.user && req.user.role === "admin") {
          next(); // User is authenticated and has 'admin' role, proceed to the next middleware
        } else {
          next(this.process_failed_response("Unauthorized", 403)); // User does not have 'admin' role
        }
      });
    } catch (error) {}
  };
}

export default new AuthService();
