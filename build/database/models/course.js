"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var CourseSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        default: "User123##",
    },
    grade: {
        type: Number,
        required: true,
    },
    unit_credit: {
        type: Number,
        required: true,
    },
    semester: {
        type: Number,
        required: true,
        default: 1,
    },
    year: {
        type: Number,
        required: true,
        default: 1,
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true,
    },
    is_deleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    time_stamp: {
        type: Number,
        required: true,
        default: function () { return Date.now(); },
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
}, {
    timestamps: true,
});
var Course = (0, mongoose_1.model)("Course", CourseSchema);
exports.default = Course;
