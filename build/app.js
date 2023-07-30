"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var env_1 = __importDefault(require("./config/env"));
var server_1 = __importDefault(require("./server"));
var index_1 = __importDefault(require("./index"));
var connection_1 = __importDefault(require("./database/connection"));
var routes_1 = __importDefault(require("./routes"));
var app = (0, express_1.default)();
var server = require("http").createServer(app);
// express.js configuration (middlewares etc.)
(0, server_1.default)(app);
// server configuration and start
(0, index_1.default)(app, mongoose_1.default, server, env_1.default).startServer();
// DB configuration and connection create
(0, connection_1.default)(mongoose_1.default, env_1.default, {
    autoIndex: false,
    reconnectInterval: 5000,
    connectTimeoutMS: 1000,
}).connectToMongo();
app.use("/", routes_1.default);
// Expose app
exports.default = app;
