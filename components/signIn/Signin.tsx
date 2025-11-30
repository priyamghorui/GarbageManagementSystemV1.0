import React, { useRef, useState } from "react";
import { Loader2, Mail, Lock, ChevronDown } from "lucide-react";
import { signIn } from "next-auth/react";

// The component is renamed to Signin to avoid potential naming conflicts if integrated
const Signin = () => {
  const userNameOrEmailRef = useRef("");
  const passwordRef = useRef("");
  const [adminType, setAdminType] = useState('block'); // New state for dropdown
  const [message, setMessage] = useState("");
  const [isLoadingSignText, setisLoadingSignText] = useState(false);

  // Placeholder function for form submission.
  const onSubmit = async (e:any) => {
    e.preventDefault();
    setMessage("");

    setisLoadingSignText(true);
    const res:any = await signIn("credentials", {
      email: userNameOrEmailRef.current,
      password: passwordRef.current,
      adminType:adminType,
      redirect: false,
    });
    // console.log(res);
    
    if (res?.ok) {
      window.location.href = `/${adminType=="gp"?adminType+'s':adminType}/dashboard`;
    } else {
      setisLoadingSignText(false);
      setMessage("Invalid credentials or type mismatch. Please check your inputs.");
      // setMessage(res?.error);
    }
  };

  return (
    // Centered container for the sign-in card against a dark background
    <div className="flex min-h-screen items-center justify-center ">
      <div className="w-full max-w-md rounded-xl bg-gray-800 p-8 shadow-2xl border border-gray-700">
        
        {/* Header/Title */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-400">Welcome Back</h1>
            <p className="text-gray-400 mt-2">Sign in to manage your city's waste reports.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">

          {/* Admin Type Dropdown - NEW FIELD */}
          <div>
            <label htmlFor="admin-type" className="block text-sm font-medium text-gray-300 mb-1">
                Select Admin Type
            </label>
            <div className="relative">
                {/* Custom styling for the select dropdown */}
                <select
                    id="admin-type"
                    name="admin-type"
                    value={adminType}
                    onChange={(e) => setAdminType(e.target.value)}
                    required
                    className="appearance-none w-full rounded-lg border border-gray-600 bg-gray-700 pl-4 pr-10 py-3 text-base text-white placeholder:text-gray-400 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500 cursor-pointer"
                >
                    <option value="gp" className="bg-gray-700 text-white">Gram Panchayat (GP)</option>
                    <option value="block" className="bg-gray-700 text-white">Block</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Username/Email Input */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Username or email address"
                name="username"
                required
                onChange={(e) => (userNameOrEmailRef.current = e.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-gray-700 pl-10 pr-5 py-3 text-base text-white placeholder:text-gray-400 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                onChange={(e) => (passwordRef.current = e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-gray-600 bg-gray-700 pl-10 pr-5 py-3 text-base text-white placeholder:text-gray-400 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-lg text-white font-semibold bg-green-600 border border-green-600 hover:bg-green-700 transition duration-300 shadow-md disabled:bg-green-800 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoadingSignText}
            >
              {isLoadingSignText ? (
                <p className="flex justify-center items-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Checking Credentials...
                </p>
              ) : (
                "Sign In"
              )}
            </button>
            <p className="text-center p-2 text-red-400 text-sm h-5">{message}</p>
          </div>
        </form>

        {/* Links: Forgot Password & Sign Up */}
        <div className="mt-6 text-center space-y-2">
            <a
                href="/#"
                className="inline-block text-sm text-gray-300 hover:text-green-400 hover:underline transition duration-150"
            >
                Forgot Password?
            </a>
            <p className="text-gray-400 text-sm">
                Not a member yet?{" "}
                <a href="/#" className="text-green-400 hover:underline font-medium transition duration-150">
                    Sign Up
                </a>
            </p>
        </div>

      </div>
    </div>
  );
};

export default Signin;