import mongoose from "mongoose";
import UserModel from "./user"; // Import your user model
import CourseModel from "./course"; // Import your course model

// Export all models
export default {
  User: UserModel,
  Course: CourseModel,
  // Add more models here if you have any
};
