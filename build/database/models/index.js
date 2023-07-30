"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __importDefault(require("./user")); // Import your user model
var course_1 = __importDefault(require("./course")); // Import your course model
// Export all models
exports.default = {
    User: user_1.default,
    Course: course_1.default,
    // Add more models here if you have any
};
