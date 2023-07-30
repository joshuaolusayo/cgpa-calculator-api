"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var handler_1 = __importDefault(require("../middlewares/handler"));
var user_1 = __importDefault(require("./user"));
var course_1 = __importDefault(require("./course"));
var router = express_1.default.Router();
router.use(handler_1.default.setupRequest);
// handle routes here
router.use("/api/v1/users", user_1.default);
router.use("/api/v1/cgpa-calculator", course_1.default);
// handle response
router.use(handler_1.default.processResponse);
// error
router.use(handler_1.default.handle404);
router.use(handler_1.default.handleError);
exports.default = router;
