"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader2, LogIn, Menu, X } from "lucide-react"; // Icons for mobile toggle
import Signin from "../signIn/Signin";
import { signOut, useSession } from "next-auth/react";
import Signup from "../signUp/Signup";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  // Note: The original component had commented-out complex logic (axios, isLoading)
  // For the UI conversion, these dependencies are removed to focus on the structure and styling.
  // We keep the "Home" link as the only active link.
  const signInRef = useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = useState(false);
  const handleScroll = () => {
    setSticky(window.scrollY >= 10);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (
      signInRef.current &&
      !signInRef.current.contains(event.target as Node)
    ) {
      setIsSignInOpen(false);
      setIsSignUpOpen(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSignInOpen]);
  useEffect(() => {
    if (isSignInOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSignInOpen]);
  const { data: session, status }: any = useSession();
  //  const session =  getServerSession(authOptions);
  // useEffect(()=>{console.log(status,session);
  // },[session])
  return (
    <nav
      className={`bg-gray-800 shadow-md${
        sticky ? " shadow-lg bg-body-bg bg-banner-image" : "shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand/Logo */}
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-white tracking-wide">
              Garbage Management System
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="/"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                Home
              </a>
              {/* Optional buttons/links can be added here */}

              {status === "loading" ? (
                <>
                  <div className="flex items-center space-x-2 text-gray-500 bg-gray-100 px-4 py-2 rounded-xl text-sm font-semibold animate-pulse">
                    <Loader2 className="w-7 h-7 animate-spin" />
                    <span>Loading Auth...</span>
                  </div>
                </>
              ) : (
                <>
                  {session?.user?.typeAdmin == "block" ? (
                    <a
                      href="/block/dashboard"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150"
                    >
                      Dashboard
                    </a>
                  ) : (
                    <>
                      {" "}
                      {session?.user?.typeAdmin == "gp" ? (
                        <a
                          href="/gps/dashboard"
                          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150"
                        >
                          Dashboard
                        </a>
                      ) : (
                        <>   {session?.user?.typeAdmin == "regular" ? (
                        <a
                          href="/regular/dashboard"
                          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150"
                        >
                          Dashboard
                        </a>
                      ) : (
                        <></>
                      )}</>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {status === "loading" ? (
            <>
              {" "}
              <div className="flex items-center space-x-2 text-gray-500 bg-gray-100 px-4 py-2 rounded-xl text-sm font-semibold animate-pulse">
                <Loader2 className="w-7 h-7 animate-spin" />
                <span>Loading Auth...</span>
              </div>
            </>
          ) : (
            <>
              {" "}
              {session ? (
                <div className="hidden lg:block">
                  {/* The original Button logic was commented out, so we provide a sleek, functional Tailwind placeholder */}
                  <button
                    // onClick={handleLogout} // Uncomment and implement actual logic
                    className="px-4 py-2 bg-green-600 flex cursor-pointer text-white text-sm font-medium rounded-lg hover:bg-green-700 transition duration-150 shadow-lg"
                    aria-label="Action button"
                    onClick={() => {
                      signOut();
                    }}
                  >
                    <LogIn className="w-5 h-5 mr-2 text-white" />
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex">
                <div className="hidden lg:block mr-3">
                  {/* The original Button logic was commented out, so we provide a sleek, functional Tailwind placeholder */}
                  <button
                    // onClick={handleLogout} // Uncomment and implement actual logic
                    className="px-4 py-2 bg-green-600 flex text-white text-sm font-medium rounded-lg hover:bg-green-700 transition duration-150 shadow-lg"
                    aria-label="Action button"
                    onClick={() => {
                      setIsSignInOpen(true);
                    }}
                  >
                    <LogIn className="w-5 h-5 mr-2 text-white" />
                    Sign In
                  </button>
                </div>
                <div className="hidden lg:block">
                  {/* The original Button logic was commented out, so we provide a sleek, functional Tailwind placeholder */}
                  <button
                    // onClick={handleLogout} // Uncomment and implement actual logic
                    className="px-4 py-2 bg-green-600 flex text-white text-sm font-medium rounded-lg hover:bg-green-700 transition duration-150 shadow-lg"
                    aria-label="Action button"
                    onClick={() => {
                      setIsSignUpOpen(true);
                    }}
                  >
                    <LogIn className="w-5 h-5 mr-2 text-white" />
                    Sign Up
                  </button>
                </div>
                
                
                </div>

              )}
            </>
          )}

          {/* Desktop Auth/Action Button (Placeholder for LogOut/SignIn) */}

          {isSignInOpen && (
            <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
              <div ref={signInRef} className="w-lg">
                <button
                  onClick={() => setIsSignInOpen(false)}
                  className="absolute top-0 right-0 mr-8 mt-8 cursor-pointer"
                  aria-label="Close Sign In Modal"
                >
                  {/* <Icon
                              icon="tabler:currency-xrp"
                              className="text-white hover:text-primary text-24 inline-block me-2"
                            /> */}
                </button>
                <Signin />
              </div>
            </div>
          )}
          {isSignUpOpen && (
            <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
              <div ref={signInRef} className="w-lg">
                <button
                  onClick={() => setIsSignUpOpen(false)}
                  className="absolute top-0 right-0 mr-8 mt-8 cursor-pointer"
                  aria-label="Close Sign In Modal"
                >
                  {/* <Icon
                              icon="tabler:currency-xrp"
                              className="text-white hover:text-primary text-24 inline-block me-2"
                            /> */}
                </button>
                <Signup />
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`${isOpen ? "block" : "hidden"} lg:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="/"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-150"
          >
            Home
          </a>

          {/* Mobile Auth/Action Button */}
          <button
            // onClick={handleLogout} // Uncomment and implement actual logic
            className="w-full text-left px-3 py-2 bg-green-600 text-white text-base font-medium rounded-md hover:bg-green-700 transition duration-150 shadow-md"
            aria-label="Action button"
          >
            Sign In / Action
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
