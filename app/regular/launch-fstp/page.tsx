"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

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
    name: "",
    contact: "",
    // Default location mock
  location:"",
    gp: "",
   choiceOfDate:"",
   userId:""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e:any) => {
    const { name, value, type } = e.target;
    // console.log(name, value, type,value.length);
if (name=='contact' && value.length<=10 ) {
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
  
}else if(name!="contact"){
  setFormData((prev) => ({
    ...prev,
    [name]: value,
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
      !formData?.name ||
      !formData?.contact ||
      !(formData?.contact.length==10) ||
      !formData?.gp ||
      !formData?.choiceOfDate ||
      !formData?.location ||
      !session?.user?.admin_id
    ) {
      setMessage("Check all the fields carefully.");
      setIsSubmitting(false);
      return;
    }
    // console.log(formData);
    
    try {
formData.userId= session?.user?.admin_id

      const res = await fetch("/api/save-fstp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const response = await res.json();
      if (res.ok && response?.success) {
        setMessage(response?.message);
        setFormData({
            name: "",
    contact: "",
    // Default location mock
  location:"",
    gp: "",
   choiceOfDate:"",userId:""
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
    const [today, setToday] = useState('');

  useEffect(() => {
    // Calculate and format today's date on the client side
    const todayDate = new Date();
    const month = (todayDate.getMonth() + 1).toString().padStart(2, '0');
    const day = todayDate.getDate().toString().padStart(2, '0');
    const year = todayDate.getFullYear();
    setToday(`${year}-${month}-${day}`);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-inter">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-6 sm:p-10 border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          New FSTP Form
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
                htmlFor="id"
                className="block text-sm font-semibold text-gray-700"
              >
                Id
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={session?.user?.admin_id || "Loading..."}
                required
                className="mt-1 block w-full rounded-lg text-black read-only:bg-gray-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border transition"
                readOnly
              />
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Type Here"
                required
                className="mt-1 block w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border transition"
              />
            </div>
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-semibold text-gray-700"
              >
                Contact no.
              </label>
              <input
                type="number"
                id="contact"
                name="contact"
                value={formData.contact}
                maxLength={10}
                onChange={handleChange}
                placeholder="Type Here"
                required
                className="mt-1 block w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border transition"
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-gray-700"
              >
                Specific Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
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
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-semibold text-gray-700"
              >
                Choice of Date
              </label>
                <input
                type="date"
                id="date"
                name="choiceOfDate"
                value={formData.choiceOfDate}
                onChange={handleChange}
                placeholder="Type Here"
                min={today} 
                required
                className="mt-1 block w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border transition"
              />
            </div>
          </div>

        

       

        

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-4 px-4 border cursor-pointer border-transparent rounded-lg shadow-xl text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-white transition duration-200 ease-in-out disabled:bg-indigo-400 disabled:cursor-not-allowed transform hover:scale-[1.005]"
          >
            {isSubmitting
              ? "Processing ..."
              : "Submit FSTP Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
