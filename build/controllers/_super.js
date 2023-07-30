"use strict";
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
var models_1 = __importDefault(require("../database/models"));
/** require all models here */
// const basePath = resolve(__dirname, "../database/models/");
// const files = glob.sync("*.ts", { cwd: basePath });
// files.forEach((file) => {
//   if (file.toLowerCase().includes("_config")) return;
//   require(resolve(basePath, file));
// });
var SuperController = /** @class */ (function () {
    function SuperController() {
    }
    // get_model<T>(model_name: string): Model<T> {
    //   return mongoose.model<T>(model_name);
    // }
    SuperController.prototype.get_model = function (model_name) {
        var Model = models_1.default[model_name];
        if (!Model) {
            throw new Error("Model not found: ".concat(model_name));
        }
        return Model;
    };
    SuperController.prototype.jsonize = function (data) {
        return JSON.parse(JSON.stringify(data));
    };
    SuperController.prototype.get_record_metadata = function (model, _id, time_stamp) {
        return __awaiter(this, void 0, void 0, function () {
            var n;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.countDocuments({ time_stamp: { $lt: time_stamp } })];
                    case 1:
                        n = (_a.sent()) + 1;
                        return [4 /*yield*/, model.updateOne({ _id: _id }, { id: n })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, n];
                }
            });
        });
    };
    SuperController.prototype.check_if_exists = function (model_name, property) {
        return __awaiter(this, void 0, void 0, function () {
            var check;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_model(model_name).findOne(property)];
                    case 1:
                        check = _a.sent();
                        return [2 /*return*/, !!check];
                }
            });
        });
    };
    SuperController.prototype.update_data = function (model_name, conditions, data_to_set) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.get_model(model_name).updateOne(__assign({}, conditions), {
                                $set: __assign({}, data_to_set),
                                // $currentDate: { updated_on: true },
                            }, { upsert: true } // Add the upsert option
                            )];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.jsonize(result)];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, this.process_failed_response((e_1 === null || e_1 === void 0 ? void 0 : e_1.message) || "Unable to update data")];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SuperController.prototype.process_failed_response = function (message, code) {
        if (code === void 0) { code = 400; }
        return {
            error: message,
            payload: null,
            status_code: code,
            success: false,
        };
    };
    SuperController.prototype.process_successful_response = function (payload, code) {
        if (code === void 0) { code = 200; }
        return {
            payload: payload,
            error: null,
            status_code: code,
            success: true,
        };
    };
    return SuperController;
}());
exports.default = SuperController;
