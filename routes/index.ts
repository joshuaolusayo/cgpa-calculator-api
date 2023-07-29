import express from "express";
import HTTP from "../middlewares/handler";
import user_route from "./user";
import course_route from "./course";

const router = express.Router();

router.use(HTTP.setupRequest);
// handle routes here
router.use("/api/v1/users", user_route);
router.use("/api/v1/cgpa-calculator", course_route);
// handle response
router.use(HTTP.processResponse);
// error
router.use(HTTP.handle404);
router.use(HTTP.handleError);

export default router;
