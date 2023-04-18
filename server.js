const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./config/mongoDb");
// const ImportData = require("./DataImport");
// import productRoute from "./Routes/ProductRoutes.js";
// const { errorHandler, notFound } = require("./middlewares/errors");
// const userRouter = require("./routes/user");
const route_handler = require("./routes/_config");
/** 3rd Party Middlewares */
const app = express();
const body_parser = require("body-parser");
const cors = require("cors");

dotenv.config({ path: "./.env" });

connectDatabase();

/** Routes Configuration */

// API
// app.use("/api/import", ImportData);
// app.use("/api/users", userRouter);

app.use(cors());
app.use(express.json());
app.use(body_parser.json({ limit: "10mb" }));
app.use(body_parser.urlencoded({ limit: "10mb", extended: true }));
app.use("/", route_handler);

// ERROR HANDLER
// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`server run in port ${PORT}`));
