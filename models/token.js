const { model, Schema } = require("mongoose");

const TokenSchema = new Schema(
  {
    _userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: { type: String, required: true },
    type: {
      type: String,
      enum: ["password_reset", "email_verification"],
      default: "email_verification",
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      expires: 43200,
    },
  },
  { timestamps: true }
);

model("Token", TokenSchema);
