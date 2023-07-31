import { Request, NextFunction } from "express";
import Controller from "../controllers";
import RootService from "./root";
import { AuthSchema } from "../database/schema/user";
import { check_password_match, generate_token } from "../utilities/general";
import {
  buildQuery as build_query,
  buildWildcardOptions as build_wildcard_options,
} from "../utilities/buildQuery";
import { IdSchema } from "../database/schema/general";

class UserService extends RootService {
  user_controller: Controller;

  constructor(user_controller: Controller) {
    super();
    this.user_controller = user_controller;
  }

  async get_all_users(request: Request, next: NextFunction) {
    try {
      const result = await this.user_controller.read_records(
        null,
        "email role username"
      );
      return this.process_multiple_read_results(result);
    } catch (e) {
      next(e);
    }
  }

  async get_current_user(request: Request, next: NextFunction) {
    const current_user = request.user;
    try {
      const result = await this.user_controller.read_records(
        { _id: current_user._id, ...this.standard_query_meta },
        "email role is_active username"
      );
      return this.process_single_read(result.data[0]);
    } catch (e) {
      next(e);
    }
  }

  async read_record_by_id(request, next) {
    try {
      const { id } = request.params;
      if (!id) {
        return this.process_failed_response("Invalid ID supplied.");
      }

      const result = await this.user_controller.read_records({
        _id: id,
        ...this.standard_query_meta,
      });
      return this.process_single_read(result.data[0]);
    } catch (e) {
      console.error(e, "read_record_by_id");
      return next(e);
    }
  }

  async read_records_by_filter(request, next) {
    try {
      const { query } = request;
      const result = await this.handle_database_read(
        this.user_controller,
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
        this.user_controller,
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
        this.user_controller,
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

  async create_user(request: Request, next: NextFunction) {
    try {
      const { body } = request;
      const { error } = AuthSchema.validate(body);
      if (error) throw new Error(error);

      const check_if_exists = await this.user_controller.check_if_exists(
        "User",
        { email: body.email }
      );

      if (check_if_exists) {
        return this.process_failed_response(
          "User with the email already exists"
        );
      }

      const result = await this.user_controller.create_record({
        ...body,
        // role: "admin",
      });

      return this.process_single_read(result);
    } catch (e) {
      // console.log(e);
      next(e);
    }
  }

  async login_user(request: Request, next: NextFunction) {
    try {
      const { body } = request;
      const { error } = AuthSchema.validate(body);
      if (error) throw new Error(error);

      const { email, password } = request.body;

      const result = await this.user_controller.read_records({
        email,
      });

      if (result && result.data.length) {
        const user_record = result.data[0];

        const password_is_correct = await check_password_match(
          password,
          user_record.password
        );

        if (password_is_correct) {
          const authentication_token = generate_token(
            user_record._id,
            user_record.email
          );
          return this.process_successful_response({
            user_record,
            token: authentication_token,
          });
        }
      }

      return this.process_failed_response("Invalid username or email");
    } catch (e) {
      // console.log(e);
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
      const result = await this.user_controller.update_records(
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
      const result = await this.user_controller.update_records(
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
    try {
      const { id } = request.params;
      if (!id) {
        return this.process_failed_response("Invalid ID supplied.");
      }

      const { error } = IdSchema.validate({ id });
      if (error) throw new Error(error);

      const result = await this.user_controller.delete_records({
        _id: id,
      });

      return this.process_delete_result(result);
    } catch (e) {
      next(e);
    }
  }
}

const ControllerInstance = new Controller("User");
export default new UserService(ControllerInstance);
