"use client";
import React, { useEffect, useState } from "react";
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  MapPin,
  Mail,
  BarChart3,
} from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

// --- DUMMY DATA ---
const blockDetails = {
  name: " Block Development Office",
};

const BlockAdminDashboard = () => {
  // Removed const [showData, setShowData] = useState(false); as it's no longer needed for the table.
  const [totalGps, settotalGps] = useState(0);
  const [totalBenificiary, settotalBenificiary] = useState(0);
  const [complaintStats, setcomplaintStats] = useState({
    totalReceived: 0,
    resolved: 0,
    notResolved: 0,
  });

  const handleNavigation = (path: any) => {
    // console.log(`Navigating to: ${path}`);
    // In a real Next.js app, you would use useRouter or Link here.
    window.location.href = "/block/" + path;
  };
  const { data: session, status }: any = useSession();
  async function fetchData() {
    try {
      const response = await axios.get("/api/count-datas");
      // console.log(response?.data);
      settotalGps(response?.data?.data?.totalGps);
      settotalBenificiary(response?.data?.data?.totalBenificiary);
      const response2 = await axios.get(`/api/fetch-user-complaints-via-block`);
      // console.log(response2?.data);
      setcomplaintStats({
        totalReceived: response2?.data?.data?.length,
        resolved: response2?.data?.data?.filter((e:any) => e.status == "Resolved")
          .length,
        notResolved: response2?.data?.data?.filter(
          (e:any) => e.status != "Resolved"
        ).length,
      });
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
          Block Admin Dashboard
        </h1>
      </header>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* BLOCK DETAILS CARD */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-600">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-6 h-6 mr-3 text-green-600" />
            Block Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <DetailItem
              label="Block Name"
              value={session?.user?.blockName + blockDetails.name}
            />
            <DetailItem label="Block ID" value={session?.user?._id} />
            <DetailItem
              label="Admin Email"
              value={session?.user?.email}
              icon={Mail}
            />
          </div>
        </div>

        {/* MAIN SECTIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 1. MANAGE GPS SECTION */}
          <CardContainer
            title="Manage Gram Panchayats"
            icon={Users}
            color="indigo"
          >
            <p className="text-4xl font-bold text-indigo-600 mb-4">
              {totalGps}
            </p>
            <p className="text-gray-500 mb-6">Enrolled Gram Panchayats</p>
            <button
              onClick={() => handleNavigation("/manage_gps")}
              className="w-full py-2 cursor-pointer bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
            >
              Go to Manage GP Page
            </button>
          </CardContainer>

          {/* 2. COMPLAINTS SECTION */}
          <CardContainer
            title="Complaints Overview"
            icon={FileText}
            color="red"
          >
            <div className="space-y-3">
              <ComplaintStat
                label="Total Received"
                value={complaintStats.totalReceived}
                color="text-gray-700"
                icon={FileText}
              />
              <ComplaintStat
                label="Resolved"
                value={complaintStats.resolved}
                color="text-green-600"
                icon={CheckCircle}
              />
              <ComplaintStat
                label="Not Resolved"
                value={complaintStats.notResolved}
                color="text-red-500"
                icon={XCircle}
              />
            </div>
            <button
              onClick={() => handleNavigation("/complaints")}
              className="w-full py-2 bg-red-600 cursor-pointer text-white font-medium rounded-lg hover:bg-red-700 transition duration-150 shadow-md mt-6"
            >
              View All Complaints
            </button>
          </CardContainer>

          {/* 3. BENEFICIARY DATA SECTION - UPDATED TO SHOW TOTAL COUNT */}
          <CardContainer
            title="Beneficiary Data"
            icon={BarChart3}
            color="green"
          >
            <p className="text-4xl font-bold text-green-600 mb-4">
              {totalBenificiary}
            </p>
            <p className="text-gray-500 mb-6">Total Forms Submitted</p>

            <button
              onClick={() => handleNavigation("/beneficiary_data")}
              className="w-full py-2 cursor-pointer bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
            >
              Show All Beneficiary Data
            </button>
          </CardContainer>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS FOR REUSABILITY ---

const CardContainer = ({ title, icon: Icon, color, children }: any) => (
  <div
    className={`bg-white rounded-xl shadow-lg p-6 border-t-4 border-${color}-600`}
  >
    <h2
      className={`text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2 border-gray-100`}
    >
      <Icon className={`w-5 h-5 mr-2 text-${color}-600`} />
      {title}
    </h2>
    {children}
  </div>
);

const DetailItem = ({ label, value, icon: Icon }: any) => (
  <div className="p-3 bg-gray-50 rounded-lg">
    <p className="text-xs font-medium text-gray-500">{label}</p>
    <div className="flex items-center mt-1">
      {Icon && <Icon className="w-4 h-4 mr-2 text-gray-600" />}
      <p className="text-base font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const ComplaintStat = ({ label, value, color, icon: Icon }: any) => (
  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center">
      <Icon className={`w-5 h-5 mr-3 ${color}`} />
      <span className="text-md font-medium text-gray-700">{label}</span>
    </div>
    <span className={`text-lg font-bold ${color}`}>{value}</span>
  </div>
);

export default BlockAdminDashboard;
