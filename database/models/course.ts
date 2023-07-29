import { model, Schema } from "mongoose";

const CourseSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      default: "User123##",
    },
    grade: {
      type: Number,
      required: true,
    },
    unit_credit: {
      type: Number,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
      default: 1,
    },
    year: {
      type: Number,
      required: true,
      default: 1,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    time_stamp: {
      type: Number,
      required: true,
      default: () => Date.now(),
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

model("Course", CourseSchema);
