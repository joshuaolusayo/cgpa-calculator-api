import express, { Request, NextFunction } from "express";
import user_service from "../service/user";
import auth_service from "../middlewares/auth";
const router = express.Router();

router
  .get(
    "/",
    auth_service.authenticate_admin,
    async (request: Request, _, next: NextFunction) => {
      request.payload = await user_service.read_records_by_filter(
        request,
        next
      );
      next();
    }
  )
  .post("/", async (request: Request, _, next: NextFunction) => {
    request.payload = await user_service.create_user(request, next);
    next();
  })
  .post("/login", async (request: Request, _, next: NextFunction) => {
    request.payload = await user_service.login_user(request, next);
    next();
  })
  .get("/:id", async (request, response, next) => {
    request.payload = await user_service.read_record_by_id(request, next);
    next();
  })
  .get("/search/:keys", async (request, response, next) => {
    request.payload = await user_service.read_records_by_wildcard(
      request,
      next
    );
    next();
  })
  .put("/:id", async (request, response, next) => {
    request.payload = await user_service.update_record_by_id(request, next);
    next();
  })
  .delete(
    "/:id",
    auth_service.authenticate_user,
    async (request: Request, _, next: NextFunction) => {
      request.payload = await user_service.delete_record_by_id(request, next);
      next();
    }
  );

export default router;
