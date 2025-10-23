import React from "react";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
 
const Footer = () => {
  return (
    <footer className="bg-[#f8f9fc] text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
       
        {/* Company Info + Updated Map */}
        <div className="col-span-2 space-y-4">
          <h4 className="text-xl font-bold text-[#4748ac]">Edzest Education Services (OPC) Pvt. Ltd.</h4>
          <p className="text-sm leading-relaxed text-gray-700">
            SY no. 42, Near J R Layout Haralur,<br />
            Bengaluru - 560102, Karnataka, India
          </p>
          <p className="text-sm text-gray-700">📧 contact@edzest.org</p>
          <p className="text-sm text-gray-700">📞 +91 9673332684</p>
 
          {/* ✅ New Google Maps Embed */}
          <div className="overflow-hidden rounded-xl shadow-md mt-4">
            <iframe
              title="Edzest Project Academy Map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1030.0968519245266!2d77.66720243180784!3d12.89951276851476!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9dfb0bd835d%3A0x441280ddf6d4dbd0!2sEdzest%20Project%20Academy!5e0!3m2!1sen!2sin!4v1747388592073!5m2!1sen!2sin"
              width="100%"
              height="180"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
 
        {/* Company Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-[#4748ac]">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-[#3737ac] transition">About Us</Link></li>
            <li><Link to="/privacypolicy" className="hover:text-[#3737ac] transition">Privacy Policy</Link></li>
            <li><Link to="/termsandconditions" className="hover:text-[#3737ac] transition">Terms & Conditions</Link></li>
            <li><Link to="/refundpolicy" className="hover:text-[#3737ac] transition">Refund Policy</Link></li>
          </ul>
        </div>
 
        {/* Support & Contact */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-[#4748ac]">Help & Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="hover:text-[#3737ac] transition">Contact Us</Link></li>
            <li><Link to="/training" className="hover:text-[#3737ac] transition">Training Programs</Link></li>
            <li><Link to="/faq" className="hover:text-[#3737ac] transition">FAQs</Link></li>
          </ul>
        </div>
      </div>
 
      {/* Footer Bottom */}
      <div className="border-t border-gray-300 py-4 bg-[#f1f3f6]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} Edzest Education Services. All rights reserved.</p>
          <div className="flex space-x-4 text-xl">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/company/edzest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-800 transition"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://www.youtube.com/@edzest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-600 transition"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
 
export default Footer;