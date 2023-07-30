import { glob } from "glob";
import { Model, Schema } from "mongoose";
import { resolve } from "path";
import models from "../database/models";

/** require all models here */
const basePath = resolve(__dirname, "../database/models/");
const files = glob.sync("*.ts", { cwd: basePath });
files.forEach((file) => {
  if (file.toLowerCase().includes("_config")) return;
  require(resolve(basePath, file));
});

class SuperController {
  // get_model<T>(model_name: string): Model<T> {
  //   return mongoose.model<T>(model_name);
  // }

  get_model(model_name) {
    const Model = models[model_name];
    if (!Model) {
      throw new Error(`Model not found: ${model_name}`);
    }
    return Model;
  }

  jsonize<T>(data: T): T {
    return JSON.parse(JSON.stringify(data)) as T;
  }

  async get_record_metadata(model: Model<any>, _id: string, time_stamp: Date) {
    const n =
      (await model.countDocuments({ time_stamp: { $lt: time_stamp } })) + 1;
    await model.updateOne({ _id }, { id: n });
    return n;
  }

  async check_if_exists(model_name: string, property: any): Promise<boolean> {
    const check = await this.get_model(model_name).findOne(property);
    return !!check;
  }

  async update_data(
    model_name: string,
    conditions: any,
    data_to_set: any
  ): Promise<any> {
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

  process_failed_response(message: string, code: number = 400): ErrorResponse {
    return {
      error: message,
      payload: null,
      status_code: code,
      success: false,
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
      success: true,
    };
  }
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

export default SuperController;
