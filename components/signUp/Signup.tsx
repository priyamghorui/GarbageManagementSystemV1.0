import React, { useRef, useState } from "react";
import {
  Loader2,
  Mail,
  Lock,
  ChevronDown,
  User,
  KeyRound,
  Phone,
  X,
} from "lucide-react";
import { signIn } from "next-auth/react";

// The component is renamed to Signin to avoid potential naming conflicts if integrated
const Signup = ({close}:any) => {
  const formRef: any = useRef(null);
  const userNameOrEmailRef = useRef("");
  const usernameref = useRef("");
  const userOtpRef = useRef("");
  const mobileNumber: any = useRef(0);
  const passwordRef = useRef("");
  const [adminType, setAdminType] = useState("regular"); // New state for dropdown
  const [message, setMessage] = useState("");
  const [isLoadingSignText, setisLoadingSignText] = useState(false);
  const [otpView, setotpView] = useState(false);
  const [otpId, setOtpId] = useState<string | null>(null); // Use string | null type

  // Placeholder function for form submission.
  const onSubmit = async (e: any) => {
    e.preventDefault();
    setMessage("");

    if (
      !userNameOrEmailRef.current ||
      !mobileNumber.current ||
      !passwordRef.current ||
      passwordRef.current.length < 8 ||
      mobileNumber.current?.length != 10
    ) {
      setMessage("Check all the fields properly !!");
      return;
    }
    // formRef.current.reset();
    // console.log(userNameOrEmailRef.current,mobileNumber.current,passwordRef.current);

    if (!otpView && !userOtpRef.current) {
      setisLoadingSignText(true);
      try {
        const res = await fetch("/api/otp-manager", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userNameOrEmailRef.current,
            password: passwordRef.current,
          }),
        });
        const response = await res.json();

        if (res.ok && response.success) {
          setOtpId(response.otpId);
          setotpView(true);
          setMessage(response.message);
        } else {
          setMessage(response.message || "Failed to send OTP.");
        }
      } catch (error) {
        // console.error("OTP request exception:", error);
        setMessage("An unexpected error occurred while requesting OTP.");
      }
    }
    if (otpView && userOtpRef.current) {
      try {
        // const res = await simulateRegister(otpId, otp, password);
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: usernameref.current,
            email: userNameOrEmailRef.current,
            mobile: mobileNumber.current,
            password: passwordRef.current,
            otp: userOtpRef.current,
            otpId: otpId,
          }),
        });
        const response = await res.json();
        if (res.ok && response?.success) {
          formRef.current.reset();
          setotpView(false);
          setOtpId(null);
          setMessage(response.message);

          // return (window.location.href = "/sign-up?registered=true");
        } else {
          setMessage(response.message || "Registration failed.");
        }
      } catch (error) {
        console.error("Registration exception:", error);
        setMessage("An unexpected error occurred during registration.");
      }
    }
    setisLoadingSignText(false);
    // console.log(res);
  };

  return (
    // Centered container for the sign-in card against a dark background
    <div className="flex min-h-screen items-center justify-center ">
      <div className="w-full max-w-md rounded-xl bg-gray-800 p-8 shadow-2xl border border-gray-700">
        {/* Header/Title */}
        <div className="text-center mb-8">
                    <div className="flex flex-row-reverse cursor-pointer">
                <X className="w-6 h-6" onClick={()=>{close()}}/>
          </div>
          <h1 className="text-3xl font-bold text-green-400">Welcome</h1>
          <p className="text-gray-400 mt-2">
            Sign Up to manage your city's waste reports.
          </p>
        </div>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
          {/* Username/Email Input */}
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Username"
                name="username"
                required
                onChange={(e) => (usernameref.current = e.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-gray-700 pl-10 pr-5 py-3 text-base text-white placeholder:text-gray-400 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
          {/* Username/Email Input */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="email"
                placeholder="Email address"
                name="email"
                required
                onChange={(e) => (userNameOrEmailRef.current = e.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-gray-700 pl-10 pr-5 py-3 text-base text-white placeholder:text-gray-400 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
          {/* mobile number Input */}
          <div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                placeholder="Mobile Number"
                name="mobileNumber"
                required
                onChange={(e) => (mobileNumber.current = e.target.value)}
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
                placeholder="Enter your password (At least 8 character)"
                required
                className="w-full rounded-lg border border-gray-600 bg-gray-700 pl-10 pr-5 py-3 text-base text-white placeholder:text-gray-400 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
          {/* otp Input */}
          {otpView && (
            <div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  onChange={(e) => (userOtpRef.current = e.target.value)}
                  placeholder="Enter your OTP"
                  required
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 pl-10 pr-5 py-3 text-base text-white placeholder:text-gray-400 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-lg cursor-pointer text-white font-semibold bg-green-600 border border-green-600 hover:bg-green-700 transition duration-300 shadow-md disabled:bg-green-800 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoadingSignText}
            >
              {isLoadingSignText ? (
                <p className="flex justify-center items-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Please Wait...
                </p>
              ) : (
                <>{otpView ? "Submit" : "Send OTP"}</>
              )}
            </button>

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
        </form>

        {/* Links: Forgot Password & Sign Up */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-400 text-sm">
            Are you a member?{" "}
            <a
              href="/"
              className="text-green-400 hover:underline font-medium transition duration-150"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
