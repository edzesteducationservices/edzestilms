import React from 'react';
 
const LearnersBadge = () => {
  const avatars = [
    "https://randomuser.me/api/portraits/men/1.jpg",
    "https://randomuser.me/api/portraits/women/2.jpg",
    "https://randomuser.me/api/portraits/men/3.jpg",
    "https://randomuser.me/api/portraits/women/4.jpg",
    "https://randomuser.me/api/portraits/women/5.jpg",
    "https://randomuser.me/api/portraits/men/6.jpg",
  ];
 
  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
 
          .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
          }
 
          .avatar-hover:hover {
            transform: scale(1.1);
            transition: transform 0.3s ease;
          }
 
          .pulse {
            animation: pulseAnimation 2s infinite;
          }
 
          @keyframes pulseAnimation {
            0% {
              box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(249, 115, 22, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
            }
          }
        `}
      </style>
 
      <div className="flex items-center bg-white shadow-lg rounded-full px-4 py-2 space-x-2 w-fit animate-fade-in-up pulse">
        {/* Avatar group */}
        <div className="flex -space-x-3">
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt="Learner"
              className="w-8 h-8 rounded-full border-2 border-white object-cover avatar-hover"
            />
          ))}
        </div>
 
        {/* Text */}
        <div className="text-sm font-semibold text-gray-800">
          <span className="text-black font-bold">1000+</span> Learners
        </div>
      </div>
    </>
  );
};
 
export default LearnersBadge;