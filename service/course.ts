import { NextFunction } from "express";
import Controller from "../controllers";
import RootService from "./root";
import { CourseSchema, SingleCourseSchema } from "../database/schema/general";
// import { check_password_match, generate_token } from "../utilities/general";
import {
  buildQuery as build_query,
  buildWildcardOptions as build_wildcard_options,
} from "../utilities/buildQuery";
import { IdSchema } from "../database/schema/general";
import { CustomRequest } from "@/utilities/interface";

class UserService extends RootService {
  user_controller: Controller;
  course_controller: Controller;

  constructor(course_controller: Controller, user_controller: Controller) {
    super();
    this.user_controller = user_controller;
    this.course_controller = course_controller;
  }

  async calculate_cgpa(request: CustomRequest, next: NextFunction) {
    const current_user = request?.user;
    try {
      const grades = request.body;
      const { error } = CourseSchema.validate(grades);
      if (error) throw new Error(error);
      let totalCredits = 0;
      let totalGradePoints = 0;
      for (const grade of grades) {
        const creditUnit = grade.unit_credit;
        const unitCredit = this.get_course_credits(grade.grade, creditUnit);
        totalCredits += creditUnit;
        totalGradePoints += unitCredit;

        if (current_user) {
          // Check if the course already exists in the database
          const existing_course = await this.course_controller.read_records({
            code: grade.code,
            user: current_user._id,
          });

          if (existing_course.data.length > 0) {
            const updated_course = {
              //   ...existing_course.data[0],
              title: grade.title,
              grade: grade.grade,
              unit_credit: grade.unit_credit,
              semester: grade.semester,
              year: grade.year,
              user: current_user._id,
            };

            await this.course_controller.update_records(
              {
                code: grade.code,
                user: current_user._id,
              },
              updated_course
            );
          } else {
            // The course does not exist, so save it as a new entry
            const new_course = {
              code: grade.code,
              title: grade.title,
              grade: grade.grade,
              unit_credit: grade.unit_credit,
              semester: grade.semester,
              year: grade.year,
              user: current_user._id,
            };

            await this.course_controller.create_record(new_course);
          }
        }
      }
      const cgpa = totalGradePoints / totalCredits;
      const info = this.get_class(cgpa);

      return this.process_successful_response({
        cgpa,
        message: "Successfully calculated result",
        ...info,
      });
    } catch (e) {
      next(e);
    }
  }

  async fetch_and_calculate_cgpa(request: CustomRequest, next: NextFunction) {
    const current_user = request.user;
    try {
      const courses = await this.course_controller.read_records({
        user: current_user._id,
        ...this.standard_query_meta,
      });

      if (courses.data.length === 0) {
        throw new Error("No courses found for the user");
      }

      let totalCredits = 0;
      let totalGradePoints = 0;

      for (const course of courses.data) {
        const creditUnit = course.unit_credit;
        const unitCredit = this.get_course_credits(course.grade, creditUnit);
        totalCredits += creditUnit;
        totalGradePoints += unitCredit;
      }

      const cgpa = parseFloat(
        Number(totalGradePoints / totalCredits).toFixed(2)
      );
      const info = this.get_class(cgpa);

      return this.process_successful_response({
        cgpa,
        message: "Successfully calculated result",
        ...info,
      });
    } catch (e) {
      next(e);
    }
  }

  async create_new_course(request: CustomRequest, next: NextFunction) {
    const { body, user } = request;
    console.log(user);
    const { error } = SingleCourseSchema.validate(body);
    if (error) throw new Error(error);

    const check_if_exists = await this.course_controller.check_if_exists(
      "Course",
      {
        code: body.code,
        user: user._id,
        ...this.standard_query_meta,
      }
    );

    if (check_if_exists) {
      return this.process_failed_response(
        "Course with the course code already exists"
      );
    }

    const result = await this.course_controller.create_record({
      ...body,
      user: user._id,
    });

    return this.process_single_read(result);
  }

  get_course_credits(grade: number, credit_unit: number): number {
    let unit_credit = 0;
    if (grade >= 70) {
      unit_credit = 5.0;
    } else if (grade >= 60) {
      unit_credit = 4.0;
    } else if (grade >= 50) {
      unit_credit = 3.0;
    } else if (grade >= 45) {
      unit_credit = 2.0;
    } else if (grade >= 40) {
      unit_credit = 1.0;
    } else {
      unit_credit = 0;
    }
    return unit_credit * credit_unit;
  }

