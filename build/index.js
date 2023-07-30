"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var terminus_1 = require("@godaddy/terminus");
var env_1 = __importDefault(require("./config/env"));
function serverConfig(app, mongoose, serverInit, config) {
    function healthCheck() {
        if (mongoose.connection.readyState === 0 ||
            mongoose.connection.readyState === 3) {
            return Promise.reject(new Error("Mongoose has disconnected"));
        }
        if (mongoose.connection.readyState === 2) {
            return Promise.reject(new Error("Mongoose is connecting"));
        }
        return Promise.resolve();
    }
    function onSignal() {
        console.log("server is starting cleanup");
        return new Promise(function (resolve, reject) {
            mongoose
                .disconnect()
                .then(function () {
                console.info("Mongoose has disconnected");
                resolve();
            })
                .catch(reject);
        });
    }
    function beforeShutdown() {
        return new Promise(function (resolve) {
            setTimeout(resolve, 15000);
        });
    }
    function onShutdown() {
        return Promise.resolve(); // Modify this function as per your cleanup requirements
    }
    function startServer() {
        var terminusOptions = {
            logger: console.log,
            signal: "SIGINT",
            healthChecks: {
                "/healthcheck": healthCheck,
            },
            onSignal: onSignal,
            onShutdown: onShutdown,
            beforeShutdown: beforeShutdown,
        };
        (0, terminus_1.createTerminus)(serverInit, terminusOptions).listen(config.PORT, config.IP, function () {
            console.log("Express server listening on %d, in %s mode", config.PORT, env_1.default.IP);
        });
    }
    return {
        startServer: startServer,
    };
}
exports.default = serverConfig;
