"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var throwIfUndefined = function (name, value) {
    if (!value) {
        throw new Error("".concat(name, " cannot be undefined"));
    }
    return value;
};
exports.default = throwIfUndefined;
