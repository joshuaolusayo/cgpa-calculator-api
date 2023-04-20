/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/
const mongoose = require("mongoose");

/** */
class SuperController {
  get_model(model_name) {
    return mongoose.model(model_name);
  }

  jsonize(data) {
    return JSON.parse(JSON.stringify(data));
  }

  async get_record_metadata(model, _id, time_stamp) {
    const n =
      (await model.countDocuments({ time_stamp: { $lt: time_stamp } })) + 1;
    await model.updateOne({ _id }, { id: n });
    return n;
  }

  process_failed_response(message, code = 400) {
    return {
      error: message,
      payload: null,
      status_code: code,
      success: false,
    };
  }

  process_successful_response(payload, code = 200) {
    return {
      payload,
      error: null,
      status_code: code,
      success: true,
    };
  }
}

module.exports = SuperController;
