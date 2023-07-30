"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var throwIfUndefined_1 = __importDefault(require("./throwIfUndefined"));
require("dotenv/config");
var Environment = {
    MONGO_URI: (0, throwIfUndefined_1.default)("Mongo uri", process.env.MONGO_URI),
    PORT: process.env.PORT || "5000",
    IP: process.env.IP || "0.0.0.0",
    JWT_SECRET: (0, throwIfUndefined_1.default)("JWT Secret", process.env.JWT_SECRET),
};
exports.default = Environment;
