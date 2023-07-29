import SuperController from "./_super";
import { Document, Model, Query } from "mongoose";

interface IDocument extends Document {
  time_stamp?: Date;
}

interface CourseDocumentData {
  code: string;
  title: string;
  grade: number;
  unit_credit: number;
  semester: number;
  year: number;
}

class Controller extends SuperController {
  Model: Model<IDocument>; // Use the proper type for the Mongoose model

  constructor(model_name: string) {
    super();
    this.Model = this.get_model(model_name) as Model<IDocument>;
  }

  async create_record(data: CourseDocumentData) {
    try {
      const record_to_create = new this.Model(data);
      const created_record = await record_to_create.save();

      const getId = async () => {
        return await this.get_record_metadata(
          this.Model,
          created_record._id,
          created_record.time_stamp
        );
      };

      return {
        ...this.jsonize(created_record),
        id: await getId(),
      };
    } catch (e) {
      console.error(e, "create_record");
    }
  }

  async read_records(
    conditions: any,
    fields_to_return: string = "",
    sort_options: string = "",
    skip: number = 0,
    limit: number = Number.MAX_SAFE_INTEGER,
    count?: boolean
  ) {
    try {
      const result = {
        data: [],
        meta: {
          size: 0,
          next_page: skip + 1,
        },
      };

      result.meta.size = await this.Model.countDocuments({ ...conditions });

      if (!count) {
        result.data = await this.Model.find({ ...conditions }, fields_to_return)
          .skip(skip)
          .limit(limit)
          .sort(sort_options);
      }
      return result;
    } catch (e) {
      console.error(e, "read_records");
    }
  }

  async update_records(conditions: any, data_to_set: any) {
    try {
      const result = await this.Model.updateMany(
        {
          ...conditions,
        },
        {
          ...data_to_set,
          $currentDate: { updated_on: true },
        }
      );

      return this.jsonize(result);
    } catch (e) {
      console.error(e, "update_records");
    }
  }

  async delete_records(conditions: any) {
    try {
      const result = await this.Model.updateMany(
        {
          ...conditions,
        },
        {
          is_active: false,
          is_deleted: true,
          $currentDate: { updated_on: true },
        }
      );

      return this.jsonize(result);
    } catch (e) {
      console.error(e, "delete_records");
    }
  }
}

export default Controller;
