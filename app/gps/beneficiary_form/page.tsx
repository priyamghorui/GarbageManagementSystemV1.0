// app/beneficiary-registration/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  MapPin,
  User,
  Briefcase,
  Shield,
  Phone,
  CreditCard,
  Calendar,
  MessageSquare,
  Users,
  X,
} from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";

// --- Configuration and Constants ---

const GENDERS = ["Male", "Female", "Other"];
const CASTES = ["SC", "ST", "OBC", ""];
const OCCUPATIONS = [
  "Farmer",
  "Labourer",
  "Government Employee",
  "Private Sector",
  "Self-Employed",
  "Student",
  "Other",
];
const ASSISTANCE_OPTIONS = [
  "NA",
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
];

// --- Sub-Component: Custom Multi-Select Dropdown for Assistance ---

const MultiSelectDropdown = ({
  options,
  selected,
  onChange,
  label,
  icon: Icon,
}:any) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (option:any) => {
    // Calculate the new state value based on the current 'selected' array prop
    const isCurrentlySelected = selected.includes(option);

    const newSelection = isCurrentlySelected
      ? selected.filter((item:any) => item !== option)
      : [...selected, option];

    // Pass the new array value directly to the parent's onChange handler
    onChange(newSelection);
  };

  return (
    <div className="relative z-10">
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
        <Icon className="w-4 h-4 mr-2 text-purple-500" />
        {label}
      </label>
      <button
        type="button"
        className="w-full bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2.5 text-left text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length === 0 ? (
          <span className="text-gray-500 italic">No schemes selected yet.</span>
        ) : (
          <span>{selected.length} scheme(s) selected</span>
        )}
        <ChevronDown
          className={`w-5 h-5 ml-2 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md bg-white shadow-xl border border-gray-200 max-h-60 overflow-y-auto">
          {options.map((option:any) => (
            <div
              key={option}
              className="flex items-center p-3 cursor-pointer hover:bg-purple-50 transition duration-100"
              onClick={() => handleToggle(option)}
            >
              <input
                type="checkbox"
                readOnly
                checked={selected.includes(option)}
                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                {option}
              </span>
            </div>
          ))}
        </div>
      )}
      {/* Displaying selected items clearly below the control */}
      <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-200">
        <span className="font-semibold">Current Selection:</span>{" "}
        {selected.length > 0 ? selected.join(", ") : "None"}
      </div>
    </div>
  );
};

// --- Main Form Component (App) ---
const App = () => {
  const [formData, setFormData]:any = useState({
    wardVillage: "",
    residentialAddress: "",
    headOfFamilyName: "",
    sex: "",
    isSCST_OBC: false,
    caste: "",
    age: "",
    aadhaarNumber: "",
    phoneNumber: "",
    occupation: "",
    assistanceTaken: [],
    hasCertificate: false, // <-- ADDED: New field for certificate status
  });

  const [errors, setErrors]:any = useState({});
  const [panchayat, setpanchayat] = useState("");
  const [gp_id, setgp_id] = useState("");
  const [admin_id, setadmin_id] = useState("");
  const [submissionMessage, setSubmissionMessage]:any = useState(null);

  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target;

    let newValue = type === "checkbox" ? checked : value;

    // 1. Handle numeric/formatted input cleaning for specific fields
    if (name === "age") {
      // Allow only digits and limit to 3 characters
      newValue = value.replace(/\D/g, "").substring(0, 3);
    } else if (name === "phoneNumber") {
      // Allow only digits and limit to 10 characters
      newValue = value.replace(/\D/g, "").substring(0, 10);
    } else if (name === "aadhaarNumber") {
      // Clean value to get only the first 12 digits
      const cleanValue = value.replace(/\s/g, "").substring(0, 12);
      // Re-apply spacing for display (XXXX XXXX XXXX)
      newValue = cleanValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    // 2. Update state
    setFormData((prev:any) => ({
      ...prev,
      [name]: newValue,
    }));

    // 3. Clear errors
    if (errors[name]) {
      setErrors((prev:any) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors:any = {};

    // Required fields check
    [
      "wardVillage",
      "residentialAddress",
      "headOfFamilyName",
      "sex",
      "age",
      "phoneNumber",
      "occupation",
    ].forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required.";
      }
    });
    // Aadhaar is mandatory
    if (!formData.aadhaarNumber) {
      newErrors.aadhaarNumber = "This field is required.";
    }

    // Conditional Caste required
    if (formData.isSCST_OBC && !formData.caste) {
      newErrors.caste = "Caste selection is required.";
    }

    // Aadhaar validation
    const cleanAadhaar = formData.aadhaarNumber.replace(/\s/g, "");
    if (cleanAadhaar.length !== 12 || !/^\d{12}$/.test(cleanAadhaar)) {
      newErrors.aadhaarNumber = "Aadhaar Number must be exactly 12 digits.";
    }

    // Phone number validation
    const cleanPhone = formData.phoneNumber.replace(/\s/g, "");
    if (cleanPhone.length !== 10 || !/^\d{10}$/.test(cleanPhone)) {
      newErrors.phoneNumber = "Phone Number must be exactly 10 digits.";
    }

    // Age validation
    const age = parseInt(formData.age, 10);
    if (isNaN(age) || age < 18 || age > 100) {
      newErrors.age = "Age must be between 18 and 100 (Head of Family).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setSubmissionMessage(null);

    if (validate() && formData.assistanceTaken.length != 0) {
      //   console.log("Form Data Submitted:", formData);
      // Simulate API submission and clear the form on success

      try {
        const response = await axios.post(
          "/api/save-benificiary-data",
          {
            gp_id: gp_id,
            uploadedBy: admin_id,
            panchayet: panchayat,
            ward: formData.wardVillage,
            residentialAddress: formData.residentialAddress,
            headOfTheFamilyName: formData.headOfFamilyName,
            sex: formData.sex,
            age: formData.age,
            aadhaarNumber: formData.aadhaarNumber.replaceAll(" ", ""),
            phoneNumber: formData.phoneNumber,
            occupation: formData.occupation,
            assistanceTakenFromGovernment: formData.assistanceTaken,
            hasCertificate: formData.hasCertificate == true ? "Yes" : "No",
            isCaste: formData.isSCST_OBC == true ? "Yes" : "No",
            caste: formData.caste,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer YOUR_AUTH_TOKEN", // Optional: Include headers
            },
          }
        );
        //   console.log("Success:", response.data);

        if (response?.data?.success) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setSubmissionMessage({
            type: "success",
            text: "Beneficiary registration record created successfully!",
          });
          setFormData({
            wardVillage: "",
            residentialAddress: "",
            headOfFamilyName: "",
            sex: "",
            isSCST_OBC: false,
            caste: "",
            age: "",
            aadhaarNumber: "",
            phoneNumber: "",
            occupation: "",
            assistanceTaken: [],
            hasCertificate: false, // <-- ADDED: Reset new field
          });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setSubmissionMessage({
            type: "error",
            text: "Something went wrong !!!",
          });
        }
      } catch (error: any) {
        // console.log(error);

        window.scrollTo({ top: 0, behavior: "smooth" });
        setSubmissionMessage({
          type: "error",
          text: "Something went wrong !!",
        });
      }
    } else {
      // Scroll to the top to show the error message clearly
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSubmissionMessage({
        type: "error",
        text: "Please correct the errors in the highlighted fields.",
      });
    }
  };

  // Helper component for Select dropdowns (kept for clean abstraction)
  const SelectField = ({
    label,
    name,
    icon: Icon,
    options,
    required = true,
    disabled = false,
  }:any) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
      >
        <Icon className="w-4 h-4 mr-2 text-purple-500" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        disabled={disabled}
        className={`mt-1 block w-full rounded-lg border bg-white px-4 py-2.5 text-sm shadow-sm transition duration-150 appearance-none
                    ${
                      errors[name]
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    }
                    ${
                      disabled
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "text-gray-900"
                    }
                `}
        required={required}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((option:any) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
      )}
    </div>
  );
  const { data: session, status }: any = useSession();
  useEffect(() => {
    setpanchayat(session?.user?.gpName);
    setgp_id(session?.user?._id);
    setadmin_id(session?.user?.admin_id);
  }, [status, session]);
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      <header className="mb-8 border-b-4 border-purple-500 pb-4 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center py-4">
          Beneficiary Registration Form
        </h1>
        <p className="text-center text-sm text-gray-500 -mt-2">
          For Gram Panchayat Officials - Data Collection Drive
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-100"
        >
          {/* Submission Message */}
          {submissionMessage && (
            <div
              className={`p-4 rounded-lg flex items-center ${
                submissionMessage.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
              role="alert"
            >
              {submissionMessage.type === "success" ? (
                <Check className="w-5 h-5 mr-3 flex-shrink-0" />
              ) : (
                <X className="w-5 h-5 mr-3 flex-shrink-0" />
              )}
              <p className="font-medium text-sm">{submissionMessage.text}</p>
            </div>
          )}

          {/* Section 1: Gram Panchayat Details (Read-Only) */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <label className="block text-sm font-medium text-purple-700 mb-1 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Current Gram Panchayat
            </label>
            <input
              type="text"
              value={panchayat || "Loading..."}
              readOnly
              disabled
              className="mt-1 block w-full rounded-lg border border-purple-300 px-4 py-2.5 text-sm font-semibold text-purple-800 bg-purple-100 cursor-not-allowed"
            />
          </div>

          {/* Section 2: Personal Details */}
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center">
            <User className="w-5 h-5 mr-2 text-purple-600" /> Head of Family
            Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Head of Family Name - Inlined Input Field */}
            <div>
              <label
                htmlFor="headOfFamilyName"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <User className="w-4 h-4 mr-2 text-purple-500" />
                Head of Family Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="headOfFamilyName"
                name="headOfFamilyName"
                value={formData.headOfFamilyName}
                onChange={handleChange}
                placeholder="Enter full name"
                className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm transition duration-150 text-black
                                    ${
                                      errors.headOfFamilyName
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    }
                                `}
                required
                inputMode={"text"}
              />
              {errors.headOfFamilyName && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.headOfFamilyName}
                </p>
              )}
            </div>

            {/* Age - Inlined Input Field */}
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age (18 to 100)"
                className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm transition duration-150 text-black
                                    ${
                                      errors.age
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    }
                                `}
                required
                inputMode={"numeric"}
              />
              {errors.age && (
                <p className="mt-1 text-xs text-red-600">{errors.age}</p>
              )}
            </div>

            {/* Sex */}
            <SelectField
              label="Sex"
              name="sex"
              icon={Shield}
              options={GENDERS}
            />

            {/* Occupation */}
            <SelectField
              label="Occupation"
              name="occupation"
              icon={Briefcase}
              options={OCCUPATIONS}
            />

            {/* Phone Number - Inlined Input Field */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <Phone className="w-4 h-4 mr-2 text-purple-500" />
                Phone Number (10 digits) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="e.g., 9876543210"
                className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm transition duration-150 text-black
                                    ${
                                      errors.phoneNumber
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    }
                                `}
                required
                inputMode={"numeric"}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Aadhaar Number - Inlined Input Field */}
            <div>
              <label
                htmlFor="aadhaarNumber"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <CreditCard className="w-4 h-4 mr-2 text-purple-500" />
                Aadhaar Number (12 digits){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="aadhaarNumber"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                placeholder="e.g., XXXX XXXX XXXX"
                className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm transition duration-150 text-black
                                    ${
                                      errors.aadhaarNumber
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    }
                                `}
                required
                inputMode={"numeric"}
              />
              {errors.aadhaarNumber && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.aadhaarNumber}
                </p>
              )}
            </div>
          </div>

          {/* Section 3: Caste Details */}
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center pt-4">
            <Shield className="w-5 h-5 mr-2 text-purple-600" /> Social Category
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* SC/ST/OBC Toggle */}
            <div className="flex flex-col space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200 h-full justify-center">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isSCST_OBC"
                  name="isSCST_OBC"
                  checked={formData.isSCST_OBC}
                  onChange={handleChange}
                  className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label
                  htmlFor="isSCST_OBC"
                  className="text-sm font-medium text-gray-700"
                >
                  Member of SC, ST, or OBC?
                </label>
              </div>
              <p className="text-xs text-gray-500 italic">
                Check this box if belonging to a reserved category.
              </p>
            </div>

            {/* Caste Dropdown (Conditional) */}
            <SelectField
              label="Select Caste Category"
              name="caste"
              icon={Users}
              options={CASTES}
              required={formData.isSCST_OBC}
              disabled={!formData.isSCST_OBC}
            />

            {/* Certificate Toggle - ADDED NEW FIELD */}
            <div className="flex flex-col space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200 h-full justify-center">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="hasCertificate"
                  name="hasCertificate"
                  checked={formData.hasCertificate}
                  onChange={handleChange}
                  className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  disabled={!formData.isSCST_OBC}
                />
                <label
                  htmlFor="hasCertificate"
                  className="text-sm font-medium text-gray-700"
                >
                  Caste/Status Certificate Available?
                </label>
              </div>
              <p className="text-xs text-gray-500 italic">
                Check if the physical certificate document is available.
              </p>
            </div>
          </div>

          {/* Section 4: Residential Address */}
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center pt-4">
            <MapPin className="w-5 h-5 mr-2 text-purple-600 " /> Address Details
          </h3>

          <div className="space-y-6">
            {/* Ward / Village - Inlined Input Field */}
            <div>
              <label
                htmlFor="wardVillage"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                Ward / Village <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="wardVillage"
                name="wardVillage"
                value={formData.wardVillage}
                onChange={handleChange}
                placeholder="Enter Ward Number or Village Name"
                className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm transition duration-150 text-black
                                    ${
                                      errors.wardVillage
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    }
                                `}
                required
                inputMode={"text"}
              />
              {errors.wardVillage && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.wardVillage}
                </p>
              )}
            </div>

            {/* Residential Address (Textarea) */}
            <div>
              <label
                htmlFor="residentialAddress"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                Residential Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="residentialAddress"
                name="residentialAddress"
                value={formData.residentialAddress}
                onChange={handleChange}
                placeholder="Enter full residential address (House No., Street, Post Office)"
                rows={3}
                className={`mt-1 block w-full rounded-lg border px-4 py-2.5v text-black text-sm shadow-sm transition duration-150
                                    ${
                                      errors.residentialAddress
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    }
                                `}
                required
              />
              {errors.residentialAddress && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.residentialAddress}
                </p>
              )}
            </div>
          </div>

          {/* Section 5: Government Assistance */}
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center pt-4">
            <MessageSquare className="w-5 h-5 mr-2 text-purple-600" /> Prior
            Assistance Received
          </h3>

          <MultiSelectDropdown
            label="Government Assistance Taken (Select all that apply)"
            icon={CreditCard}
            options={ASSISTANCE_OPTIONS}
            selected={formData.assistanceTaken}
            onChange={(selected:any) =>
              setFormData((prev:any) => ({ ...prev, assistanceTaken: selected }))
            }
          />

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-xl text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-[1.01]"
            >
              Register Beneficiary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
