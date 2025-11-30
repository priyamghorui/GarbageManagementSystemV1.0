"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, 
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
    Package,
    CreditCard
} from 'lucide-react';
import { useSession } from 'next-auth/react';
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
// --- DUMMY DATA GENERATOR ---
const generateDummyForms = (count:any) => {
    const forms = [];
    const panchayatName = "Anandapuri GP";
    
    for (let i = 1; i <= count; i++) {
        const isReserved = i % 3 !== 0; // Some random logic for caste
        forms.push({
            slNo: i,
            id: `BEN-2024-${1000 + i}`,
            dateOfSubmitted: `2024-11-${String((i % 30) + 1).padStart(2, '0')}`,
            aadhaarNo: `XXXX XXXX ${String(1000 + i).slice(-4)}`, // Masked for table
            fullAadhaar: `4589 1234 ${String(1000 + i).slice(-4)}`, // Full for details
            
            // Detail fields
            panchayat: panchayatName,
            wardVillage: `Ward No. ${Math.ceil(i / 5)}`,
            residentialAddress: `House No. ${i * 12}, Lane ${i % 4}, Anandapuri Village`,
            headOfFamilyName: `Beneficiary Name ${i}`,
            sex: i % 2 === 0 ? 'Female' : 'Male',
            age: 28 + (i % 40),
            phoneNo: `98765${String(10000 + i).slice(-5)}`,
            occupation: ['Farmer', 'Daily Wage Labourer', 'Self-Employed', 'Homemaker'][i % 4],
            caste: isReserved ? ['SC', 'ST', 'OBC'][i % 3] : 'General',
            hasCertificate: isReserved ? (i % 2 === 0 ? 'Yes' : 'No') : 'N/A',
            benefits: [
                'PM-AWAS Yojana', 
                i % 2 === 0 ? 'Ration Card' : 'Job Card',
                i % 5 === 0 ? 'Old Age Pension' : null
            ].filter(Boolean).join(', ')
        });
    }
    return forms;
};

const ALL_FORMS = generateDummyForms(45); // Generate 45 dummy records
const ITEMS_PER_PAGE = 8;

// --- SUB-COMPONENTS ---

// 1. Detail Modal
const FormDetailModal = ({ isOpen, onClose, form }:any) => {
    if (!isOpen || !form) return null;

    const DetailItem = ({ icon: Icon, label, value, highlight = false }:any) => (
        <div className={`p-3 rounded-lg ${highlight ? 'bg-purple-50 border border-purple-100' : 'bg-gray-50'}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase flex items-center mb-1">
                <Icon className={`w-4 h-4 mr-1.5 ${highlight ? 'text-purple-600' : 'text-blue-500'}`} />
                {label}
            </p>
            <p className={`text-sm font-bold break-words ${highlight ? 'text-purple-900' : 'text-gray-800'}`}>
                {value || 'N/A'}
            </p>
        </div>
    );

    return (
        <div className="fixed inset-0  bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all scale-100">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-xl sticky top-0 z-10">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Form Details</h3>
                        <p className="text-sm text-gray-500 font-medium">ID: <span className="text-blue-600">{form._id}</span></p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-gray-400 hover:text-red-500 cursor-pointer hover:bg-red-50 rounded-full transition duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    
                    {/* Location Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailItem icon={ClipboardList} label="Panchayat" value={form.panchayet} highlight />
                        <DetailItem icon={MapPin} label="Ward / Village" value={form.ward} />
                    </div>

                    <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                        <p className="text-xs font-bold text-blue-800 uppercase mb-1 flex items-center">
                            <MapPin className="w-4 h-4 mr-1.5" /> Residential Address
                        </p>
                        <p className="text-sm text-gray-800">{form.residentialAddress}</p>
                    </div>

                    {/* Personal Info Grid */}
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-1 mt-2">Personal Information</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <DetailItem icon={User} label="Head of Family" value={form.headOfTheFamilyName} />
                        <DetailItem icon={User} label="Sex" value={form.sex} />
                        <DetailItem icon={Calendar} label="Age" value={form.age} />
                        <DetailItem icon={Scan} label="Aadhaar No." value={form.aadhaarNumber} />
                        <DetailItem icon={Phone} label="Phone No." value={form.phoneNumber} />
                        <DetailItem icon={Briefcase} label="Occupation" value={form.occupation} />
                    </div>

                    {/* Social & Benefits Grid */}
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-1 mt-2">Social Category & Benefits</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem icon={Shield} label="Caste" value={form.isCaste} />
                        <DetailItem icon={CheckCircle} label="Has Certificate?" value={form.hasCertificate} />
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                         <p className="text-xs font-bold text-green-800 uppercase mb-2 flex items-center">
                            <Package className="w-4 h-4 mr-1.5" /> Benefits / Assistance Taken
                        </p>
                        <p className="text-sm flex flex-col text-green-900">{form.assistanceTakenFromGovernment.map((e:any,index:any)=>(<span key={index} >{index+1} : {e}</span>))}</p>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                        <p className="text-xs text-gray-400 italic flex items-center">
                            <Calendar className="w-3 h-3 mr-1" /> Submitted on: {form.dateOfSubmitted}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
const SubmittedBeneficiaryFormsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedForm, setSelectedForm] = useState(null);
    const [benificiary_data_gp, set_benificiary_data_gp] = useState([]);

    // Filter Logic
    const filteredForms = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return benificiary_data_gp.filter((form:any) => 
            form._id.toLowerCase().includes(lowerSearch) ||
            form.aadhaarNumber.toLowerCase().includes(lowerSearch) || // Search by masked aadhaar (for demo)
            form.headOfTheFamilyName.toLowerCase().includes(lowerSearch)
        );
    }, [searchTerm,benificiary_data_gp]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredForms.length / ITEMS_PER_PAGE);
    const paginatedForms = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredForms.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredForms, currentPage]);

    const handlePageChange = (newPage:any) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    };


  const { data: session, status }: any = useSession();

  async function fetchData() {
    try {
      const response = await axios.get(
       `/api/fetch-benificiary-datas-via-gp?id=${session?.user?._id}`
      );
    //   console.log(response?.data);
      set_benificiary_data_gp(response?.data?.data);
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
            
            {/* Header */}
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
                    Submitted Beneficiary Forms
                </h1>
                <p className="text-center text-gray-500 mt-2">Manage and view details of all registered beneficiaries.</p>
            </header>

            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Search Bar */}
                <div className="flex justify-end">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by ID, Name, or Aadhaar..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-black leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 shadow-sm"
                        />
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-20">
                                        Sl No.
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Form ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Date Submitted
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Aadhaar No.
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedForms.length > 0 ? (
                                    paginatedForms.map((form:any, index:any) => (
                                        <tr 
                                            key={form._id} 
                                            className="hover:bg-blue-50 transition duration-150 cursor-pointer group"
                                            onClick={() => setSelectedForm(form)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                                {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 group-hover:text-blue-800">
                                                {form._id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(form.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                                                {form.aadhaarNumber}
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
                                                <p className="text-lg font-medium">No records found</p>
                                                <p className="text-sm">Try adjusting your search terms.</p>
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
                                        Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredForms.length)}</span> of <span className="font-medium">{filteredForms.length}</span> results
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
            <FormDetailModal 
                isOpen={!!selectedForm} 
                onClose={() => setSelectedForm(null)} 
                form={selectedForm} 
            />

        </div>
    );
};

export default SubmittedBeneficiaryFormsPage;