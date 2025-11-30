const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the userComplaintsDetailss schema
const userComplaintsDetailsSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "userDetails", // References the User model
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Closed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const userComplaintsDetails = mongoose.model("userComplaintsDetails", userComplaintsDetailsSchema);

module.exports =  userComplaintsDetails ;
