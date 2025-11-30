"use client";
import React, { useState, useMemo } from 'react';
import { 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    X,
    AlertCircle, 
    Clock, 
    CheckCircle,
    ClipboardList,
    Calendar,
    User,
    Filter
} from 'lucide-react';

// --- DUMMY DATA GENERATOR ---
const generateDummyComplaints = (count:any) => {
    const complaints = [];
    const statuses = ['Open', 'In Progress', 'Resolved'];
    const reportedByNames = ['Ramesh K.', 'Priya S.', 'Anil V.', 'Sana M.'];
    const issues = [
        "Delay in pension disbursement.",
        "Water supply interruption in Ward 3.",
        "Road construction quality issue.",
        "Missing job card documentation.",
        "Electricity fault at community center."
    ];
    
    for (let i = 1; i <= count; i++) {
        const status = statuses[i % statuses.length];
        complaints.push({
            slNo: i,
            complaintId: `COMP-${2024}-${1000 + i}`,
            date: `2024-11-${String((i % 30) + 1).padStart(2, '0')}`,
            status: status,
            reportedBy: reportedByNames[i % reportedByNames.length],
            issueDescription: issues[i % issues.length],
            detailedDescription: `This is a detailed description for complaint ID COMP-${2024}-${1000 + i}. The resident has been waiting for two weeks for resolution. Specific location details: Near the old Banyan tree, Anandapuri Village.`,
        });
    }
    return complaints;
};

const ALL_COMPLAINTS = generateDummyComplaints(35); // Generate 35 dummy records
const ITEMS_PER_PAGE = 8;

// --- STATUS CONFIGURATION ---
const STATUS_CONFIG:any = {
    'Open': { 
        icon: AlertCircle, 
        className: 'text-red-600 bg-red-100', 
        label: 'Open' 
    },
    'In Progress': { 
        icon: Clock, 
        className: 'text-blue-600 bg-blue-100', 
        label: 'In Progress' 
    },
    'Resolved': { 
        icon: CheckCircle, 
        className: 'text-green-600 bg-green-100', 
        label: 'Resolved' 
    }
};

// --- SUB-COMPONENTS ---

// 1. Status Tag Component
const StatusTag = ({ status }:any) => {
    const config = STATUS_CONFIG[status];
    if (!config) return null;

    const Icon = config.icon;
    
    return (
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${config.className}`}>
            <Icon className="w-3.5 h-3.5 mr-1" />
            {config.label}
        </span>
    );
};

// 2. Detail Modal
const ComplaintDetailModal = ({ isOpen, onClose, complaint }:any) => {
    if (!isOpen || !complaint) return null;

    const DetailItem = ({ icon: Icon, label, value, children, highlight = false }:any) => (
        <div className={`p-3 rounded-lg ${highlight ? 'bg-purple-50 border border-purple-100' : 'bg-gray-50'}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase flex items-center mb-1">
                <Icon className={`w-4 h-4 mr-1.5 ${highlight ? 'text-purple-600' : 'text-blue-500'}`} />
                {label}
            </p>
            {children || (
                <p className={`text-sm font-bold break-words ${highlight ? 'text-purple-900' : 'text-gray-800'}`}>
                    {value || 'N/A'}
                </p>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0  bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto transform transition-all scale-100">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-xl sticky top-0 z-10">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Complaint Details</h3>
                        <p className="text-sm text-gray-500 font-medium">ID: <span className="text-blue-600">{complaint.complaintId}</span></p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    
                    {/* Key Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailItem icon={ClipboardList} label="Complaint ID" value={complaint.complaintId} highlight />
                        <DetailItem icon={User} label="Reported By" value={complaint.reportedBy} />
                        <DetailItem icon={Calendar} label="Date Submitted" value={complaint.date} />
                        <DetailItem icon={STATUS_CONFIG[complaint.status].icon} label="Status" highlight={true}>
                            <StatusTag status={complaint.status} />
                        </DetailItem>
                    </div>

                    {/* Issue Description */}
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-1 mt-2">Issue Description</h4>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <p className="text-sm text-gray-800 font-medium">{complaint.issueDescription}</p>
                    </div>

                    {/* Detailed Notes */}
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-1 mt-2">Detailed Notes</h4>
                    <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{complaint.detailedDescription}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
const ComplaintsListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedComplaint, setSelectedComplaint]:any = useState(null);

    // Filter Logic
    const filteredComplaints = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        
        return ALL_COMPLAINTS.filter(complaint => {
            // 1. Status Filter
            const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
            
            // 2. Search Term Filter
            const matchesSearch = 
                complaint.complaintId.toLowerCase().includes(lowerSearch) ||
                complaint.reportedBy.toLowerCase().includes(lowerSearch) ||
                complaint.issueDescription.toLowerCase().includes(lowerSearch);
            
            return matchesStatus && matchesSearch;
        });
    }, [searchTerm, statusFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
    const paginatedComplaints = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredComplaints.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredComplaints, currentPage]);

    const handlePageChange = (newPage:any) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    };

    const handleFilterChange = (newFilter:any) => {
        setStatusFilter(newFilter);
        setCurrentPage(1); // Reset page when filter changes
    }
    
    const allStatuses = ['All', ...Object.keys(STATUS_CONFIG)];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
            
            {/* Header */}
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
                    Complaints List
                </h1>
                <p className="text-center text-gray-500 mt-2">Track and manage all submitted citizen complaints.</p>
            </header>

            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Search Bar and Status Filter */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    
                    {/* Status Filter Dropdown */}
                    <div className="relative w-full sm:w-48">
                        <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 shadow-sm appearance-none"
                        >
                            {allStatuses.map(status => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        {/* Custom dropdown arrow for aesthetics */}
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative w-full sm:max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search ID, Reporter, or Issue..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white text-black
                            placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 shadow-sm"
                        />
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">
                                        Sl No.
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Complaint ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedComplaints.length > 0 ? (
                                    paginatedComplaints.map((complaint, index) => (
                                        <tr 
                                            key={complaint.complaintId} 
                                            className="hover:bg-blue-50 transition duration-150 cursor-pointer group"
                                            onClick={() => setSelectedComplaint(complaint)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                                {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 group-hover:text-blue-800">
                                                {complaint.complaintId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {complaint.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <StatusTag status={complaint.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <span className="text-blue-500 hover:text-blue-700 font-semibold group-hover:underline">View Details</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <ClipboardList className="w-12 h-12 text-gray-300 mb-2" />
                                                <p className="text-lg font-medium">No complaints found</p>
                                                <p className="text-sm">Try adjusting your search or clearing the status filter.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredComplaints.length)}</span> of <span className="font-medium">{filteredComplaints.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-300 transition"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        
                                        {/* Page Numbers (Simplified for demo) */}
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handlePageChange(i + 1)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition
                                                    ${currentPage === i + 1 
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-300 transition"
                                        >
                                            <span className="sr-only">Next</span>
                                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <ComplaintDetailModal 
                isOpen={!!selectedComplaint} 
                onClose={() => setSelectedComplaint(null)} 
                complaint={selectedComplaint} 
            />

        </div>
    );
};

// Simple utility icon for the select dropdown
const ChevronDownIcon = (props:any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

export default ComplaintsListPage;