const express = require("express");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const route_handler = require("./routes/_config");

/** 3rd Party Middlewares */
const app = express();
const body_parser = require("body-parser");
const cors = require("cors");

dotenv.config({ path: "./.env" });

connectDatabase();

app.use(cors());
app.use(express.json());
app.use(body_parser.json({ limit: "10mb" }));
app.use(body_parser.urlencoded({ limit: "10mb", extended: true }));
app.use("/", route_handler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server run in port ${PORT}`));
