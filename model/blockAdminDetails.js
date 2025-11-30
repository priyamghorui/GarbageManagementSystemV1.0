const { default: mongoose } = require("mongoose");

const blockAdminDetailsSchema = new mongoose.Schema(
  {
    blockName: {
      type: String,
      required: [true, "provide blockAdminName"],
      unique: true,
    },
    blockCredentials: [
      {
        email: {
          type: String,
          required: [true, "provide email"],
          unique: true,
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
    ],
  },
  {
    timestamps: true,
  }
);

const blockAdminDetails =  mongoose.models.blockAdminDetails || mongoose.model(
  "blockAdminDetails",
  blockAdminDetailsSchema
);

module.exports = blockAdminDetails;
