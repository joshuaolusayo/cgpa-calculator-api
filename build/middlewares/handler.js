"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    handle404: function (request, response, next) {
        var return_data = {
            status_code: 404,
            success: false,
            error: "Resource not found",
            payload: null,
        };
        next(return_data);
    },
    handleError: function (error, request, response, next) {
        return response.status((error === null || error === void 0 ? void 0 : error.status_code) || 500).json({
            success: false,
            status_code: (error === null || error === void 0 ? void 0 : error.status_code) || 500,
            error: (error === null || error === void 0 ? void 0 : error.error) || (error === null || error === void 0 ? void 0 : error.message) || "Internal Server Error",
            payload: null,
        });
    },
    processResponse: function (request, response, next) {
        if (!request.payload)
            return next();
        var status_code = request.payload.status_code;
        return response.status(status_code).json(request.payload);
    },
    setupRequest: function (request, response, next) {
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
