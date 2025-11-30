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

// --- Main Form Component (App) ---
const App = () => {
  const [file, setFile] = useState(null);

  // const handleUpload = async () => {
  //   if (!file) {
  //     setMessage("Please select an Excel file.");
  //     return;
  //   }

  //   const res = await fetch("/api/upload-excel-benificiary-data", {
  //     method: "POST",
  //     body: file,
  //   });

  //   const data = await res.json();
  //   if (data.success) {
  //     setMessage(`Uploaded successfully! Rows inserted: ${data.data}`);
  //   } else {
  //     setMessage("Error: " + data.error);
  //   }
  // };

  const [statusL, setStatusL] = useState(""); // message
  const [loading, setLoading] = useState(false); // loader state
  const [progress, setProgress] = useState(0); // for animation

  const handleUpload = async () => {
    if (!file) {
      setStatusL("❗ Please select an Excel file.");
      return;
    }

    // Reset state
    setLoading(true);
    setStatusL("Parsing Excel file...");
    setProgress(20);

    // Step 1: Upload to API
    const res = await fetch("/api/upload-excel-benificiary-data", {
      method: "POST",
      body: file,
    });

    setStatusL("Inserting into database...");
    setProgress(60);

    const data = await res.json();

    setProgress(100);
    setLoading(false);

    if (data.success) {
      setStatusL(`✔ Upload completed! Inserted ${data.data} rows.`);
    } else {
      setStatusL("❌ Error: " + data.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      <header className="mb-8 border-b-4 border-purple-500 pb-4 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center py-4">
          Beneficiary Registration Bulk Entry
        </h1>
        <p className="text-center text-sm text-gray-500 -mt-2">
          For Gram Panchayat Officials - Data Collection Drive
        </p>
      </header>
      <div className="max-w-lg mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Please Follow the Instructions
          </h2>

          <ul className="text-gray-700 text-sm space-y-1">
            <li>
              • Upload only <span className="font-semibold">.xlsx</span> or{" "}
              <span className="font-semibold">.xls</span> files.
            </li>
            <li>• The first row should contain column headers.</li>
            <li>• Do not leave empty rows between data.</li>
            <li>• Format must match your database structure.</li>
          </ul>

          <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-700">
            ⚠️ Incorrect format will cause upload failure.
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* <div className="p-6 max-w-lg mx-auto">
          <h1 className="text-2xl text-black font-bold mb-4">
            Upload Excel File
          </h1>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4 text-black border-2 rounded-md mr-3 cursor-pointer"
          />

          <button
            onClick={handleUpload}
            className="bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg"
          >
            Upload
          </button>

          <p className="mt-4 text-sm text-gray-700">{message}</p>
        </div> */}
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">
            Upload Excel File
          </h1>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e: any) => setFile(e.target.files[0])}
            className="mb-4 text-black border-2 rounded-md mr-3 cursor-pointer"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className={`px-4 py-2 cursor-pointer rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

          {loading && (
            <div className="mt-5 w-full bg-gray-300 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-600 h-2 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          <p className="mt-4 text-sm text-gray-800">{statusL}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
