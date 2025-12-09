const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the userComplaintsDetailss schema
const userComplaintsDetailsSchema = new Schema(
  {
    specificLocation: {
      type: String,
      required: true,
      trim: true,
    },
    gp: {
      type: String,
      enum: [
        "ANANDANAGAR",
        "BERABERI",
        "BOINCHIPOTA",
        "BAGDANGA CHINAMORE",
        "BARUIPARA PALTAGARH",
        "BORAI PAHALAMPUR",
        "BORA",
        "BIGHATI",
        "BALARAMBATI",
        "BASUBATI",
        "GOPALNAGAR",
        "KGD",
        "MIRZAPUR BANKIPUR",
        "NASIBPUR",
        "SINGUR- I",
        "SINGUR- II",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "userDetails", // References the User model
      required: true,
    },
    img: {
      type: String,
      required: true,
      trim: true,
    },
    public_id: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

const userComplaintsDetails = mongoose.model(
  "userComplaintsDetails",
  userComplaintsDetailsSchema
);

module.exports = userComplaintsDetails;
