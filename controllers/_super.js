/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/
const mongoose = require("mongoose");
const glob = require("glob");
const { resolve } = require("path");

/** require all models here */
const basePath = resolve(__dirname, "../models/");
const files = glob.sync("*.js", { cwd: basePath });
files.forEach((file) => {
  if (file.toLocaleLowerCase().includes("_config")) return;
  require(resolve(basePath, file));
});

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

  async check_if_exists(model_name, property) {
    const check = await this.get_model(model_name).findOne(property);
    return !!check;
  }

  async update_data(model_name, conditions, data_to_set) {
    try {
      const result = await this.get_model(model_name).updateOne(
        { ...conditions },
        {
          $set: { ...data_to_set },
          // $currentDate: { updated_on: true },
        },
        { upsert: true } // Add the upsert option
      );

      return this.jsonize(result);
    } catch (e) {
      return this.process_failed_response(
        e?.message || "Unable to update data"
      );
    }
  }

  process_failed_response(message, code = 400) {
    console.log("here2");
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
