"use client";
import React, { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  MapPin,
  Mail,
  ClipboardList,
  PlusCircle,
  List,
  Users,
  MoveDown,
} from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

// --- DUMMY DATA ---
const gpsDetails = {
  name: " Gram Panchayat",
};

const beneficiaryStats = {
  formsSubmitted: 0,
};

const GpsAdminDashboard = () => {
  const [totalBenificiaryGp, settotalBenificiaryGp] = useState(0);
  const [complaintStats, setcomplaintStats] = useState({
    totalReceived: 0,
    resolved: 0,
    notResolved: 0,
  });

  // Helper function for navigating (simulated)
  const handleNavigation = (path: any) => {
    // console.log(`Navigating to: ${path}`);
    // In a real Next.js app, use router.push(path)
    window.location.href = "/gps/" + path;
  };
  const { data: session, status }: any = useSession();

  async function fetchData() {
    try {
      const response = await axios.get(
        `/api/count-datas?id=${session?.user?._id}`
      );
      const response2 = await axios.get(
        `/api/fetch-user-complaints-via-gp?gpName=${session?.user?.gpName}`
      );
      // console.log(response?.data);
      settotalBenificiaryGp(response?.data?.data?.totalBenificiaryGp);
      setcomplaintStats({
        totalReceived: response2?.data?.data?.length,
        resolved: response2?.data?.data?.filter(
          (e: any) => e.status == "Resolved"
        ).length,
        notResolved: response2?.data?.data?.filter(
          (e: any) => e.status != "Resolved"
        ).length,
      });
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session, status]);
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
          Gram Panchayat Admin Dashboard
        </h1>
      </header>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* GPS DETAILS CARD */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-6 h-6 mr-3 text-blue-600" />
            Gram Panchayat Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <DetailItem
              label="Gram Panchayat Name"
              value={session?.user?.gpName + gpsDetails.name}
            />
            <DetailItem label="GPS ID" value={session?.user?._id} />
            <DetailItem
              label="Admin Email"
              value={session?.user?.email + " " + session?.user?.admin_id}
              icon={Mail}
            />
          </div>
        </div>

        {/* MAIN MANAGEMENT SECTIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. BENEFICIARY DATA MANAGEMENT */}
          <CardContainer
            title="Beneficiary Data Management"
            icon={ClipboardList}
            color="green"
          >
            <div className="text-center mb-8">
              <p className="text-5xl font-extrabold text-green-600 mb-2">
                {totalBenificiaryGp}
              </p>
              <p className="text-gray-500 font-medium">Total Forms Submitted</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleNavigation("/beneficiary_form")}
                className="w-full py-3 bg-green-600 text-white cursor-pointer font-medium rounded-lg hover:bg-green-700 transition duration-150 shadow-md flex items-center justify-center"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Go to Beneficiary Form
              </button>
              <button
                onClick={() => handleNavigation("/bulk_beneficiary_form")}
                className="w-full py-3 bg-green-600 text-white cursor-pointer font-medium rounded-lg hover:bg-green-700 transition duration-150 shadow-md flex items-center justify-center"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Go to Beneficiary Form (Bulk Registration)
              </button>

              <button
                onClick={() => handleNavigation("/submitted_beneficiary_form")}
                className="w-full py-3 bg-white text-green-700 border cursor-pointer border-green-600 font-medium rounded-lg hover:bg-green-50 transition duration-150 shadow-sm flex items-center justify-center"
              >
                <List className="w-5 h-5 mr-2" />
                View Beneficiary List
              </button>
            </div>
          </CardContainer>

          {/* 2. COMPLAINTS REPORT MANAGEMENT */}
          <CardContainer
            title="Complaints Report Management"
            icon={FileText}
            color="blue"
          >
            <div className="space-y-4 mb-6">
              <ComplaintStat
                label="Total Received"
                value={complaintStats.totalReceived}
                color="text-gray-700"
                icon={FileText}
              />
              <ComplaintStat
                label="Resolved Complaints"
                value={complaintStats.resolved}
                color="text-green-600"
                icon={CheckCircle}
              />
              <ComplaintStat
                label="Not Resolved Complaints"
                value={complaintStats.notResolved}
                color="text-red-500"
                icon={XCircle}
              />
            </div>
            <button
              onClick={() => handleNavigation("/complaints_list")}
              className="w-full py-3 bg-red-600 text-white cursor-pointer font-medium rounded-lg hover:bg-red-700 transition duration-150 shadow-md flex items-center justify-center mt-auto"
            >
              <List className="w-5 h-5 mr-2" />
              View Complaint List
            </button>
          </CardContainer>
          {/* 2. COMPLAINTS REPORT MANAGEMENT */}
          <CardContainer title="Manage Members" icon={Users} color="blue">
            <div className="space-y-4 mb-6">
              {/* <ComplaintStat
                label="Total Members"
                value={0}
                color="text-gray-700"
                icon={Users}
              /> */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 transition hover:bg-gray-100">
                <div className="flex items-center">
                  <Users className={`w-5 h-5 mr-3 ${"text-gray-700"}`} />
                  <span className="text-md font-medium text-gray-700">
                    {"To View Members Click In Below"}
                  </span>
                  <MoveDown className={`w-5 h-5 mr-3 ${"text-gray-700"}`} />
                </div>
                {/* <span className={`text-xl font-bold ${"text-gray-700"}`}>{value}</span> */}
              </div>
            </div>
            <button
              onClick={() => handleNavigation("/gp-members")}
              className="w-full py-3 bg-blue-600 text-white cursor-pointer font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-md flex items-center justify-center mt-auto"
            >
              <List className="w-5 h-5 mr-2" />
              View Members List
            </button>
          </CardContainer>
        </div>
      </div>
    </div>
  );
};

// --- REUSABLE SUB-COMPONENTS ---

const CardContainer = ({ title, icon: Icon, color, children }: any) => (
  <div
    className={`bg-white rounded-xl shadow-lg p-6 border-t-4 border-${color}-600 flex flex-col h-full`}
  >
    <h2
      className={`text-xl font-bold text-gray-800 mb-6 flex items-center border-b pb-3 border-gray-100`}
    >
      <Icon className={`w-6 h-6 mr-3 text-${color}-600`} />
      {title}
    </h2>
    <div className="flex-grow flex flex-col justify-center">{children}</div>
  </div>
);

const DetailItem = ({ label, value, icon: Icon }: any) => (
  <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </p>
    <div className="flex items-center">
      {Icon && <Icon className="w-4 h-4 mr-2 text-gray-600" />}
      <p className="text-base font-bold text-gray-800 break-words">{value}</p>
    </div>
  </div>
);

const ComplaintStat = ({ label, value, color, icon: Icon }: any) => (
  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 transition hover:bg-gray-100">
    <div className="flex items-center">
      <Icon className={`w-5 h-5 mr-3 ${color}`} />
      <span className="text-md font-medium text-gray-700">{label}</span>
    </div>
    <span className={`text-xl font-bold ${color}`}>{value}</span>
  </div>
);

export default GpsAdminDashboard;
