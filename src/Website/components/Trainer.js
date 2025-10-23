import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import trainerImg from "../Assets/Trainerimage.png";

export default function TrainerProfile() {
  const [activeTab, setActiveTab] = useState("training");
  const navigate = useNavigate(); // React Router navigation hook

  // Define tab content dynamically
  const tabs = [
    {
      id: "training",
      label: "Training",
      heading: "Training Programs",
      link: "https://exams.edzest.org/learn/batch/PMP-Exam-Prep-Jan",
      linkText: "Join an upcoming batch",
      description:
        "Learn from comprehensive training programs designed to help you succeed in certification and develop practical project management skills.",
    },
    {
      id: "experience",
      label: "Experience",
      heading: "Trainer's Experience",
      link: "https://www.linkedin.com/company/edzest/?originalSubdomain=in",
      linkText: "Connect on LinkedIn",
      description:
        "Over 10 years of industry experience helping professionals achieve their career goals through expert guidance and mentoring.",
    },
    {
      id: "education",
      label: "Education",
      heading: "Educational Background",
      link: "/contact", // React Router path to contact form
      linkText: "Send an Email",
      description:
        "Certified PMP® instructor with formal education in project management and leadership, ensuring the highest quality training.",
    },
  ];

  // Find the active tab's content
  const activeContent = tabs.find((tab) => tab.id === activeTab);

  // Handle link click (checks for internal navigation)
  const handleLinkClick = (link) => {
    if (link.startsWith("/")) {
      navigate(link); // Internal navigation
    } else {
      window.open(link, "_blank", "noopener,noreferrer"); // External navigation
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-auto bg-purple-50 p-4 lg:p-6">
      {/* Content Section */}
      <div className="custom-light-purple rounded-lg shadow-lg p-4 lg:p-6 w-full lg:w-1/2">
        <h1 className="text-3xl lg:text-4xl font-bold text-black mb-4">About the trainer</h1>

        {/* Tabs */}
        <div className="flex space-x-2 lg:space-x-4 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 lg:px-4 lg:py-2 rounded-full font-semibold text-sm lg:text-base ${
                activeTab === tab.id
                  ? "bg-[#4748ac] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div>
          <h2 className="text-xl lg:text-2xl font-bold mb-2">
            {activeContent.heading}
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm lg:text-base mb-3">
            {activeContent.description}
          </p>

          {/* Tab Link */}
          <button
            onClick={() => handleLinkClick(activeContent.link)}
            className="text-[#4748ac] font-semibold underline text-sm lg:text-base"
          >
            {activeContent.linkText}
          </button>
        </div>
      </div>

      {/* Trainer Image */}
      <div className="relative w-32 h-32 lg:w-48 lg:h-48 mt-4 lg:mt-0 lg:ml-6">
        <div className="w-full h-full rounded-full bg-[#4748ac] flex justify-center items-center">
          <img
            src={trainerImg}
            alt="Trainer"
            className="w-28 h-28 lg:w-44 lg:h-44 object-cover rounded-full"
          />
        </div>
      </div>
    </div>
  );
}