const { default: mongoose } = require("mongoose");

const userOtpManageSchema = new mongoose.Schema(
  {
    level_id: {
      type: mongoose.Schema.Types.ObjectId,
      // required: [true, "provide id"],
    },
    person_id: {
      type: mongoose.Schema.Types.ObjectId,
      // required: [true, "provide id"],
    },
    email: {
      type: String,
      required: [true, "provide email"],
    },
    otp: {
      type: String,
      required: [true, "provide otp"],
    },
  },
  {
    timestamps: true,
  }
);

const userOtpManage = mongoose.model("userOtpManages", userOtpManageSchema);

module.exports = userOtpManage;
