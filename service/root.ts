import { buildQuery as build_query } from '../utilities/buildQuery';

interface QueryOptions {
  fields_to_return: string[];
  limit?: number;
  seek_conditions: object;
  skip?: number;
  sort_condition?: object;
  count?: boolean;
}

interface Result {
  id?: number;
  data?: any;
  acknowledged?: boolean;
  modifiedCount?: number;
  ok?: boolean;
  nModified?: number;
}

interface ErrorResponse {
  error: string;
  payload: null;
  status_code: number;
  success: false;
}

interface SuccessResponse {
  payload: any;
  error: null;
  status_code: number;
  success: true;
}

class RootService {
  standard_query_meta: { is_active: boolean; is_deleted: boolean };
  query_meta: { $or: { is_active: boolean }[]; is_deleted: boolean };

  constructor() {
    this.standard_query_meta = {
      is_active: true,
      is_deleted: false
    };

    this.query_meta = {
      $or: [{ is_active: true }, { is_active: false }],
      is_deleted: false
    };
  }

  get_standard_query_metadata(request) {
    return request.user.role === 'admin'
      ? this.query_meta
      : this.standard_query_meta;
  }

  delete_record_metadata(record) {
    const record_to_mutate = { ...record };
    //
    delete record_to_mutate.time_stamp;
    delete record_to_mutate.created_on;
    delete record_to_mutate.updated_on;
    delete record_to_mutate.__v;

    //
    return { ...record_to_mutate };
  }

  async handle_database_read(Controller, query_options, extra_options = {}) {
    const {
      fields_to_return,
      limit,
      seek_conditions,
      skip,
      sort_condition,
      count
    } = build_query(query_options);

    return await Controller.read_records(
      { ...seek_conditions, ...extra_options },
      fields_to_return,
      sort_condition,
      skip,
      limit,
      count
    );
  }

  process_single_read(result: Result): ErrorResponse | SuccessResponse {
    if (result && result.id) {
      return this.process_successful_response(result);
    }
    return this.process_failed_response('Resource not found', 404);
  }

  process_multiple_read_results(
    result: Result
  ): ErrorResponse | SuccessResponse {
    if (result && result.data) {
      return this.process_successful_response(result);
    }
    return this.process_failed_response('Resource not found', 404);
  }

  process_update_result(result: Result): ErrorResponse | SuccessResponse {
    if (result && result.acknowledged && result.modifiedCount) {
      return this.process_successful_response(result);
    }
    if (result && result.ok && result.nModified) {
      return this.process_successful_response(result, 210);
    }
    return this.process_failed_response('Update failed', 200);
  }

  process_delete_result(result: Result): ErrorResponse | SuccessResponse {
    if (result && result.modifiedCount) {
      return this.process_successful_response(result);
    }
    return this.process_failed_response('Deletion failed.', 200);
  }

  process_failed_response(message: string, code: number = 400): ErrorResponse {
    return {
      error: message,
      payload: null,
      status_code: code,
      success: false
    };
  }

  process_successful_response(
    payload: any,
    code: number = 200
  ): SuccessResponse {
    return {
      payload,
      error: null,
      status_code: code,
      success: true
    };
  }
}

export default RootService;
