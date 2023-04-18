const { model, Schema } = require("mongoose");

const TokenSchema = Schema(
  {
    _userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: { type: String, required: true },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      expires: 43200,
    },
  },
  { timestamps: true }
);

module.exports = model("Token", TokenSchema);
