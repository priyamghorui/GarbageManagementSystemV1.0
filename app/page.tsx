import Image from "next/image";
import React from 'react';
import { Award, LogIn } from 'lucide-react';
import { Metadata } from "next";
const IMAGE_URL = "environment-4787978.jpg";
const BACKGROUND_IMAGE_URL = "garbage-6967966_19201.jpg";
export const metadata: Metadata = {
  title: "Garbage Management System",
  description: "A Initiative By Singur BDO",
};
export default function Home() {
  return (
       // Applied custom background image using style prop, along with Tailwind utility classes for scaling and fixing.
    <div 
      className="min-h-screen font-sans text-gray-800 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url('${BACKGROUND_IMAGE_URL}')` }}
    >

      {/* Header Section - Kept existing semi-transparent background for readability */}
      <header id="header" className=" pt-8 pb-16 md:pb-90 shadow-inner">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Admin Access Card (Top Right) */}
          {/* <div className="flex justify-end mb-8 md:mb-12">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-100 transition duration-300 hover:shadow-3xl">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center justify-center">
                  <LogIn className="w-5 h-5 mr-2 text-green-600" />
                  Admin Access
                </h2>
                <a 
                  href="/admins" 
                  className="inline-block w-full"
                  aria-label="Navigate to Admin Sign In Page"
                >
                  <button
                    className="w-full px-6 py-2 bg-green-700 text-white font-medium rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-150"
                  >
                    Admin Sign In
                  </button>
                </a>
              </div>
            </div>
          </div> */}

          {/* Main Title and Motto */}
          <div className="text-center pt-8">
            <p className="text-xl md:text-2xl text-gray-600 mb-2 font-medium">
              Clean City, Green Future.
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
              Turning Complaints into Cleaner Communities.
            </h1>
          </div>
        </div>
      </header>

      {/* About Section - Uses solid white background (bg-white) for text readability */}
      <section id="about" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Content Column */}
            <div className="lg:order-1 order-2">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 border-b-4 border-green-500 pb-2 inline-block">
                  The Benefits of a Clean City
                </h2>
                
                <div className="space-y-5">
                    <p className="text-xl leading-relaxed text-gray-700 font-semibold">
                      Public Health: A clean city is a healthy city. Proper
                      sanitation and waste management prevent the spread of
                      diseases, control pests, and ensure clean water and air. This
                      leads to a healthier population with lower rates of
                      respiratory illnesses, waterborne diseases, and other health
                      issues.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Environmental Sustainability: A clean city is built on a
                      foundation of environmental consciousness. This includes
                      robust recycling and composting programs, reduced carbon
                      emissions from transportation, and the preservation of natural
                      resources. By minimizing pollution and embracing sustainable
                      practices, a city can protect its local ecosystems and
                      contribute to a healthier planet.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Economic Growth and Tourism: Clean cities are more attractive
                      to tourists, businesses, and new residents. A well-maintained
                      and aesthetically pleasing urban environment boosts civic
                      pride and enhances a city's reputation, leading to increased
                      tourism revenue and economic investment. Cleanliness can also
                      increase property values and create a more desirable place to
                      live and work.
                    </p>
                </div>
              </div>
            </div>

            {/* Image Column */}
            <div className="lg:order-2 order-1">
              <div className="relative rounded-2xl shadow-2xl overflow-hidden border-8 border-white group">
                <img
                  src={IMAGE_URL}
                  alt="A clean urban environment representing a green future"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  // onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/4CAF50/ffffff?text=Image+Not+Found"; }}
                />
                
                {/* Floating Card */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 p-4 bg-white rounded-xl shadow-3xl w-[80%] max-w-sm border-t-4 border-green-500 opacity-95 transition duration-300 group-hover:opacity-100 group-hover:-translate-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-full text-yellow-600 shadow-md">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="text-lg font-bold text-gray-900">Clean Your City</h5>
                      <span className="text-sm text-gray-500">With Digital Innovation 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      
      {/* Spacer for bottom margin */}
      <div className="h-12"></div>
    </div>
  );
}
