"use client";

import { useSession } from "next-auth/react";
import React, { useState } from "react";

// --- Icon Components for UI elements ---
const MapPinIcon = (props:any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 21.75l-6-6C4 13 4 8 8 8c4 0 4 5 6 7l6 6" />
  </svg>
);
const UploadIcon = (props:any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

// --- Mock Data ---
const mockGPs = [
  { value: "gp_it", label: "IT Support" },
  { value: "gp_hr", label: "Human Resources" },
  { value: "gp_facilities", label: "Facilities Management" },
  { value: "gp_admin", label: "Administrative Support" },
];
const gpOptions = [
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
];
// --- Main Complaint Form Component ---
const CLOUD_NAME = "dz0a3jr5f";
const UPLOAD_PRESET = 'gms(singur BDO)';
const App = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    // Default location mock
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: "Los Angeles, CA (Mock Location)",
    },
    gp: "",
    daysFacing: 0,
    imageFile: null,
    file: null,
    imagePreview: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e:any) => {
    const { name, value, type } = e.target;
    // console.log(Number(value)+1);

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
  };

  const handleFileChange = (e:any) => {
    const file = e.target.files[0];
    // console.log(file?.size);

    if (file?.size <= 1024 * 1024) {
      // Generates a local preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev:any) => ({
          ...prev,
          imageFile: file.name,
          file: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        imageFile: null,
         file: null,
        imagePreview: null,
      }));
    }
  };

  // Mock Map Selection handler - simulates dropping a pin
  // const handleMapSelection = () => {
  //     const newLat = 34.0522 + (Math.random() - 0.5) * 0.1;
  //     const newLng = -118.2437 + (Math.random() - 0.5) * 0.1;

  //     setFormData(prev => ({
  //         ...prev,
  //         location: {
  //             lat: newLat.toFixed(4),
  //             lng: newLng.toFixed(4),
  //             address: `Pin Dropped: (${newLat.toFixed(4)}, ${newLng.toFixed(4)})`
  //         }
  //     }));
  //     setMessage('Location updated successfully!');
  //     setTimeout(() => setMessage(''), 3000);
  // };

  const { data: session, status }: any = useSession();
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    // console.log("Submitting Complaint Data:", formData.imagePreview);
    if (
      !formData?.imageFile ||
      !formData?.file ||
      !formData?.gp ||
      !formData?.title ||
      !formData?.description ||
      !session?.user?.admin_id
    ) {
      setMessage("Check all the fields!!");
      setIsSubmitting(false);
      return;
    }
    try {
      const formData1 = new FormData();
    formData1.append('file', formData?.file);
    formData1.append('upload_preset', UPLOAD_PRESET);
    formData1.append('folder', "garbagemanagementsystem");
      const response1 = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData1,
        }
      );
      if (!response1.ok) {
        throw new Error("Cloudinary upload failed.");
      }
      const data = await response1.json();
      const res = await fetch("/api/save-complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specificLocation: formData?.title,
          gp: formData?.gp,
          description: formData?.description,
          userId: session?.user?.admin_id,
          img: data.secure_url,
          public_id: data.public_id
        }),
      });
      const response = await res.json();
      if (res.ok && response?.success) {
        setMessage(response?.message);
        setFormData({
          title: "",
          description: "",
          // Default location mock
          location: {
            lat: 34.0522,
            lng: -118.2437,
            address: "Los Angeles, CA (Mock Location)",
          },
          gp: "",
          daysFacing: 0,
          imageFile: null,
          file: null,
          imagePreview: null,
        });
        setIsSubmitting(false);
        return;
      } else {
        throw new Error("Someting went wrong !!");
      }
    } catch (error) {
      setIsSubmitting(false);
      // console.log(error);
      
      setMessage("Someting went wrong in server , try again later !!");
      return;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-inter">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-6 sm:p-10 border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          New Complaint Submission
        </h1>
        <p className="text-gray-600 mb-8 border-b pb-4">
          Please fill out the form accurately to ensure your issue is directed
          to the correct team.
        </p>

        {/* Submission Message */}
        {message && (
          <div
            className={`p-4 mb-6 rounded-lg text-sm font-medium ${
              message.includes("success") || message.includes("successfully")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Core Complaint Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700"
              >
                Id
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={session?.user?.admin_id || "Loading..."}
                required
                className="mt-1 block w-full rounded-lg text-black read-only:bg-gray-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border transition"
                readOnly
              />
            </div>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700"
              >
                Specific Location
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Near 12  no rail gate"
                required
                className="mt-1 block w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border transition"
              />
            </div>
            <div>
              <label
                htmlFor="gp"
                className="block text-sm font-semibold text-gray-700"
              >
                Relevant Group/Department (GP)
              </label>
              <select
                id="gp"
                name="gp"
                value={formData.gp}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-white transition"
              >
                <option value="">--- Select Department ---</option>
                {gpOptions.map((gp, index) => (
                  <option key={index} value={gp}>
                    {gp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700"
            >
              Detailed Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about what happened, when it started, and any immediate impact."
              required
              className="mt-1 block w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border transition"
            />
          </div>

          {/* Section 2: Location and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            {/* Location Picker Mock */}
            {/* <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Location of Issue (Map Selection)</label>
                            <div 
                                className="relative w-full h-48 bg-gray-200 rounded-lg shadow-inner flex items-center justify-center p-4 border border-dashed border-gray-400 overflow-hidden"
                                style={{
                                    backgroundImage: `url(https://placehold.co/600x400/e5e7eb/6b7280?text=CLICK+TO+SELECT+LOCATION)`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[100%] transition-transform duration-300 ease-in-out">
                                    <MapPinIcon className="w-8 h-8 text-red-600 drop-shadow-lg animate-bounce" />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleMapSelection}
                                    className="absolute bottom-3 left-1/2 transform -translate-x-1/2 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full shadow-lg hover:bg-indigo-700 transition duration-150 ring-4 ring-white/50"
                                >
                                    Select Pin Location
                                </button>
                            </div>
                            <p className="mt-3 text-sm text-gray-500 flex items-center">
                                <MapPinIcon className="w-4 h-4 mr-1 text-indigo-500"/>
                                Current Coordinates: <span className="font-mono text-xs ml-1 bg-indigo-50 px-2 py-0.5 rounded-md text-indigo-700">{formData.location.address}</span>
                            </p>
                        </div> */}

            {/* Days Facing Issue */}
            {/* <div className='flex flex-col justify-start'>
                            <label htmlFor="daysFacing" className="block text-sm font-semibold text-gray-700">How many days have you faced this issue?</label>
                            <input 
                                type="number" 
                                id="daysFacing" 
                                name="daysFacing"
                                value={Number(formData.daysFacing)}
                                onChange={handleChange}
                                // min="0"
                                required
                                className="mt-1 block w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border transition"
                            />
                            <p className="mt-2 text-xs text-gray-500">Enter the duration (in days). Use '0' if this is a brand new or one-time issue.</p>
                        </div> */}
          </div>

          {/* Section 3: Image Upload */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Upload Supporting Image (Max 1)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50">
              <label
                htmlFor="imageUpload"
                className="relative cursor-pointer flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 w-full sm:w-auto"
              >
                <UploadIcon className="w-5 h-5 mr-2" />
                {formData.imageFile
                  ? "Change or Replace Image"
                  : "Select Image File"}
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleFileChange}
                  className="sr-only"
                  required
                />
              </label>

              {formData.imagePreview ? (
                <div className="flex items-center space-x-3">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg border-2 border-indigo-300 shadow-inner"
                  />
                  <span className="text-sm text-gray-700 font-medium truncate max-w-xs">
                    {formData.imageFile}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-500 italic">
                  No image evidence selected yet.
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-4 px-4 border cursor-pointer border-transparent rounded-lg shadow-xl text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-white transition duration-200 ease-in-out disabled:bg-indigo-400 disabled:cursor-not-allowed transform hover:scale-[1.005]"
          >
            {isSubmitting
              ? "Processing Complaint..."
              : "Submit Final Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
