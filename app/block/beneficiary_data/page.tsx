"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, 
    FileText, 
    Users, 
    ChevronLeft, 
    ChevronRight, 
    X,
    ClipboardList,
    Calendar,
    Scan,
    MapPin,
    User,
    Phone,
    Briefcase,
    Shield,
    CheckCircle,
    Package
} from 'lucide-react';
import axios from 'axios';
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-IN", options);
};
// --- DUMMY DATA ---
const createForms = (gpId:any, count:any) => {
    const forms = [];
    for (let i = 1; i <= count; i++) {
        const formId = `${gpId}-${1000 + i}`;
        forms.push({
            slNo: i,
            formId: formId,
            date: `2024-${String(10 + Math.floor(i / 5)).padStart(2, '0')}-${String(10 + i).padStart(2, '0')}`,
            aadhaar: `XXXX XXXX ${String(9000 + i).padStart(4, '0')}`,
            panchayat: 'Anandapuri GP',
            wardVillage: `Ward ${Math.ceil(i / 10)} / Village ${i % 10}`,
            residentialAddress: `H. No. ${i * 2}, Street ${i % 3}, Village ${i % 10}, PIN 712301`,
            headOfFamilyName: `Beneficiary Name ${i}`,
            sex: i % 2 === 0 ? 'Female' : 'Male',
            age: 25 + (i % 30),
            aadhaarNo: `1234 5678 ${String(9000 + i).padStart(4, '0')}`,
            phoneNo: `9876543${String(10 + i).padStart(3, '0')}`,
            occupation: ['Farmer', 'Labourer', 'Self-Employed', 'Government Job'][i % 4],
            caste: ['SC', 'ST', 'OBC', 'General'][i % 4],
            hasCertificate: i % 3 === 0 ? 'No' : 'Yes',
            dateOfSubmitted: `2024-10-${String(10 + i).padStart(2, '0')}`,
            benefits: i % 2 === 0 ? 'Housing Scheme' : 'Food Security Scheme',
        });
    }
    return forms;
};



const ITEMS_PER_PAGE = 8;

// --- Sub-Components: Modal and Detail Views ---

const Modal = ({ title, onClose, children, size = 'max-w-xl' }:any) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div className={`bg-white rounded-xl shadow-2xl w-full ${size} max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100`}>
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

const FormDetailModal = ({ isOpen, onClose, form }:any) => {
    if (!isOpen || !form) return null;

    // Helper component for detail items
    const DetailItem = ({ icon: Icon, label, value }:any) => (
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <Icon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
                <p className="text-sm font-semibold text-gray-800 break-words">{value}</p>
            </div>
        </div>
    );

    return (
        <Modal title={`Form Details (ID: ${form._id})`} onClose={onClose} size="max-w-3xl">
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem icon={ClipboardList} label="Panchayat" value={form.panchayet} />
                    <DetailItem icon={MapPin} label="Ward / Village" value={form.ward} />
                </div>

                <div className="p-4 bg-blue-100 rounded-lg">
                    <p className="text-sm font-bold text-blue-800 mb-1">Residential Address</p>
                    <p className="text-sm text-blue-900">{form.residentialAddress}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <DetailItem icon={User} label="Head of Family" value={form.headOfTheFamilyName} />
                    <DetailItem icon={User} label="Sex" value={form.sex} />
                    <DetailItem icon={User} label="Age" value={form.age} />
                    <DetailItem icon={Scan} label="Aadhaar No." value={form.aadhaarNumber} />
                    <DetailItem icon={Phone} label="Phone No." value={form.phoneNumber} />
                    <DetailItem icon={Briefcase} label="Occupation" value={form.occupation} />
                    <DetailItem icon={Shield} label="Caste" value={form.isCaste} />
                    <DetailItem icon={CheckCircle} label="Has Certificate?" value={form.hasCertificate} />
                    <DetailItem icon={Calendar} label="Date of Submitted" value={formatDate(form.createdAt)} />
                </div>
                
                <div className="p-4 bg-green-100 rounded-lg">
                    <p className="text-sm font-bold text-green-800 mb-1 flex items-center"><Package className="w-4 h-4 mr-2" /> Benefits Received</p>
                    <p className="text-sm flex flex-col text-green-900">{form.assistanceTakenFromGovernment.map((e:any,index:any)=>(<span key={index} >{index+1} : {e}</span>))}</p>
                </div>
            </div>
        </Modal>
    );
};