  get_class(cgpa: number) {
    let result = { current_class: "", comment: "" };
    if (cgpa >= 4.5) {
      result = {
        current_class: "First Class",
        comment: "You've done well. Keep it up",
      };
    } else if (cgpa >= 3.5) {
      result = {
        current_class: "Second Class Upper",
        comment: `You're doing well. You're just ${(4.5 - cgpa).toFixed(
          2
        )} point from being in first class`,
      };
    } else if (cgpa >= 2.5) {
      result = {
        current_class: "Second Class Lower",
        comment: `You're doing well. You're just ${(3.5 - cgpa).toFixed(
          2
        )} point from being in second class upper`,
      };
    } else if (cgpa >= 1.5) {
      result = {
        current_class: "Third Class",
        comment: `You're doing well. You're just ${(2.5 - cgpa).toFixed(
          2
        )} point from being in second class lower`,
      };
    } else if (cgpa >= 1.0) {
      result = {
        current_class: "Pass",
        comment: `You're just ${(1.5 - cgpa).toFixed(
          2
        )} point from being in third class`,
      };
    } else {
      result = {
        current_class: "Failed",
        comment: `You need to put in more effort. See your level adviser for immediate help`,
      };
    }
    return result;
  }

  async get_user_courses(request, next) {
    const query = `user=${request.user._id}`;
    request.query = query;
    return this.read_records_by_filter(request, next);
  }

  async read_record_by_id(request, next) {
    try {
      const { id } = request.params;
      if (!id) {
        return this.process_failed_response("Invalid ID supplied.");
      }

      const result = await this.course_controller.read_records({
        _id: id,
        user: request.user._id,
        ...this.standard_query_meta,
      });
      return this.process_single_read(result.data[0]);
    } catch (e) {
      console.error(e, "read_record_by_id");
      return next(e);
    }
  }

  async read_records_by_filter(request, next) {
    const current_user = request?.user;
    try {
      const { query } = request;
      query.user = current_user._id;
      const result = await this.handle_database_read(
        this.course_controller,
        query,
        {
          ...this.standard_query_meta,
        }
      );
      return this.process_multiple_read_results(result);
    } catch (e) {
      console.error(e, "read_records_by_filter");
      next(e);
    }
  }

  async read_records_by_filter_bulk(request, next) {
    try {
      const { body } = request;
      const result = await this.handle_database_read(
        this.course_controller,
        body,
        {
          ...this.standard_query_meta,
        }
      );
      return this.process_multiple_read_results(result);
    } catch (e) {
      console.error(e, "read_records_by_filter_bulk");
      next(e);
    }
  }

  async read_records_by_wildcard(request, next) {
    try {
      const { params, query } = request;

      if (!params.keys) {
        return this.process_failed_response("Invalid key/keyword", 400);
      }

      const wildcard_conditions = build_wildcard_options(
        params.keys,
        query.keyword
      );
      delete query.keyword;
      const result = await this.handle_database_read(
        this.course_controller,
        query,
        {
          ...wildcard_conditions,
          ...this.standard_query_meta,
        }
      );
      return this.process_multiple_read_results(result);
    } catch (e) {
      console.error(e, "read_records_by_wildcard");
      next(e);
    }
  }

  async update_record_by_id(request, next) {
    try {
      const { id } = request.params;
      const data = request.body;

      if (!id) {
        return this.process_failed_response("Invalid ID supplied.");
      }

      const { error } = IdSchema.validate({ id });
      if (error) throw new Error(error);

      const new_data = this.delete_record_metadata(data);
      const result = await this.course_controller.update_records(
        { _id: id },
        { ...new_data }
      );

      return this.process_update_result({ ...result, ...data });
    } catch (e) {
      console.error(e, "update_record_by_id");
      next(e);
    }
  }

  async update_records(request, next) {
    try {
      const { options, data } = request.body;
      const { seek_conditions } = build_query(options);

      const new_data = this.delete_record_metadata(data);
      const result = await this.course_controller.update_records(
        { ...seek_conditions },
        { ...new_data }
      );
      return this.process_update_result({ ...new_data, ...result });
    } catch (e) {
      console.error(e, "update_records");
      next(e);
    }
  }

  async delete_record_by_id(request, next) {
    const { user } = request;
    try {
      const { id } = request.params;
      if (!id) {
        return this.process_failed_response("Invalid ID supplied.");
      }

      const { error } = IdSchema.validate({ id });
      if (error) throw new Error(error);

      const result = await this.course_controller.delete_records({
        _id: id,
        user: user._id,
      });

      return this.process_delete_result(result);
    } catch (e) {
      next(e);
    }
  }
}

const user_controller = new Controller("User");
const course_controller = new Controller("Course");
export default new UserService(course_controller, user_controller);
