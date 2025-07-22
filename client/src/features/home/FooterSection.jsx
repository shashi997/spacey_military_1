// client/src/features/home/FooterSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const FooterSection = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Links Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-yellow-400">
                  Home
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Courses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-yellow-400">
                <Twitter size={24} />
              </a>
              <a href="#" className="hover:text-yellow-400">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-yellow-400">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-yellow-400">
                <Linkedin size={24} />
              </a>
            </div>
          </div>


          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-700 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Spacey Military Learning. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
