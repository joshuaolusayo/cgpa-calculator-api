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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var controllers_1 = __importDefault(require("../controllers"));
var root_1 = __importDefault(require("./root"));
var user_1 = require("../database/schema/user");
var general_1 = require("../utilities/general");
var buildQuery_1 = require("../utilities/buildQuery");
var general_2 = require("../database/schema/general");
var UserService = /** @class */ (function (_super) {
    __extends(UserService, _super);
    function UserService(user_controller) {
        var _this = _super.call(this) || this;
        _this.user_controller = user_controller;
        return _this;
    }
    UserService.prototype.get_all_users = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.user_controller.read_records(null, "email role")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.process_multiple_read_results(result)];
                    case 2:
                        e_1 = _a.sent();
                        next(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.read_record_by_id = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = request.params.id;
                        if (!id) {
                            return [2 /*return*/, this.process_failed_response("Invalid ID supplied.")];
                        }
                        return [4 /*yield*/, this.user_controller.read_records(__assign({ _id: id }, this.standard_query_meta))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.process_single_read(result.data[0])];
                    case 2:
                        e_2 = _a.sent();
                        console.error(e_2, "read_record_by_id");
                        return [2 /*return*/, next(e_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.read_records_by_filter = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = request.query;
                        return [4 /*yield*/, this.handle_database_read(this.user_controller, query, __assign({}, this.standard_query_meta))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.process_multiple_read_results(result)];
                    case 2:
                        e_3 = _a.sent();
                        console.error(e_3, "read_records_by_filter");
                        next(e_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.read_records_by_filter_bulk = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var body, result, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        body = request.body;
                        return [4 /*yield*/, this.handle_database_read(this.user_controller, body, __assign({}, this.standard_query_meta))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.process_multiple_read_results(result)];
                    case 2:
                        e_4 = _a.sent();
                        console.error(e_4, "read_records_by_filter_bulk");
                        next(e_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.read_records_by_wildcard = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var params, query, wildcard_conditions, result, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = request.params, query = request.query;
                        if (!params.keys) {
                            return [2 /*return*/, this.process_failed_response("Invalid key/keyword", 400)];
                        }
                        wildcard_conditions = (0, buildQuery_1.buildWildcardOptions)(params.keys, query.keyword);
                        delete query.keyword;
                        return [4 /*yield*/, this.handle_database_read(this.user_controller, query, __assign(__assign({}, wildcard_conditions), this.standard_query_meta))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.process_multiple_read_results(result)];
                    case 2:
                        e_5 = _a.sent();
                        console.error(e_5, "read_records_by_wildcard");
                        next(e_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.create_user = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var body, error, check_if_exists, result, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        body = request.body;
                        error = user_1.AuthSchema.validate(body).error;
                        if (error)
                            throw new Error(error);
                        return [4 /*yield*/, this.user_controller.check_if_exists("User", { email: body.email })];
                    case 1:
                        check_if_exists = _a.sent();
                        if (check_if_exists) {
                            return [2 /*return*/, this.process_failed_response("User with the email already exists")];
                        }
                        return [4 /*yield*/, this.user_controller.create_record(__assign(__assign({}, body), { role: "admin" }))];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, this.process_single_read(result)];
                    case 3:
                        e_6 = _a.sent();
                        // console.log(e);
                        next(e_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.login_user = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var body, error, _a, email, password, result, user_record, password_is_correct, authentication_token, e_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        body = request.body;
                        error = user_1.AuthSchema.validate(body).error;
                        if (error)
                            throw new Error(error);
                        _a = request.body, email = _a.email, password = _a.password;
                        return [4 /*yield*/, this.user_controller.read_records({
                                email: email,
                            })];
                    case 1:
                        result = _b.sent();
                        if (!(result && result.data.length)) return [3 /*break*/, 3];
                        user_record = result.data[0];
                        return [4 /*yield*/, (0, general_1.check_password_match)(password, user_record.password)];
                    case 2:
                        password_is_correct = _b.sent();
                        if (password_is_correct) {
                            authentication_token = (0, general_1.generate_token)(user_record._id, user_record.email);
                            return [2 /*return*/, this.process_successful_response({
                                    user_record: user_record,
                                    token: authentication_token,
                                })];
                        }
                        _b.label = 3;
                    case 3: return [2 /*return*/, this.process_failed_response("Invalid username or email")];
                    case 4:
                        e_7 = _b.sent();
                        // console.log(e);
                        next(e_7);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.update_record_by_id = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, data, error, new_data, result, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = request.params.id;
                        data = request.body;
                        if (!id) {
                            return [2 /*return*/, this.process_failed_response("Invalid ID supplied.")];
                        }
                        error = general_2.IdSchema.validate({ id: id }).error;
                        if (error)
                            throw new Error(error);
                        new_data = this.delete_record_metadata(data);
                        return [4 /*yield*/, this.user_controller.update_records({ _id: id }, __assign({}, new_data))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.process_update_result(__assign(__assign({}, result), data))];
                    case 2:
                        e_8 = _a.sent();
                        console.error(e_8, "update_record_by_id");
                        next(e_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.update_records = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, options, data, seek_conditions, new_data, result, e_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = request.body, options = _a.options, data = _a.data;
                        seek_conditions = (0, buildQuery_1.buildQuery)(options).seek_conditions;
                        new_data = this.delete_record_metadata(data);
                        return [4 /*yield*/, this.user_controller.update_records(__assign({}, seek_conditions), __assign({}, new_data))];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, this.process_update_result(__assign(__assign({}, new_data), result))];
                    case 2:
                        e_9 = _b.sent();
                        console.error(e_9, "update_records");
                        next(e_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.delete_record_by_id = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error, result, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = request.params.id;
                        if (!id) {
                            return [2 /*return*/, this.process_failed_response("Invalid ID supplied.")];
                        }
                        error = general_2.IdSchema.validate({ id: id }).error;
                        if (error)
                            throw new Error(error);
                        return [4 /*yield*/, this.user_controller.delete_records({
                                _id: id,
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.process_delete_result(result)];
                    case 2:
                        e_10 = _a.sent();
                        next(e_10);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserService;
}(root_1.default));
var ControllerInstance = new controllers_1.default("User");
exports.default = new UserService(ControllerInstance);
