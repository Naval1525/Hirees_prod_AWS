import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <div className="relative w-full bg-[#012760] py-12 sm:py-16 md:py-24 px-4 sm:px-8 md:px-56 min-h-[96vh] sm:h-[96vh] overflow-y-auto">
      <div className="container mx-auto max-w-7xl">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0 mb-8 sm:mb-12 md:mb-16">
          {/* Left Side */}
          <div className="w-full md:w-auto">
            <div className="font-k2d font-bold text-white text-[80px] leading-[100%] tracking-[0%] mb-3 sm:mb-4">
              Hirees
            </div>
            <p className="font-medium text-white text-lg sm:text-xl md:text-2xl max-w-md">
              Bridging talent with<br/> opportunities across <br/>industries.
            </p>
          </div>

          {/* Right Side - Newsletter */}
          <div className="w-full md:w-auto">
            <p className="font-semibold text-white text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4">
              Join our newsletter to keep up to date
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input 
                type="email" 
                placeholder="enter your email id"
                className="w-full sm:w-80 h-12 sm:h-16 px-4 sm:px-6 py-2.5 rounded-xl border border-solid border-white bg-transparent text-white placeholder-white/70 focus:outline-none focus:border-blue-400"
              />
              <button className="w-full sm:w-48 h-12 sm:h-16 px-4 sm:px-6 py-2.5 bg-black rounded-xl border-2 border-white hover:bg-white hover:text-black transition-colors duration-300">
                <span className="font-semibold text-white text-base sm:text-lg">
                  Subscribe
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Line */}
        <div className="w-full h-px bg-white/30 mb-8 sm:mb-12"></div>

        {/* Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12 p-4 sm:p-8 md:p-14">
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-xl sm:text-2xl mb-4 sm:mb-8">
              QUICK LINKS
            </h3>
            <div className="flex flex-col space-y-3 sm:space-y-4">
              {['Home', 'Post Jobs', 'Upload your CV', 'Find Jobs', 'Hire Now!'].map((link) => (
                <a 
                  key={link}
                  href="#" 
                  className="font-light text-white text-base sm:text-lg hover:text-blue-300 transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white text-xl sm:text-2xl mb-4 sm:mb-8">
              LEGAL
            </h3>
            <div className="flex flex-col space-y-3 sm:space-y-4">
              {['Privacy Policy', 'Terms & Conditions', 'Cookie Policy'].map((link) => (
                <a 
                  key={link}
                  href="#" 
                  className="font-light text-white text-base sm:text-lg hover:text-blue-300 transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="font-semibold text-white text-xl sm:text-2xl mb-4 sm:mb-8">
              CONTACT
            </h3>
            <div className="flex flex-col space-y-3 sm:space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white mr-3 sm:mr-4" />
                <a href="mailto:Support@hirees.com" className="font-light text-white text-base sm:text-lg hover:text-blue-300 transition-colors duration-300">
                  Support@hirees.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white mr-3 sm:mr-4" />
                <a href="tel:+17327460010" className="font-light text-white text-base sm:text-lg hover:text-blue-300 transition-colors duration-300">
                  + 1 732 746 0010
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white mr-3 sm:mr-4 mt-1" />
                <div className="font-light text-white text-base sm:text-lg">
                  FSTONE Technologies, LLC.<br />
                  2003 S Easton Rd, Suite 308,<br />
                  Doylestown, PA | 18901
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Line */}
        <div className="w-full h-px bg-white/30 mb-6 sm:mb-8"></div>

        {/* Copyright */}
        <p className="font-light text-white text-base sm:text-lg md:text-xl text-center md:text-left">
          ©FstoneTech 2024. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;