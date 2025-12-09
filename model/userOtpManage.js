const { default: mongoose } = require("mongoose");

const otpManageSchema = new mongoose.Schema(
  {
 
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
otpManageSchema.index(
  { createdAt: 1 }, 
  { expireAfterSeconds: 600 }
);
const otpManage =mongoose.models.otpManages|| mongoose.model("otpManages", otpManageSchema);

module.exports = otpManage;