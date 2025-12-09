const { default: mongoose } = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "provide email"],
    },
    email: {
      type: String,
      required: [true, "provide email"],
      unique: true,
    },
    mobile: {
      type: Number,
      required: [true, "provide mobile"],
    },

    password: {
      type: String,
      required: [true, "provide password"],
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const userDetails = mongoose.model("userDetails", userDetailsSchema);

module.exports = userDetails;
