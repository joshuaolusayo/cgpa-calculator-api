/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import joi from "@hapi/joi";
joi.objectId = require("joi-objectid")(joi);

export const IdSchema = joi.object({
  id: joi.objectId().required(),
});

export const CourseSchema = joi.array().items(
  joi.object({
    code: joi.string().required(),
    title: joi.string().required(),
    grade: joi.number().required(),
    unit_credit: joi.number().required(),
    semester: joi.number(),
    year: joi.number(),
  })
);

export const SingleCourseSchema = joi.object({
  code: joi.string().required(),
  title: joi.string().required(),
  grade: joi.number().required(),
  unit_credit: joi.number().required(),
  semester: joi.number(),
  year: joi.number(),
});
