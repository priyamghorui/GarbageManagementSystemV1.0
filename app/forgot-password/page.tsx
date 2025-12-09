// components/ForgotPasswordForm.js
"use client";

import React, { useState } from "react";
import { Mail, Lock, Key, Check, X, Send } from "lucide-react";

// --- Component Definition ---
export default function ForgotPasswordForm() {
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Set New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage]:any = useState(null); // { type: 'success' | 'error', text: string }
  const [isLoading, setIsLoading] = useState(false);
  const [otpId, setotpId] = useState("");

  // Placeholder functions for API calls (replace with actual API logic)
  const simulateApiCall = async (delay = 1000) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, delay));
    setIsLoading(false);
  };

  // --- Handlers ---

  // STEP 1: Send OTP
  const handleSendOtp = async (e:any) => {
    e.preventDefault();
    setMessage(null);

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const res1 = await fetch("/api/otp-manager-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });
      const res = await res1.json();
      if (res1.ok && res.success) {
        setotpId(res.otpId);
        setMessage({
          type: "success",
          text: `OTP sent to ${email}. Check your inbox! OTP available for 10 minutes.`,
        });
        setStep(2);
      } else {
        throw new Error("Something went wrong.");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Email not found or failed to send OTP.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e:any) => {
    e.preventDefault();
    setMessage(null);

    if (otp.length !== 4) {
      setMessage({ type: "error", text: "OTP must be 4 digits long." });
      return;
    }

    try {
      const res1 = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpId, otp, email }),
      });
      const res = await res1.json();

      if (res1.ok && res.success) {
        setMessage({
          type: "success",
          text: "OTP verified. Now set your new password.",
        });
        setStep(3);
      } else {
        throw new Error("Something went wrong.");
      }
    } catch (error: any) {
      setMessage({ type: "error", text: "Invalid OTP. Please try again." });
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e:any) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters long.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    try {
      const res1 = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpId, otp, email, password: newPassword }),
      });
      const res = await res1.json();

      if (res1.ok && res.success) {
        setMessage({
          type: "success",
          text: "Password reset successfully! You can now log in.",
        });
        setStep(4); // Completed
      } else {
        throw new Error("Something went wrong.");
      }
    } catch (error: any) {
      setMessage({ type: "error", text: "Invalid OTP. Please try again." });
    }
    // Simulate password reset success
  };

  // Conditional render for the submit button text
  const renderButtonText = () => {
    if (isLoading) return "Processing...";

    switch (step) {
      case 1:
        return (
          <>
            <Send className="w-5 h-5 mr-2" /> Send OTP
          </>
        );
      case 2:
        return (
          <>
            <Key className="w-5 h-5 mr-2" /> Verify OTP & Set Password
          </>
        );
      case 3:
        return (
          <>
            <Lock className="w-5 h-5 mr-2" /> Submit New Password
          </>
        );
      default:
        return "Done";
    }
  };

  // Conditional render for the form submission handler
  const getFormHandler = () => {
    switch (step) {
      case 1:
        return handleSendOtp;
      case 2:
        return handleVerifyOtp;
      case 3:
        return handleResetPassword;
      default:
        return (e:any) => e.preventDefault();
    }
  };

  const isStepTwoOrThree = step === 2 || step === 3;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        {/* --- Welcome Card/Header --- */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-3">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 4 ? "Success!" : "Welcome Back!"}
          </h1>
          <p className="text-gray-500">
            {step === 4
              ? "Your password has been updated."
              : "Reset Your Password"}
          </p>
        </div>

        {/* --- Messages --- */}
        {message && (
          <div
            className={`flex items-center p-3 mb-4 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <X className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        {/* --- Form --- */}
        {step < 4 && (
          <form onSubmit={getFormHandler()} className="space-y-6">
            {/* Input 1: Email (Step 1) */}
            <div
              className={`${step > 1 ? "opacity-50 pointer-events-none" : ""}`}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="you@example.com"
                  required
                  disabled={step > 1}
                />
              </div>
            </div>

            {/* Input 2: OTP (Step 2 & 3) */}
            {isStepTwoOrThree && (
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  One-Time Password (OTP)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/[^0-9]/g, ""))
                    } // Only allow numbers
                    className="block w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter 4-digit OTP"
                    maxLength={4}
                    required
                    disabled={step === 3}
                  />
                </div>
              </div>
            )}

            {/* Input 3 & 4: New Password (Step 3) */}
            {step === 3 && (
              <>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Minimum 8 characters"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Re-enter new password"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button (Changes text based on step) */}
            <button
              type="submit"
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading
                  ? "bg-indigo-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150`}
              disabled={isLoading}
            >
              {renderButtonText()}
            </button>
          </form>
        )}

        {/* --- Go to Login (Step 4) --- */}
        {step === 4 && (
          <div className="pt-4">
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              Go to Login Page
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-500">
            Remember your password?
            <a
              href="/"
              className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
