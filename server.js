const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./config/MongoDb.js");
const ImportData = require("./DataImport.js");
// import productRoute from "./Routes/ProductRoutes.js";
const { errorHandler, notFound } = require("./Middleware/Errors.js");
const userRouter = require("./Routes/UserRoutes.js");

dotenv.config({ path: "./.env" });

connectDatabase();

const app = express();
app.use(express.json());

// API
app.use("/api/import", ImportData);
app.use("/api/users", userRouter);

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`server run in port ${PORT}`));
