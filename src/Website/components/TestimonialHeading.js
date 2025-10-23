import React from "react";
 
const TestimonialHeading = () => {
  return (
    <div className="text-center mt-10 relative">
      <h2
        className="text-4xl font-bold text-[#3B3BB2] relative inline-block"
        style={{ fontFamily: "sans-serif" }}
      >
        Testimonial
        {/* Animated Underline */}
        <span
          className="absolute left-0 bottom-0 h-1 rounded-full bg-gradient-to-r from-pink-300 to-orange-500 animate-underline"
          style={{
            transform: "translateY(0.6em)",
            height: "4px",
            width: "100%",
            transformOrigin: "left"
          }}
        ></span>
      </h2>
 
      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes underlineGrow {
            0% {
              transform: scaleX(0);
              opacity: 0;
            }
            100% {
              transform: scaleX(1);
              opacity: 1;
            }
          }
 
          .animate-underline {
            animation: underlineGrow 1s ease-out forwards;
            transform: scaleX(0);
            opacity: 0;
          }
        `}
      </style>
    </div>
  );
};
 
export default TestimonialHeading;