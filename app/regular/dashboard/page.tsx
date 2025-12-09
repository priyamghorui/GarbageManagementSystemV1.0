"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState, useEffect, useMemo } from "react";
// Firebase Imports (simulated for the single-file environment)
// In a real Next.js project, you would import these from 'firebase/app', 'firebase/auth', etc.
// For this environment, we use inline structure/functionality.
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-IN", options);
};
// --- Icon Components (Replacing lucide-react for single-file compliance) ---
const UserIcon = (props: any) => (
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
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const ListIcon = (props: any) => (
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
    <line x1="10" x2="21" y1="6" y2="6" />
    <line x1="10" x2="21" y1="12" y2="12" />
    <line x1="10" x2="21" y1="18" y2="18" />
    <path d="M4 6h1v.01" />
    <path d="M4 12h1v.01" />
    <path d="M4 18h1v.01" />
  </svg>
);
const PlusCircleIcon = (props: any) => (
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
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);
const CheckCircleIcon = (props: any) => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M22 4L12 14.01l-3-3" />
  </svg>
);
const ClockIcon = (props: any) => (
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const AlertTriangleIcon = (props: any) => (
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
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

// Map status strings to Tailwind classes and Icons
const getStatusInfo = (status:any) => {
  switch (status) {
    case "Resolved":
      return {
        className: "bg-green-100 text-green-800",
        icon: CheckCircleIcon,
      };
    case "In Progress":
      return { className: "bg-blue-100 text-blue-800", icon: ClockIcon };
    case "Pending":
    default:
      return {
        className: "bg-yellow-100 text-yellow-800",
        icon: AlertTriangleIcon,
      };
  }
};

const StatusBadge = ({ status }:any) => {
  const { className, icon: Icon } = getStatusInfo(status);
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${className}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </span>
  );
};

// Updated ComplaintRow to handle click events
const ComplaintRow = ({ complaint, onRowClick }:any) => {
  return (
    <tr
      className="border-b hover:bg-gray-50 transition duration-150 cursor-pointer"
      onClick={() => onRowClick(complaint)} // Click handler to open modal
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 hidden sm:table-cell">
        #{complaint._id}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {complaint.specificLocation}
        <div className="mt-1 block sm:hidden">
          <StatusBadge status={complaint.status} />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        <StatusBadge status={complaint.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(complaint.createdAt)}
      </td>
    </tr>
  );
};

// New Modal Component
const ComplaintDetailsModal = ({ complaint, onClose }:any) => {
  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity z-50 overflow-y-auto"
      style={{ backgroundColor: "lab(8 0.81 -12.25 / 0.77)" }}
      onClick={onClose} // Close on backdrop click
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all duration-300 scale-100 opacity-100"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          <div className="flex justify-between items-start border-b pb-3 mb-4">
            <h3 id="modal-title" className="text-2xl font-bold text-gray-900">
              Complaint #{complaint._id}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6 cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p className="text-lg font-semibold text-gray-800">
                {complaint.specificLocation}
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <StatusBadge status={complaint.status} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date Filed</p>
                <p className="text-gray-800">
                  {formatDate(complaint.createdAt)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Details</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border text-sm italic">
                {/* Mock detail for display */}
                {complaint.description}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Image</p>
              <img
                className="text-gray-700 bg-gray-50 p-3 rounded-lg border text-sm italic"
                src={complaint.img}
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full py-2 px-4 rounded-lg text-sm cursor-pointer font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 shadow-md"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
const App = () => {
  const [app, setApp] = useState(null);
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loadingStatus, setloadingStatus] = useState(true);
  const [activeView, setActiveView] = useState("dashboard"); // 'dashboard', 'newComplaint', 'details'
  const [selectedComplaint, setSelectedComplaint] = useState(null); // New state for modal
  const [allComplaints, setallComplaints] = useState([]); // New state for modal

  // --- Pagination State and Logic ---
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentComplaints = allComplaints.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const nPages = Math.ceil(allComplaints.length / recordsPerPage);
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  const paginate = (pageNumber:any) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };
  // ---------------------------------
  const { data: session, status }: any = useSession();
  async function fetchData() {
    if (session?.user?.admin_id) {
      try {
        const response = await axios.get(
          `/api/fetch-user-complaints-via-user?id=${session?.user?.admin_id}`
        );
        // console.log(response?.data);
        setallComplaints(response?.data?.data);
      } catch (error) {
        // console.error("Error fetching data:", error);
      } finally {
        setloadingStatus(false);
      }
    }
  }
  useEffect(() => {
    fetchData();
  }, [status, session]);

  const resolvedComplaints = useMemo(
    () => allComplaints.filter((c:any) => c.status === "Resolved").length,
    [allComplaints]
  );
  const allComplaintsCount = useMemo(
    () => allComplaints.length,
    [allComplaints]
  );
  const pendingComplaints = useMemo(
    () =>
      allComplaints.filter(
        (c:any) => c.status === "Open" || c.status === "In Progress"
      ).length,
    [allComplaints]
  );

  // Handlers for "redirection"
  const handleNewComplaint = () => {
    // console.log("Simulating redirection to New Complaint Page...");
    // // In a real Next.js app, this would be router.push('/new-complaint');
    // setActiveView("newComplaint");
    window.location.href = "/regular/launch-complaint";
  };
  const goToDashboard = () => setActiveView("dashboard");

  //   // Render based on active view
  //   if (activeView === "newComplaint") {
  //     return (
  //       <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
  //         <div className="w-full max-w-4xl bg-white shadow-xl  rounded-xl p-8">
  //           <button
  //             onClick={goToDashboard}
  //             className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition duration-150"
  //           >
  //             <svg
  //               className="w-4 h-4 mr-1"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //               xmlns="http://www.w3.org/2000/svg"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="2"
  //                 d="M10 19l-7-7m0 0l7-7m-7 7h18"
  //               ></path>
  //             </svg>
  //             Back to Dashboard
  //           </button>
  //           <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
  //             Launch New Complaint
  //           </h1>
  //           <p className="text-gray-600 mb-8">
  //             Please provide all necessary details below. We aim to respond within
  //             24 hours.
  //           </p>

  //           {/* Simplified Mock Form */}
  //           <div className="space-y-6">
  //             <div>
  //               <label
  //                 htmlFor="title"
  //                 className="block text-sm font-medium text-gray-700"
  //               >
  //                 Complaint Title (Summary)
  //               </label>
  //               <input
  //                 type="text"
  //                 id="title"
  //                 placeholder="e.g., WiFi is slow in South Wing"
  //                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
  //               />
  //             </div>
  //             <div>
  //               <label
  //                 htmlFor="description"
  //                 className="block text-sm font-medium text-gray-700"
  //               >
  //                 Detailed Description
  //               </label>
  //               <textarea
  //                 id="description"
  //                 rows="4"
  //                 placeholder="Describe the issue, when it started, and where it is located."
  //                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
  //               ></textarea>
  //             </div>
  //             <button
  //               type="button"
  //               onClick={goToDashboard} // Simulate submission and return
  //               className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
  //             >
  //               Submit Complaint
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }

  // --- Main Dashboard UI ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-inter">
      {/* Header and User Details */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
          Welcome Back, {session?.user?.name || "Loading..."}!
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          User ID:{" "}
          <span className="font-mono text-xs bg-gray-200 px-2 py-0.5 rounded-md">
            {session?.user?.admin_id || "Loading..."}
          </span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Details Card */}
          <div className="lg:col-span-2 bg-white shadow-xl rounded-xl p-6 border border-gray-200 transition duration-300 hover:shadow-2xl">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <UserIcon className="w-12 h-12 text-indigo-600 p-2 bg-indigo-100 rounded-full" />
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-gray-900">
                  {session?.user?.name || "Loading..."}
                </h2>
                <p className="text-sm text-gray-600">
                  {session?.user?.email || "Loading..."}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Member Since: {"In Development"}
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">
                      {allComplaintsCount}
                    </span>
                    <span className="text-gray-500 ml-1">Total Complaints</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-green-600">
                      {resolvedComplaints}
                    </span>
                    <span className="text-gray-500 ml-1">Resolved</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-yellow-600">
                      {pendingComplaints}
                    </span>
                    <span className="text-gray-500 ml-1">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Card: Launch New Complaint */}
          <div className="bg-indigo-600 shadow-xl rounded-xl p-6 flex flex-col justify-center items-center text-center transition duration-300 transform hover:scale-[1.02] cursor-pointer">
            <PlusCircleIcon className="w-8 h-8 text-white mb-2" />
            <h3 className="text-lg font-semibold text-white mb-4">
              Need Help?
            </h3>
            <button
              onClick={handleNewComplaint}
              className="w-full cursor-pointer flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition duration-150 ease-in-out"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Launch New Complaint
            </button>
          </div>
        </div>

        {/* Complaint History Section */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ListIcon className="w-6 h-6 mr-2 text-indigo-600" />
              Your Complaint History
            </h2>
            <span className="text-sm text-gray-500 hidden sm:block">
              Latest complaints first.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Complaint Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date Filed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentComplaints.map((complaint:any) => (
                  <ComplaintRow
                    key={complaint?._id}
                    complaint={complaint}
                    onRowClick={setSelectedComplaint} // Pass handler to open modal
                  />
                ))}
              </tbody>
            </table>
            {currentComplaints.length === 0 && (
              <p className="text-center p-6 text-gray-500">
                {loadingStatus
                  ? "Loading..."
                  : "You have no complaints filed yet for this page."}
              </p>
            )}
          </div>

          {/* Pagination Controls (Displayed if more than one page exists) */}
          {nPages > 1 && (
            <div className="border-t">
              <nav className="flex items-center justify-between px-4 py-3 sm:px-6">
                {/* Mobile Navigation */}
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === nPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstRecord + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastRecord, allComplaints.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {allComplaints.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="relative inline-flex cursor-pointer items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.79 5.23a.75.75 0 010 1.06L9.42 10l3.37 3.71a.75.75 0 11-1.06 1.02l-3.5-3.83a.75.75 0 010-1.02l3.5-3.83a.75.75 0 011.06 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {pageNumbers.map((pgNumber) => (
                        <button
                          key={pgNumber}
                          onClick={() => paginate(pgNumber)}
                          aria-current={
                            currentPage === pgNumber ? "page" : undefined
                          }
                          className={`relative inline-flex cursor-pointer items-center px-4 py-2 text-sm font-semibold focus:z-20 transition 
                                        ${
                                          currentPage === pgNumber
                                            ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                                        }`}
                        >
                          {pgNumber}
                        </button>
                      ))}
                      <button
                        onClick={nextPage}
                        disabled={currentPage === nPages}
                        className="relative inline-flex items-center cursor-pointer rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <span className="sr-only">Next</span>
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 010-1.06L10.58 10 7.21 6.35a.75.75 0 011.06-1.02l3.5 3.83a.75.75 0 010 1.02l-3.5 3.83a.75.75 0 01-1.06 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Complaint Details Modal (Rendered conditionally) */}
      {selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
};

export default App;
