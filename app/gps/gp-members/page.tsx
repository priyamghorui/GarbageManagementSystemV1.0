// pages/gp/[gpName].js
"use client";
import { useEffect, useState } from 'react';
import { User, Mail, Key,Eye, EyeOff,  Lock } from 'lucide-react'; // Example Lucide imports for display
import { useSession } from 'next-auth/react';
import axios from 'axios';

// Mock Data for demonstration
const mockCredentials = [
  { id: 1, email: 'user1@beraberi.gov.in', password: 'securepassword123', status: 'Active' },
  { id: 2, email: 'user2@nasibpur.gov.in', password: 'secretpass456', status: 'Inactive' },
];
// components/AddCredentialModal.js

function AddCredentialModal({ isOpen, onClose, onSubmit,id }:any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async(e:any) => {
    e.preventDefault();
    if (email && password) {

       try {
        // const res = await simulateRegister(otpId, otp, password);
        const res = await fetch("/api/add-gpCradential-via-gp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gp_id:id,
            email: email,
            password: password,
          }),
        });
        const response = await res.json();
        if (res.ok && response?.success) {

          setMessage(response.message);

          // return (window.location.href = "/sign-up?registered=true");
                onSubmit({ email });
      setEmail('');
      setPassword('');
        } else {
          setMessage(response.message || "Registration failed.");
        }
      } catch (error) {
        console.error("Registration exception:", error);
        setMessage("An unexpected error occurred during registration.");
      }
    }
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-60 flex items-center justify-center transition-opacity duration-300">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4 transform transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b pb-3 mb-4">
            <div className='flex flex-col'>

          <h3 className="text-xl font-semibold text-gray-900">Add New GP Credential </h3>
          <p className="text-sm font-semibold text-gray-600">GP ID : {id}</p>
            </div>
          <button onClick={onClose} className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@gp.gov.in"
                  className="block w-full pl-10 pr-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                </div>
              <input
                // Toggles between 'password' and 'text' to show/hide the password
                type={showPassword ? 'text' : 'password'} 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Secure Password"
                className="block w-full pl-10 pr-10 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" /> // Lucide icon for hidden
                  ) : (
                    <Eye className="w-5 h-5" /> // Lucide icon for visible
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Modal Footer / Action Button */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium cursor-pointer text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!email || !password}
              className="px-4 py-2 text-sm font-medium cursor-pointer text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              Save Credential
            </button>
          </div>
        </form>
             {message && (
              <div
                className={`mt-4 p-3 rounded-lg border text-sm font-medium transition duration-300 ${
                  message.includes("successful") ||
                  message.includes("complete") ||
                  message.includes("successfully")
                    ? "bg-green-100 border-green-400 text-green-700"
                    : "bg-red-100 border-red-400 text-red-700"
                }`}
              >
                {message}
              </div>
            )}
      </div>
    </div>
  );
}
export default function GpCredentialsPage() {
//   const router = useRouter();
  // Get the dynamic GP name from the URL (e.g., 'BERABERI')
//   const { gpName } = "router.query"; 

  const [credentials, setCredentials]:any = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCredential = (newCredential:any) => {
    // 💡 In a real application, you would send this newCredential data to your backend API
    setCredentials([
      ...credentials, 
      { _id: Date.now().toString(), ...newCredential, access: true } 
    ]);
    // console.log(newCredential);
    
    setIsModalOpen(false); // Close the modal
  };
  const { data: session, status }: any = useSession();
    async function fetchData() {
    try {
        
      const response = await axios.get(
        `/api/cradentials-datas-gp?id=${session?.user?._id}`
      );
    
    //   console.log(response?.data?.data[0]?.gpCredentials);
      setCredentials(response?.data?.data[0]?.gpCredentials)
     
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
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <User className="w-8 h-8 text-indigo-600 mr-3" />
          Credentials for <span className="text-indigo-600 ml-2">{ session?.user?.gpName|| 'Loading...'}</span><span className="text-indigo-500 text-sm ml-2"> ID : { session?.user?._id|| 'Loading...'}</span>
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 flex items-center"
        >
          <Key className="w-5 h-5 mr-2" />
          Add New Credential
        </button>
      </div>

      {/* --- Credentials Table --- */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Mail className="w-4 h-4 inline mr-1" /> Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Password
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {credentials?.length>0&&(credentials.map((cred:any) => (
              <tr key={cred._id} className="hover:bg-indigo-50/50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cred.email}</td>
                {/* For security, display the password masked */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono tracking-widest">********</td> 
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    cred.access ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {cred.access?"Active":"Resticted"}
                  </span>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* --- Add Credential Modal --- */}
      <AddCredentialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCredential}
        id={session?.user?._id || ""}
      />
    </div>
  );
}