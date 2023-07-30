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
var general_1 = require("../database/schema/general");
// import { check_password_match, generate_token } from "../utilities/general";
var buildQuery_1 = require("../utilities/buildQuery");
var general_2 = require("../database/schema/general");
var UserService = /** @class */ (function (_super) {
    __extends(UserService, _super);
    function UserService(course_controller, user_controller) {
        var _this = _super.call(this) || this;
        _this.user_controller = user_controller;
        _this.course_controller = course_controller;
        return _this;
    }
    UserService.prototype.calculate_cgpa = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var current_user, grades, error, totalCredits, totalGradePoints, _i, grades_1, grade, creditUnit, unitCredit, existing_course, updated_course, new_course, cgpa, info, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        current_user = request === null || request === void 0 ? void 0 : request.user;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        grades = request.body;
                        error = general_1.CourseSchema.validate(grades).error;
                        if (error)
                            throw new Error(error);
                        totalCredits = 0;
                        totalGradePoints = 0;
                        _i = 0, grades_1 = grades;
                        _a.label = 2;
                    case 2:
                        if (!(_i < grades_1.length)) return [3 /*break*/, 8];
                        grade = grades_1[_i];
                        creditUnit = grade.unit_credit;
                        unitCredit = this.get_course_credits(grade.grade, creditUnit);
                        totalCredits += creditUnit;
                        totalGradePoints += unitCredit;
                        if (!current_user) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.course_controller.read_records({
                                code: grade.code,
                                user: current_user._id,
                            })];
                    case 3:
                        existing_course = _a.sent();
                        if (!(existing_course.data.length > 0)) return [3 /*break*/, 5];
                        updated_course = {
                            //   ...existing_course.data[0],
                            title: grade.title,
                            grade: grade.grade,
                            unit_credit: grade.unit_credit,
                            semester: grade.semester,
                            year: grade.year,
                            user: current_user._id,
                        };
                        return [4 /*yield*/, this.course_controller.update_records({
                                code: grade.code,
                                user: current_user._id,
                            }, updated_course)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        new_course = {
                            code: grade.code,
                            title: grade.title,
                            grade: grade.grade,
                            unit_credit: grade.unit_credit,
                            semester: grade.semester,
                            year: grade.year,
                            user: current_user._id,
                        };
                        return [4 /*yield*/, this.course_controller.create_record(new_course)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8:
                        cgpa = totalGradePoints / totalCredits;
                        info = this.get_class(cgpa);
                        return [2 /*return*/, this.process_successful_response(__assign({ cgpa: cgpa, message: "Successfully calculated result" }, info))];
                    case 9:
                        e_1 = _a.sent();
                        next(e_1);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.fetch_and_calculate_cgpa = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var current_user, courses, totalCredits, totalGradePoints, _i, _a, course, creditUnit, unitCredit, cgpa, info, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        current_user = request.user;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.course_controller.read_records(__assign({ user: current_user._id }, this.standard_query_meta))];
                    case 2:
                        courses = _b.sent();
                        if (courses.data.length === 0) {
                            throw new Error("No courses found for the user");
                        }
                        totalCredits = 0;
                        totalGradePoints = 0;
                        for (_i = 0, _a = courses.data; _i < _a.length; _i++) {
                            course = _a[_i];
                            creditUnit = course.unit_credit;
                            unitCredit = this.get_course_credits(course.grade, creditUnit);
                            totalCredits += creditUnit;
                            totalGradePoints += unitCredit;
                        }
                        cgpa = parseFloat(Number(totalGradePoints / totalCredits).toFixed(2));
                        info = this.get_class(cgpa);
                        return [2 /*return*/, this.process_successful_response(__assign({ cgpa: cgpa, message: "Successfully calculated result" }, info))];
                    case 3:
                        e_2 = _b.sent();
                        next(e_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.create_new_course = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var body, user, error, check_if_exists, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = request.body, user = request.user;
                        console.log(user);
                        error = general_1.SingleCourseSchema.validate(body).error;
                        if (error)
                            throw new Error(error);
                        return [4 /*yield*/, this.course_controller.check_if_exists("Course", __assign({ code: body.code, user: user._id }, this.standard_query_meta))];
                    case 1:
                        check_if_exists = _a.sent();
                        if (check_if_exists) {
                            return [2 /*return*/, this.process_failed_response("Course with the course code already exists")];
                        }
                        return [4 /*yield*/, this.course_controller.create_record(__assign(__assign({}, body), { user: user._id }))];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, this.process_single_read(result)];
                }
            });
        });
    };
    UserService.prototype.get_course_credits = function (grade, credit_unit) {
        var unit_credit = 0;
        if (grade >= 70) {
            unit_credit = 5.0;
        }
        else if (grade >= 60) {
            unit_credit = 4.0;
        }
        else if (grade >= 50) {
            unit_credit = 3.0;
        }
        else if (grade >= 45) {
            unit_credit = 2.0;
        }
        else if (grade >= 40) {
            unit_credit = 1.0;
        }
        else {
            unit_credit = 0;
        }
        return unit_credit * credit_unit;
    };
    UserService.prototype.get_class = function (cgpa) {
        var result = { current_class: "", comment: "" };
        if (cgpa >= 4.5) {
            result = {
                current_class: "First Class",
                comment: "You've done well. Keep it up",
            };
        }
        else if (cgpa >= 3.5) {
            result = {
                current_class: "Second Class Upper",
                comment: "You're doing well. You're just ".concat((4.5 - cgpa).toFixed(2), " point from being in first class"),
            };
        }
        else if (cgpa >= 2.5) {
            result = {
                current_class: "Second Class Lower",
                comment: "You're doing well. You're just ".concat((3.5 - cgpa).toFixed(2), " point from being in second class upper"),
            };
        }
        else if (cgpa >= 1.5) {
            result = {
                current_class: "Third Class",
                comment: "You're doing well. You're just ".concat((2.5 - cgpa).toFixed(2), " point from being in second class lower"),
            };
        }
        else if (cgpa >= 1.0) {
            result = {
                current_class: "Pass",
                comment: "You're just ".concat((1.5 - cgpa).toFixed(2), " point from being in third class"),
            };
        }
        else {
            result = {
                current_class: "Failed",
                comment: "You need to put in more effort. See your level adviser for immediate help",
            };
        }
        return result;
    };
    UserService.prototype.get_user_courses = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                query = "user=".concat(request.user._id);
                request.query = query;
                return [2 /*return*/, this.read_records_by_filter(request, next)];
            });
        });
    };
    UserService.prototype.read_record_by_id = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, result, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = request.params.id;
                        if (!id) {
                            return [2 /*return*/, this.process_failed_response("Invalid ID supplied.")];
                        }
                        return [4 /*yield*/, this.course_controller.read_records(__assign({ _id: id, user: request.user._id }, this.standard_query_meta))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.process_single_read(result.data[0])];
                    case 2:
                        e_3 = _a.sent();
                        console.error(e_3, "read_record_by_id");
                        return [2 /*return*/, next(e_3)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.read_records_by_filter = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var current_user, query, result, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        current_user = request === null || request === void 0 ? void 0 : request.user;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        query = request.query;
                        query.user = current_user._id;
                        return [4 /*yield*/, this.handle_database_read(this.course_controller, query, __assign({}, this.standard_query_meta))];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, this.process_multiple_read_results(result)];
                    case 3:
                        e_4 = _a.sent();
                        console.error(e_4, "read_records_by_filter");
                        next(e_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.read_records_by_filter_bulk = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var body, result, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        body = request.body;
                        return [4 /*yield*/, this.handle_database_read(this.course_controller, body, __assign({}, this.standard_query_meta))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.process_multiple_read_results(result)];
                    case 2:
                        e_5 = _a.sent();
                        console.error(e_5, "read_records_by_filter_bulk");
                        next(e_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.read_records_by_wildcard = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var params, query, wildcard_conditions, result, e_6;
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
                        return [4 /*yield*/, this.handle_database_read(this.course_controller, query, __assign(__assign({}, wildcard_conditions), this.standard_query_meta))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.process_multiple_read_results(result)];
                    case 2:
                        e_6 = _a.sent();
                        console.error(e_6, "read_records_by_wildcard");
                        next(e_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.update_record_by_id = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, data, error, new_data, result, e_7;
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
                        return [4 /*yield*/, this.course_controller.update_records({ _id: id }, __assign({}, new_data))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.process_update_result(__assign(__assign({}, result), data))];
                    case 2:
                        e_7 = _a.sent();
                        console.error(e_7, "update_record_by_id");
                        next(e_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.update_records = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, options, data, seek_conditions, new_data, result, e_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = request.body, options = _a.options, data = _a.data;
                        seek_conditions = (0, buildQuery_1.buildQuery)(options).seek_conditions;
                        new_data = this.delete_record_metadata(data);
                        return [4 /*yield*/, this.course_controller.update_records(__assign({}, seek_conditions), __assign({}, new_data))];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, this.process_update_result(__assign(__assign({}, new_data), result))];
                    case 2:
                        e_8 = _b.sent();
                        console.error(e_8, "update_records");
                        next(e_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.delete_record_by_id = function (request, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user, id, error, result, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = request.user;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        id = request.params.id;
                        if (!id) {
                            return [2 /*return*/, this.process_failed_response("Invalid ID supplied.")];
                        }
                        error = general_2.IdSchema.validate({ id: id }).error;
                        if (error)
                            throw new Error(error);
                        return [4 /*yield*/, this.course_controller.delete_records({
                                _id: id,
                                user: user._id,
                            })];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, this.process_delete_result(result)];
                    case 3:
                        e_9 = _a.sent();
                        next(e_9);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return UserService;
}(root_1.default));
var user_controller = new controllers_1.default("User");
var course_controller = new controllers_1.default("Course");
exports.default = new UserService(course_controller, user_controller);
