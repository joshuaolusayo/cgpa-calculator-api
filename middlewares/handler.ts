import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status_code?: number;
  error?: string;
}

export default {
  handle404(request: Request, response: Response, next: NextFunction) {
    const return_data = {
      status_code: 404,
      success: false,
      error: "Resource not found",
      payload: null,
    };

    next(return_data);
  },

  handleError(
    error: CustomError,
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    return response.status(error?.status_code || 500).json({
      success: false,
      status_code: error?.status_code || 500,
      error: error?.error || error?.message || "Internal Server Error",
      payload: null,
    });
  },

  processResponse(request: Request, response: Response, next: NextFunction) {
    if (!request.payload) return next();

    const { status_code } = request.payload;
    return response.status(status_code).json(request.payload);
  },

  setupRequest(request: Request, response: Response, next: NextFunction) {
    request.headers["access-control-allow-origin"] = "*";
    request.headers["access-control-allow-headers"] = "*";

    if (request.method === "OPTIONS") {
      request.headers["access-control-allow-methods"] =
        "GET, POST, PUT, PATCH, DELETE";
      response.status(200).json();
    }

    next();
  },
};
