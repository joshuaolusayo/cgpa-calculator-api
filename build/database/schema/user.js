"use strict";
/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdSchema = exports.AuthSchema = void 0;
var joi_1 = __importDefault(require("@hapi/joi"));
joi_1.default.objectId = require('joi-objectid')(joi_1.default);
exports.AuthSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required()
});
exports.UserIdSchema = joi_1.default.object({
    id: joi_1.default.objectId().required()
});
