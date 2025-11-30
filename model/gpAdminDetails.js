const { default: mongoose } = require("mongoose");

const gpAdminDetailsSchema = new mongoose.Schema(
  {
    gpName: {
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
      required: [true, "provide gpName"],
      unique: true,
    },
    gpHead: {
      type: String,
      required: [true, "provide gpHead"],
      trim: true,
    },
    gpCredentials: [
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
        access: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const gpAdminDetails = mongoose.model("gpAdminDetails", gpAdminDetailsSchema);

module.exports = gpAdminDetails;
