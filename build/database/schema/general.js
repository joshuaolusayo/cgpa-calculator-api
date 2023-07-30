"use strict";
/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleCourseSchema = exports.CourseSchema = exports.IdSchema = void 0;
var joi_1 = __importDefault(require("@hapi/joi"));
joi_1.default.objectId = require("joi-objectid")(joi_1.default);
exports.IdSchema = joi_1.default.object({
    id: joi_1.default.objectId().required(),
});
exports.CourseSchema = joi_1.default.array().items(joi_1.default.object({
    code: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    grade: joi_1.default.number().required(),
    unit_credit: joi_1.default.number().required(),
    semester: joi_1.default.number(),
    year: joi_1.default.number(),
}));
exports.SingleCourseSchema = joi_1.default.object({
    code: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    grade: joi_1.default.number().required(),
    unit_credit: joi_1.default.number().required(),
    semester: joi_1.default.number(),
    year: joi_1.default.number(),
});
