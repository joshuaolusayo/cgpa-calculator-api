"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var env_1 = __importDefault(require("./env"));
var uri = env_1.default.MONGO_URI;
var connectDatabase = function () {
    (0, mongoose_1.connect)(uri)
        .then(function () {
        console.info("connected");
        console.log("Connected to MongoDB");
        // Start your Express server or perform other operations
    })
        .catch(function (error) {
        console.error(error);
        console.error("Failed to connect to MongoDB", error);
    });
};
exports.default = connectDatabase;
