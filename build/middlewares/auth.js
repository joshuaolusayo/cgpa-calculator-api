"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var _super_1 = __importDefault(require("../controllers/_super"));
var env_1 = __importDefault(require("../config/env"));
var AuthService = /** @class */ (function (_super) {
    __extends(AuthService, _super);
    function AuthService() {
        var _this = _super.call(this) || this;
        _this.authenticate_api_key = function (request, _, next) { return __awaiter(_this, void 0, void 0, function () {
            var authorization, _a, api_key, userDetails, _b, e_1, failedResponse;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        authorization = request.headers.authorization;
                        if (!authorization) {
                            return [2 /*return*/, next(this.process_failed_response("Unauthorized", 403))];
                        }
                        _a = authorization.split(" "), api_key = _a[1];
                        if (!api_key) {
                            return [2 /*return*/, next(this.process_failed_response("Unauthorized", 403))];
                        }
                        userDetails = jsonwebtoken_1.default.verify(api_key, env_1.default.JWT_SECRET);
                        _b = request;
                        return [4 /*yield*/, this.user
                                .findById(userDetails._id)
                                .select("-password")];
                    case 1:
                        _b.user = _c.sent();
                        next();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _c.sent();
                        failedResponse = this.process_failed_response("Unauthorized", 403);
                        return [2 /*return*/, next(failedResponse)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.optional_authenticate_api_key = function (request, _, next) { return __awaiter(_this, void 0, void 0, function () {
            var authorization, _a, api_key, userDetails, _b, e_2, failedResponse;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        authorization = request.headers.authorization;
                        if (!authorization) {
                            return [2 /*return*/, next()];
                        }
                        _a = authorization.split(" "), api_key = _a[1];
                        if (!api_key) {
                            return [2 /*return*/, next(this.process_failed_response("Unauthorized", 403))];
                        }
                        userDetails = jsonwebtoken_1.default.verify(api_key, env_1.default.JWT_SECRET);
                        _b = request;
                        return [4 /*yield*/, this.user
                                .findById(userDetails._id)
                                .select("-password")];
                    case 1:
                        _b.user = _c.sent();
                        next();
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _c.sent();
                        failedResponse = this.process_failed_response("Unauthorized", 403);
                        return [2 /*return*/, next(failedResponse)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.authenticate_user = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.authenticate_api_key(req, res, function (error) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (error) {
                                        // Handle authentication error
                                        return [2 /*return*/, next(error)];
                                    }
                                    // Check if the authenticated user has the 'user' role
                                    if (req.user) {
                                        next(); // User is authenticated and has 'admin' role, proceed to the next middleware
                                    }
                                    else {
                                        next(this.process_failed_response("Unauthorized", 403)); // User does not have 'admin' role
                                    }
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.authenticate_admin = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.authenticate_api_key(req, res, function (error) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (error) {
                                        // Handle authentication error
                                        return [2 /*return*/, next(error)];
                                    }
                                    // Check if the authenticated user has the 'admin' role
                                    if (req.user && req.user.role === "admin") {
                                        next(); // User is authenticated and has 'admin' role, proceed to the next middleware
                                    }
                                    else {
                                        next(this.process_failed_response("Unauthorized", 403)); // User does not have 'admin' role
                                    }
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.authenticate_api_key = _this.authenticate_api_key.bind(_this);
        _this.user = _this.get_model("User");
        return _this;
    }
    return AuthService;
}(_super_1.default));
exports.default = new AuthService();
