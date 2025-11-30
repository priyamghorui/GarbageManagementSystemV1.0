import React from "react";
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="footer" className="bg-gray-900 text-white pt-12 pb-6 border-t border-green-700 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Column 1: About */}
          <div className="lg:col-span-2">
            <a href="/" className="logo inline-flex items-center mb-4">
              <span className="text-2xl font-bold text-green-400">Garbage Management System</span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A Garbage Management System efficiently handles the collection,
              transportation, and disposal of waste, turning a potential health
              hazard into a clean and sustainable process. It utilizes
              technology to optimize routes, monitor fill levels, and promote
              recycling, thereby creating healthier communities and a cleaner
              environment.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition duration-150" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition duration-150" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition duration-150" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition duration-150" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-green-300">Useful Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition duration-150">Home</a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-green-400 transition duration-150">About us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition duration-150">Terms of service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition duration-150">Privacy policy</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Initiative */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-green-300">Our Initiative</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition duration-150">Collection and Transportation</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition duration-150">Processing and Recycling</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition duration-150">Citizen and Community Engagement</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition duration-150">Data and Analytics</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us - Note: Original had a col-lg-3, adjusted to col-lg-4 in Tailwind grid logic */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <h4 className="text-lg font-semibold mb-4 text-green-300">Contact Us</h4>
            <div className="text-gray-400 text-sm space-y-1">
              <p>Singur, Hooghly</p>
              <p>West Bengal, 712409</p>
              <p>India</p>
              <p className="mt-4">
                <strong className="text-white font-medium">Phone:</strong> <span className="ml-1">+91 000000000</span>
              </p>
              <p>
                <strong className="text-white font-medium">Email:</strong> <span className="ml-1">info@example.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="pt-8 mt-12 border-t border-gray-700 text-center text-sm">
          <p className="text-gray-400 mb-1">
            &copy; <span>Copyright</span>{" "}
            <strong className="px-1 text-green-400">Website</strong>{" "}
            <span>All Rights Reserved</span>
          </p>
          <div className="text-gray-500">
            Designed by
            <a href="https://priyamghorui.com/" className="text-green-500 hover:text-green-400 ml-1 transition duration-150"> Priyam Ghorui</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;