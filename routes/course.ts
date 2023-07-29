import express, { Request, NextFunction } from "express";
import course_service from "../service/course";
import auth_service from "../middlewares/auth";
const router = express.Router();

router
  .get(
    "/courses",
    auth_service.authenticate_api_key,
    async (request: Request, _, next: NextFunction) => {
      request.payload = await course_service.read_records_by_filter(
        request,
        next
      );
      next();
    }
  )
  .post(
    "/",
    auth_service.optional_authenticate_api_key,
    async (request: Request, _, next: NextFunction) => {
      request.payload = await course_service.calculate_cgpa(request, next);
      next();
    }
  )
  .post(
    "/courses/new",
    auth_service.authenticate_api_key,
    async (request: Request, _, next: NextFunction) => {
      request.payload = await course_service.create_new_course(request, next);
      next();
    }
  )
  .get(
    "/result",
    auth_service.authenticate_api_key,
    async (request: Request, _, next: NextFunction) => {
      request.payload = await course_service.fetch_and_calculate_cgpa(
        request,
        next
      );
      next();
    }
  )
  .get(
    "/courses/:id",
    auth_service.authenticate_api_key,
    async (request, response, next) => {
      request.payload = await course_service.read_record_by_id(request, next);
      next();
    }
  )
  .put(
    "/courses/:id",
    auth_service.authenticate_api_key,
    async (request, response, next) => {
      request.payload = await course_service.update_record_by_id(request, next);
      next();
    }
  )
  .delete(
    "/courses/:id",
    auth_service.authenticate_user,
    async (request: Request, _, next: NextFunction) => {
      request.payload = await course_service.delete_record_by_id(request, next);
      next();
    }
  );

export default router;
