const mongoose = require("mongoose");

// Define the schema for family details
const beneficiarySchema = new mongoose.Schema(
  {
    gp_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "provide gp_id"],
      ref: "gpAdminDetails",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "provide uploadedBy"],
    },
    // Dropdown for the panchayet. Can be an enum for strict validation.
    panchayet: {
      type: String,
      required: [true, "panchayet is required."],
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
    },
    // Dropdown for the ward.
    ward: {
      type: String,
      trim: true,
      required: [true, "ward is required."],
    },
    // Free text for the residential address.
    residentialAddress: {
      type: String,
      trim: true,
      required: [true, "residentialAddress is required."],
    },
    // Name of the head of the family.
    headOfTheFamilyName: {
      type: String,
      trim: true,
      required: [true, "headOfTheFamilyName is required."],
    },
    // Dropdown for gender with a strict list of options.
    sex: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "sex is required."],
    },
    // Age of the person.
    age: {
      type: Number,
      required: [true, "age is required."],
    },
    // Aadhar number is a required and unique identifier. It is stored as a string
    // to preserve leading zeros and ensure consistency.
    aadhaarNumber: {
      type: String,
      required: [true, "Aadhar number is required."],
      unique: true,
      trim: true,
      minlength: 12,
      maxlength: 12,
    },
    // Phone number is a required and unique identifier.
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required."],
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 15,
    },
    // Free text for the occupation.
    occupation: {
      type: String,
      trim: true,
      required: [true, "occupation is required."],
    },
    // Dropdown for government assistance.
    assistanceTakenFromGovernment: {
      type: [String],
      enum: [
        "Aikyashree",
        "Utkarsh Bangla",
        "Bangla Abash Yojana",
        "Karmashree",
        "Lokprasar Prakalpo",
        "SVMCM Scholarship",
        "Sabuj Sathi",
        "Sabujshree",
        "Duare Ration",
        "Samobyathi",
        "Taruner Swapna",
        "Anandadhara",
        "Bangla Shasya Bima Scheme",
        "Khadya Sathi",
        "Caste Certificate",
        "Bina Mulye Samajik Suraksha Yojona",
        "Swasthya Sathi",
        "Medhashree",
        "Shikhashree",
        "Lakshmir Bhandar",
        "Rupashree",
        "Kanyashree",
        "Manabik Pension",
        "Taposili Bandhu and Joy Johar Pension Scheme",
        "Widow Pension",
        "Bhyabisyat Credit Card",
        "Student Credit Card",
        "Krishak Bondhu",
        "NA",
      ],
      default: [], // Initialize as an empty array
      required: true, // Adjust required field as per your application's needs
    },
    hasCertificate: {
      type: String,
      enum: ["Yes", "No"],
    },
    isCaste: {
      type: String,
      enum: ["Yes", "No"],
    },
    caste: {
      type: String,
      enum: ["SC", "ST", "OBC", ""],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

// Create and export the Mongoose model
const beneficiaryDetails = mongoose.model(
  "beneficiaryDetails",
  beneficiarySchema
);

module.exports = beneficiaryDetails;
