"use client";
import React, { useState, useMemo } from 'react';
import { 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    X,
    MessageSquare,
    Users,
    Calendar,
    AlertTriangle,
    CheckCircle,
    RotateCw,
    User,
    ClipboardList,
    Filter
} from 'lucide-react';

// --- Configuration and Dummy Data Helpers ---
const ITEMS_PER_PAGE = 8;
const COMPLAINT_STATUSES = [
    { name: 'Open', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300' },
    { name: 'In Progress', icon: RotateCw, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-300' },
    { name: 'Resolved', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-300' },
];

const getStatus = (i:any) => COMPLAINT_STATUSES[i % 3];

const calculateComplaintCounts = (complaints:any) => {
    return complaints.reduce((acc:any, complaint:any) => {
        if (complaint.status === 'Open') acc.openCount++;
        else if (complaint.status === 'In Progress') acc.inProgressCount++;
        else if (complaint.status === 'Resolved') acc.resolvedCount++;
        return acc;
    }, { openCount: 0, inProgressCount: 0, resolvedCount: 0 });
};

const createComplaints = (gpId:any, count:any) => {
    const complaints = [];
    for (let i = 1; i <= count; i++) {
        const complaintId = `${gpId.split('-')[1]}-${2000 + i}`;
        complaints.push({
            slNo: i,
            complaintId: complaintId,
            date: `2024-${String(11 + Math.floor(i / 10)).padStart(2, '0')}-${String(10 + i).padStart(2, '0')}`,
            status: getStatus(i).name,
            reportedBy: `Citizen ${i % 5 + 1}`,
            issueDescription: `Issue #${i}: ${['Water supply contamination', 'Road construction quality', 'Street light malfunction', 'Drainage overflow'][i % 4]} reported near Ward ${i % 10}.`,
        });
    }
    return complaints;
};

const createGpData = (id:any, name:any, head:any, count:any) => {
    const complaints = createComplaints(id, count);
    const counts = calculateComplaintCounts(complaints);
    return {
        id,
        name,
        head,
        totalComplaints: count,
        ...counts, // Add the open, inProgress, resolved counts here
        complaints,
    };
};

const ALL_GP_COMPLAINTS_DATA = [
    createGpData('GP-A001', 'Anandapuri GP', 'Mr. Rajesh Kumar', 15),
    createGpData('GP-B002', 'Balarambati GP', 'Ms. Priya Sharma', 22),
    createGpData('GP-C003', 'Chandanpur GP', 'Mr. Sunil Verma', 8),
    createGpData('GP-D004', 'Dayrampur GP', 'Mrs. Neeta Devi', 12),
    createGpData('GP-E005', 'Eklakhpur GP', 'Mr. Manoj Das', 3),
    createGpData('GP-F006', 'Faridpur GP', 'Ms. Sonal Ray', 18),
    createGpData('GP-G007', 'Gopalnagar GP', 'Mr. Vikrant Sen', 10),
    createGpData('GP-H008', 'Haripur GP', 'Mrs. Rina Ghosh', 6),
    createGpData('GP-I009', 'Itachuna GP', 'Mr. Alok Mitra', 14),
    createGpData('GP-J010', 'Jangipara GP', 'Ms. Reema Pal', 9),
];

// --- Sub-Components: Modal and Detail Views ---

const Modal = ({ title, onClose, children, size = 'max-w-xl' }:any) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div className={`bg-white rounded-xl shadow-2xl w-full ${size} max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100`}>
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <button 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
            {children}
        </div>
    </div>
);

const StatusPill = ({ statusName }:any) => {
    const status = COMPLAINT_STATUSES.find(s => s.name === statusName);
    if (!status) return null;

    return (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${status.bg} ${status.color}`}>
            <status.icon className="w-3 h-3 mr-1" />
            {status.name}
        </span>
    );
};

const ComplaintDetailModal = ({ isOpen, onClose, complaint }:any) => {
    if (!isOpen || !complaint) return null;

    const DetailItem = ({ icon: Icon, label, value, className = '' }:any) => (
        <div className={`p-3 bg-gray-50 rounded-lg ${className}`}>
            <p className="text-xs font-medium text-gray-500 uppercase flex items-center mb-1">
                <Icon className="w-4 h-4 mr-1 text-purple-500" />
                {label}
            </p>
            <p className="text-sm font-semibold text-gray-800 break-words">{value}</p>
        </div>
    );

    return (
        <Modal title={`Complaint Details (ID: ${complaint.complaintId})`} onClose={onClose} size="max-w-xl">
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <DetailItem icon={ClipboardList} label="Complaint ID" value={complaint.complaintId} />
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 uppercase flex items-center mb-1">
                            <AlertTriangle className="w-4 h-4 mr-1 text-purple-500" />
                            Status
                        </p>
                        <StatusPill statusName={complaint.status} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <DetailItem icon={Calendar} label="Date Reported" value={complaint.date} />
                    <DetailItem icon={User} label="Reported By" value={complaint.reportedBy} />
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm font-bold text-purple-800 mb-2 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" /> Issue Description
                    </p>
                    <p className="text-sm text-purple-900 leading-relaxed">{complaint.issueDescription}</p>
                </div>
            </div>
        </Modal>
    );
};


// --- Secondary Table Component (Nested) ---
const ComplaintTable = ({ complaints, handleComplaintRowClick }:any) => {
    const [complaintSearchTerm, setComplaintSearchTerm] = useState('');
    const [currentComplaintPage, setCurrentComplaintPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState(null); // null means all

    const handleFilterClick = (statusName:any) => {
        // Toggle filter: if clicked status is already active, turn off filter (set to null)
        setStatusFilter(statusFilter === statusName ? null : statusName);
        setCurrentComplaintPage(1); // Reset page
    };

    // Filter complaints based on search term (ID, Date) and status filter
    const filteredComplaints = useMemo(() => {
        return complaints.filter((complaint:any) => {
            const matchesSearch = complaint.complaintId.toLowerCase().includes(complaintSearchTerm.toLowerCase()) ||
                                  complaint.date.toLowerCase().includes(complaintSearchTerm.toLowerCase());
            
            const matchesStatus = statusFilter ? complaint.status === statusFilter : true;
            
            return matchesSearch && matchesStatus;
        });
    }, [complaints, complaintSearchTerm, statusFilter]);

    // Pagination calculations
    const totalComplaintPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
    const paginatedComplaints = useMemo(() => {
        const start = (currentComplaintPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredComplaints.slice(start, end);
    }, [filteredComplaints, currentComplaintPage]);
    
    const handleComplaintPageChange = (newPage:any) => {
        if (newPage >= 1 && newPage <= totalComplaintPages) {
            setCurrentComplaintPage(newPage);
        }
    };
    
    return (
        <div className="bg-purple-50 p-4 border-t border-purple-200">
            <h4 className="text-md font-semibold text-purple-700 mb-3 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" /> Reported Complaints ({filteredComplaints.length})
            </h4>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-between items-start sm:items-center">
                {/* Complaint Search Bar */}
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search Complaint ID or Date..."
                        value={complaintSearchTerm}
                        onChange={(e) => {
                            setComplaintSearchTerm(e.target.value);
                            setCurrentComplaintPage(1); // Reset page on search
                        }}
                        className="w-full rounded-lg border border-purple-300 pl-10 pr-4 py-2 text-sm text-black focus:border-purple-500 focus:ring-purple-500"
                    />
                </div>

                {/* Status Filter Buttons */}
                <div className="flex space-x-2">
                    <Filter className="w-5 h-5 text-purple-600 mt-1" />
                    {COMPLAINT_STATUSES.map(status => (
                        <button
                            key={status.name}
                            onClick={() => handleFilterClick(status.name)}
                            title={`Filter by ${status.name}`}
                            className={`p-2 rounded-full text-xs font-medium transition duration-150 shadow-sm
                                ${statusFilter === status.name 
                                    ? `${status.bg} ${status.color} border-2 ${status.border} ring-2 ring-offset-1 ring-purple-400`
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                        >
                            <status.icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-purple-200">
                <table className="min-w-full divide-y divide-purple-200">
                    <thead className="bg-purple-100">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase">SL No.</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase">Complaint ID</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-purple-100">
                        {paginatedComplaints.length > 0 ? (
                            paginatedComplaints.map((complaint:any) => (
                                <tr 
                                    key={complaint.complaintId} 
                                    className="hover:bg-purple-50 cursor-pointer transition duration-100"
                                    onClick={() => handleComplaintRowClick(complaint)}
                                >
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{complaint.slNo}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-purple-600">{complaint.complaintId}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{complaint.date}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                                        <StatusPill statusName={complaint.status} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-gray-500">
                                    No complaints found matching the criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Complaint Pagination Controls */}
            {totalComplaintPages > 1 && (
                <div className="flex justify-between items-center p-3 mt-2 bg-purple-100 rounded-lg">
                    <span className="text-xs text-purple-800 font-medium">
                        Page {currentComplaintPage} of {totalComplaintPages}
                    </span>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleComplaintPageChange(currentComplaintPage - 1)}
                            disabled={currentComplaintPage === 1}
                            className="p-1 border border-purple-300 rounded-md bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft className="w-4 h-4 text-purple-600" />
                        </button>
                        <button
                            onClick={() => handleComplaintPageChange(currentComplaintPage + 1)}
                            disabled={currentComplaintPage === totalComplaintPages}
                            className="p-1 border border-purple-300 rounded-md bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronRight className="w-4 h-4 text-purple-600" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- Main Component ---
const ComplaintsDetailsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedGpId, setExpandedGpId] = useState(null); // ID of the GP row expanded to show forms
    const [selectedComplaint, setSelectedComplaint] = useState(null); // Complaint object selected for modal

    // --- Data Filtering and Pagination (Primary Table) ---
    const filteredGPs = useMemo(() => {
        return ALL_GP_COMPLAINTS_DATA.filter(gp =>
            gp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            gp.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredGPs.length / ITEMS_PER_PAGE);
    const paginatedGPs = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredGPs.slice(start, end);
    }, [filteredGPs, currentPage]);

    const handlePageChange = (newPage:any) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // --- Interaction Handlers ---
    const handleGpRowClick = (gpId:any) => {
        setExpandedGpId(expandedGpId === gpId ? null : gpId);
    };

    const handleComplaintRowClick = (complaint:any) => {
        setSelectedComplaint(complaint);
    };

    const closeComplaintModal = () => {
        setSelectedComplaint(null);
    };


    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
                    Complaints Details
                </h1>
            </header>

            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Search Box (Primary Table) */}
                <div className="flex justify-center p-4 bg-white rounded-xl shadow-md border-l-4 border-purple-500">
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by GP ID or Name..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset page on search
                                setExpandedGpId(null); // Collapse any expanded row
                            }}
                            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm text-black focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>
                </div>

                {/* Primary Table: GP List */}
                <div className="bg-white rounded-xl shadow-lg border">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-purple-600" />
                            Gram Panchayat Summary
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">SL No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GP ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GP Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head of GP</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider text-red-600">Open</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider text-yellow-600">In Progress</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider text-green-600">Resolved</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedGPs.length > 0 ? (
                                    paginatedGPs.map((gp, index) => (
                                        <React.Fragment key={gp.id}>
                                            <tr 
                                                className="hover:bg-purple-50 cursor-pointer transition duration-150"
                                                onClick={() => handleGpRowClick(gp.id)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-16">
                                                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                                                    {gp.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {gp.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {gp.head}
                                                </td>
                                                {/* New Count Columns */}
                                                <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-700">
                                                    {gp.totalComplaints}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-semibold text-red-600">
                                                    {gp.openCount}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-semibold text-yellow-600">
                                                    {gp.inProgressCount}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-semibold text-green-600">
                                                    {gp.resolvedCount}
                                                </td>
                                            </tr>
                                            {/* Nested/Secondary Table for Complaints */}
                                            {expandedGpId === gp.id && (
                                                <tr>
                                                    <td colSpan={8} className="p-0">
                                                        <ComplaintTable 
                                                            complaints={gp.complaints} 
                                                            handleComplaintRowClick={handleComplaintRowClick} 
                                                        />
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="text-center py-6 text-gray-500">
                                            No Gram Panchayats found matching the search criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination Controls (Primary Table) */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center p-4 border-t bg-gray-50 rounded-b-xl">
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
            
            {/* Detail Modal */}
            <ComplaintDetailModal 
                isOpen={!!selectedComplaint} 
                onClose={closeComplaintModal} 
                complaint={selectedComplaint} 
            />
        </div>
    );
};

export default ComplaintsDetailsPage;