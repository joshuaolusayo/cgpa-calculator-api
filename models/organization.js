const { model, Schema } = require("mongoose");

const OrganizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    staff: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },
    ],
    time_stamp: {
      type: Number,
      required: true,
      default: () => Date.now(),
    },
    created_on: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    updated_on: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
  }
);

model("Organization", OrganizationSchema);
