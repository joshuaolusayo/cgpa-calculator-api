const mongoose = require("mongoose");

const TokenSchema = mongoose.Schema(
  {
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model("Token", TokenSchema);