// --- Secondary Table Component (Nested) ---
const FormTable = ({ forms, handleFormRowClick }:any) => {
    const [formSearchTerm, setFormSearchTerm] = useState('');
    const [currentFormPage, setCurrentFormPage] = useState(1);
    
    // Filter forms based on search term (Form ID or Aadhaar)
    const filteredForms = useMemo(() => {
        return forms.filter((form:any) =>
            form._id.toLowerCase().includes(formSearchTerm.toLowerCase()) ||
            form.aadhaarNumber.toLowerCase().includes(formSearchTerm.toLowerCase())
        );
    }, [forms, formSearchTerm]);

    // Pagination calculations
    const totalFormPages = Math.ceil(filteredForms.length / ITEMS_PER_PAGE);
    const paginatedForms = useMemo(() => {
        const start = (currentFormPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredForms.slice(start, end);
    }, [filteredForms, currentFormPage]);
    
    const handleFormPageChange = (newPage:any) => {
        if (newPage >= 1 && newPage <= totalFormPages) {
            setCurrentFormPage(newPage);
        }
    };
    
    return (
        <div className="bg-blue-50 p-4 border-t border-blue-200">
            <h4 className="text-md font-semibold text-blue-700 mb-3 flex items-center">
                <ClipboardList className="w-4 h-4 mr-2" /> Submitted Forms ({filteredForms.length})
            </h4>
            
            {/* Form Search Bar */}
            <div className="relative w-full max-w-sm mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search Form ID or Aadhaar..."
                    value={formSearchTerm}
                    onChange={(e) => {
                        setFormSearchTerm(e.target.value);
                        setCurrentFormPage(1); // Reset page on search
                    }}
                    className="w-full rounded-lg border border-blue-300 pl-10 pr-4 py-2 text-sm text-black focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div className="overflow-x-auto rounded-lg border border-blue-200">
                <table className="min-w-full divide-y divide-blue-200">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase">SL No.</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase">Form ID</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase">Aadhaar No.</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue-100">
                        {paginatedForms.length > 0 ? (
                            paginatedForms.map((form:any,index:any) => (
                                <tr 
                                    key={form._id} 
                                    className="hover:bg-blue-50 cursor-pointer transition duration-100"
                                    onClick={() => handleFormRowClick(form)}
                                >
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{index+1}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{form._id}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{form.createdAt}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{form.aadhaarNumber}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-gray-500">
                                    No forms found matching the search criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Form Pagination Controls */}
            {totalFormPages > 1 && (
                <div className="flex justify-between items-center p-3 mt-2 bg-blue-100 rounded-lg">
                    <span className="text-xs text-blue-800 font-medium">
                        Form Page {currentFormPage} of {totalFormPages}
                    </span>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleFormPageChange(currentFormPage - 1)}
                            disabled={currentFormPage === 1}
                            className="p-1 border border-blue-300 rounded-md bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                            onClick={() => handleFormPageChange(currentFormPage + 1)}
                            disabled={currentFormPage === totalFormPages}
                            className="p-1 border border-blue-300 rounded-md bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronRight className="w-4 h-4 text-blue-600" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- Main Component ---
const BeneficiaryDataPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedGpId, setExpandedGpId] = useState(null); // ID of the GP row expanded to show forms
    const [selectedForm, setSelectedForm] = useState(null); // Form object selected for modal
    const [all_gp_beneficiary_data_fetch, set_all_gp_beneficiary_data_fetch] = useState([]); // Form object selected for modal

    // --- Data Filtering and Pagination (Primary Table) ---
    const filteredGPs = useMemo(() => {
        return all_gp_beneficiary_data_fetch.filter((gp:any) =>
            gp.gpName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm,all_gp_beneficiary_data_fetch]);

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

    const handleFormRowClick = (form:any) => {
        setSelectedForm(form);
    };

    const closeFormModal = () => {
        setSelectedForm(null);
    };

  async function fetchData() {
    try {
      const response = await axios.get("/api/fetch-all-benificiary-datas");
    //   console.log(response?.data);
    set_all_gp_beneficiary_data_fetch(response?.data?.data)
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
                    Beneficiary Datas
                </h1>
            </header>

            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Search Box (Primary Table) */}
                <div className="flex justify-center p-4 bg-white rounded-xl shadow-md border-l-4 border-indigo-500">
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by GP Name..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset page on search
                                setExpandedGpId(null); // Collapse any expanded row
                            }}
                            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm text-black focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Primary Table: GP List */}
                <div className="bg-white rounded-xl shadow-lg border">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-indigo-600" />
                            Gram Panchayat Submissions ({filteredGPs.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">SL No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GP Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GP ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head of GP</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Forms Submitted</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedGPs.length > 0 ? (
                                    paginatedGPs.map((gp:any, index:any) => (
                                        <React.Fragment key={gp.gp_id}>
                                            <tr 
                                                className="hover:bg-indigo-50 cursor-pointer transition duration-150"
                                                onClick={() => handleGpRowClick(gp.gp_id)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-16">
                                                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                                    {gp.gpName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {gp.gp_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {gp.gpHead}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-md font-bold text-green-600">
                                                    {gp.formsSubmitted}
                                                </td>
                                            </tr>
                                            {/* Nested/Secondary Table for Forms */}
                                            {expandedGpId === gp.gp_id && (
                                                <tr>
                                                    <td colSpan={5} className="p-0">
                                                        <FormTable forms={gp.forms} handleFormRowClick={handleFormRowClick} />
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-6 text-gray-500">
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
            <FormDetailModal 
                isOpen={!!selectedForm} 
                onClose={closeFormModal} 
                form={selectedForm} 
            />
        </div>
    );
};

export default BeneficiaryDataPage;