const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the userComplaintsDetailss schema
const userFstpDetailsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    choiceOfDate: {
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
   
    userId: {
      type: Schema.Types.ObjectId,
      ref: "userDetails", // References the User model
      required: true,
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

const userFstpDetails = mongoose.model(
  "userFstpDetails",
  userFstpDetailsSchema
);

module.exports = userFstpDetails;
