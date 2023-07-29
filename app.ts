import express from "express";
import mongoose from "mongoose";

import Environment from "./config/env";
import expressConfig from "./server";
import serverConfig from "./index";
import mongoDbConnection from "./database/connection";
import route_handler from "./routes";

const app = express();
const server = require("http").createServer(app);

// express.js configuration (middlewares etc.)
expressConfig(app);

// server configuration and start
serverConfig(app, mongoose, server, Environment).startServer();

// DB configuration and connection create
mongoDbConnection(mongoose, Environment, {
  autoIndex: false,
  reconnectInterval: 5000,
  connectTimeoutMS: 1000,
}).connectToMongo();

app.use("/", route_handler);

// Expose app
export default app;
