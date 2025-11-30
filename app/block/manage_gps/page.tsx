"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
  Unlock,
} from "lucide-react";
import axios from "axios";

const ITEMS_PER_PAGE = 8;
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
// --- Sub-Components ---

const AddGpModal = ({ isOpen, onClose }:any) => {
  const [gpName, setGpName] = useState("Anandapuri GP");
  const [gpHead, setGpHead] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setmessage] = useState("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setmessage("");
    // console.log("Submitting new GP:", { gpName, gpHead, email, password });
    // Add form submission logic (API call) here
    try {
      const response = await axios.post(
        "/api/save-gp-via-block",
        { gpName, email, password, gpHead },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_AUTH_TOKEN", // Optional: Include headers
          },
        }
      );
      //   console.log("Success:", response.data);
      setmessage(response.data?.message);
    } catch (error: any) {
      //   console.error("Error during POST request:", error);
      setmessage(error?.response?.data?.message);
      // Handle error appropriately, e.g., display an error message
    }
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal title="Add New Gram Panchayat" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GP Name
          </label>
          <select
            value={gpName}
            onChange={(e) => setGpName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select a GP</option>

            {gpOptions.map((gp, index) => (
              <option key={index} value={gp}>
                {gp}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GP Head Name
          </label>
          <input
            type="text"
            value={gpHead}
            onChange={(e) => setGpHead(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Admin Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 text-black px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 text-black px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 cursor-pointer text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 flex items-center justify-center mt-6"
        >
          <Plus className="w-5 h-5 mr-2" /> Submit GP Enrollment
        </button>
      </form>
      {message && (
        <div className="mb-4 p-3 rounded-lg text-center font-semibold bg-green-100 text-green-700">
          {message}
        </div>
      )}
    </Modal>
  );
};

const EditPermissionModal = ({ isOpen, onClose, gp }:any) => {
  if (!isOpen || !gp) return null;

  const handleToggleStatus = async (userId:any) => {
    // console.log(gp);
    try {
      const response = await axios.post(
        "/api/gp-change-permission",
        { gp_id: gp._id, userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_AUTH_TOKEN", // Optional: Include headers
          },
        }
      );
      //   console.log("Success:", response.data);
      onClose();
    } catch (error: any) {
      //   console.error("Error during POST request:", error);
      // Handle error appropriately, e.g., display an error message
      onClose();
    }
    window.location.reload();
  };

  return (
    <Modal title={`Edit Permissions for ${gp.gpName}`} onClose={onClose}>
      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-600">
          Managing user access for GP ID:{" "}
          <span className="font-semibold text-gray-800">{gp._id}</span>
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permission Status
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gp.gpCredentials.map((user:any, index:any) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.access === true
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.access ? "Active" : "Restrict"}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleToggleStatus(user._id)}
                      className={`py-1 px-3 text-xs font-semibold cursor-pointer rounded-full transition duration-150 flex items-center justify-center mx-auto ${
                        user.access === true
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {user.access === true ? (
                        <Lock className="w-4 h-4 mr-1" />
                      ) : (
                        <Unlock className="w-4 h-4 mr-1" />
                      )}
                      {user.access === true ? "Restrict" : "Allow"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

const Modal = ({ title, onClose, children }:any) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

// --- Main Component ---
const GpManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddGpModalOpen, setIsAddGpModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedGp, setSelectedGp] = useState(null);
  const [all_gps_fetch, set_all_gps_fetch] = useState([]);

  // Filter GPs based on search term
  const filteredGPs = useMemo(() => {
    return all_gps_fetch.filter((gp:any) =>
      gp?.gpName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, all_gps_fetch]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredGPs.length / ITEMS_PER_PAGE);
  const paginatedGPs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredGPs.slice(start, end);
  }, [filteredGPs, currentPage]);

  const handleEditPermissions = (gp:any) => {
    setSelectedGp(gp);
    setIsPermissionModalOpen(true);
  };

  const handlePageChange = (newPage:any) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  async function fetchData() {
    try {
      const response = await axios.get("/api/fetch-all-gps");
      //   console.log(response?.data?.data);
      set_all_gps_fetch(response?.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
          Gram Panchayat Management
        </h1>
      </header>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* ACTIONS SECTION: Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-white rounded-xl shadow-md border-l-4 border-blue-500">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by GP Name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page on search
              }}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm text-black focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Add GP Button */}
          <button
            onClick={() => setIsAddGpModalOpen(true)}
            className="py-2 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-md flex items-center justify-center w-full sm:w-auto cursor-pointer"
          >
            <Plus className="w-5 h-5 mr-2" /> Add New GP
          </button>
        </div>

        {/* GP LIST TABLE */}
        <div className="bg-white rounded-xl shadow-lg border">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Enrolled Gram Panchayats ({filteredGPs.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GP Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GP ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Head of GP
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edit Permission
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedGPs.length > 0 ? (
                  paginatedGPs.map((gp:any) => (
                    <tr key={gp._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {gp.gpName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {gp._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {gp.gpHead}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleEditPermissions(gp)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 cursor-pointer"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Manage Users
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      No Gram Panchayats found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddGpModal
        isOpen={isAddGpModalOpen}
        onClose={() => setIsAddGpModalOpen(false)}
      />
      <EditPermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        gp={selectedGp}
      />
    </div>
  );
};

export default GpManagementPage;
