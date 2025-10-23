import React from 'react';
import mockphotoImg from "../Assets/mockphoto.png";
import Contact from "./Contact";
import Footer from "./Footer";
import heroImage from '../Assets/mock exam img.png';
import AdBanner from '../components/AdBanner';
 
// Keyframes for animation
const styles = `
  @keyframes fade-in-up {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
  }
  .animate-fade-in-up {
    animation: fade-in-up 1s ease-out;
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
`;
 
const PMPPracticeMockExams = () => {
  return (
    <div>
      <style>{styles}</style>
      <AdBanner />
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between h-auto md:h-[70vh] px-6 md:px-16 py-12 md:py-0" style={{ fontFamily: "sans-serif", fontSize: "17px" }}>
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-black-600 animate-fade-in-up">
            PMP® Practice <br />
            Mock Exams by <span className="text-[#4748ac]">Edzest</span>
          </h1>
          <p className="text-gray-500 mt-4 animate-fade-in-up" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
            Get Real Exam-Like Questions and Expert Insight
          </p>
          <a href="https://exams.edzest.org/learn/PMP-Mock-Exams" target="_blank" rel="noopener noreferrer">
            <button className="bg-[#4748ac] text-white px-6 py-3 rounded-lg mt-4 hover:bg-[#3737ac] transition">
              Buy Now
            </button>
          </a>
        </div>
        <div className="mt-8 md:mt-0">
          <img
            src={heroImage}
            alt="PMP Training"
            className="w-full max-w-[600px] h-auto object-contain animate-float"
          />
        </div>
      </div>
 
      {/* What's Included Section */}
      <div className="bg-purple-100 py-12" style={{ fontFamily: "sans-serif", fontSize: "17px" }}>
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-10 animate-fade-in-up">What's Included:</h1>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300 animate-fade-in-up">
              <lord-icon
                src="https://cdn.lordicon.com/vfczflna.json"
                trigger="hover"
                colors="primary:#f97316,secondary:#f43f1a"
                style={{ width: "80px", height: "80px" }}
              ></lord-icon>
              <h2 className="text-xl font-bold text-[#4748ac] mt-4 mb-2">ECO Domain-wise Mini Tests</h2>
              <p className="text-gray-600 text-center">
                Practice mini tests focused on People, Process, and Business Environment domains.
              </p>
            </div>
 
            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300 animate-fade-in-up">
              <lord-icon
                src="https://cdn.lordicon.com/igpbsrza.json"
                trigger="hover"
                colors="primary:#f97316,secondary:#f43f1a"
                style={{ width: "80px", height: "80px" }}
              ></lord-icon>
              <h2 className="text-xl font-bold text-[#4748ac] mt-4 mb-2">Full-Length Mock Simulators</h2>
              <p className="text-gray-600 text-center">
                5 complete full-length simulations with 180 questions each — total 900 real exam-like questions.
              </p>
            </div>
 
            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300 animate-fade-in-up">
              <lord-icon
                src="https://cdn.lordicon.com/nocovwne.json"
                trigger="hover"
                colors="primary:#f97316,secondary:#f43f1a"
                style={{ width: "80px", height: "80px" }}
              ></lord-icon>
              <h2 className="text-xl font-bold text-[#4748ac] mt-4 mb-2">Detailed Video Explanations</h2>
              <p className="text-gray-600 text-center">
                Every answer explained clearly via recorded expert video solutions.
              </p>
            </div>
 
            {/* Card 4 */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300 animate-fade-in-up">
              <lord-icon
                src="https://cdn.lordicon.com/abfverha.json"
                trigger="hover"
                colors="primary:#f97316,secondary:#f43f1a"
                style={{ width: "80px", height: "80px" }}
              ></lord-icon>
              <h2 className="text-xl font-bold text-[#4748ac] mt-4 mb-2">Analytics & Reports</h2>
              <p className="text-gray-600 text-center">
                Track your performance with detailed analytics and personalized reports after each test.
              </p>
            </div>
 
            {/* Card 5 */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300 animate-fade-in-up">
              <lord-icon
                src="https://cdn.lordicon.com/ajkxzzfb.json"
                trigger="hover"
                colors="primary:#f97316,secondary:#f43f1a"
                style={{ width: "80px", height: "80px" }}
              ></lord-icon>
              <h2 className="text-xl font-bold text-[#4748ac] mt-4 mb-2">Group Revision Seminars</h2>
              <p className="text-gray-600 text-center">
                Free access to group-based doubt clearing and live revision webinars.
              </p>
            </div>
          </div>
 
          {/* CTA Button */}
          <div className="flex justify-center gap-4 mt-12">
            <a href="https://exams.edzest.org/learn/PMP-mock-exams" target="_blank" rel="noopener noreferrer">
              <button className="bg-[#4748ac] hover:bg-[#3737ac] text-white font-semibold py-3 px-8 rounded-lg text-lg transition">
                Enroll Now
              </button>
            </a>
          </div>
        </div>
      </div>
 
      {/* Contact & Footer */}
      <Contact />
      <Footer />
    </div>
  );
};
 
export default PMPPracticeMockExams;