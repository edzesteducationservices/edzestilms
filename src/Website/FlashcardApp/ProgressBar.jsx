import React from "react";

const ProgressBar = ({ progress, score, totalCards }) => {
  return (
    <div
      className="progress-container mx-auto my-3"
      style={{ maxWidth: "500px", width: "100%",  }} // ✅ Ensure flexible width
    >
      <div className="d-flex justify-content-between">
        <strong style={{ marginTop: "8px", marginLeft:"11px" }}>
          Score: {score} / {totalCards}
        </strong>
      </div>

      <div
        className="progress"
        style={{
          height: "20px",
          width: "95%",
          margin: "0 auto", 
          maxWidth: "100%", 
        }}
      >
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

      {/* ✅ Responsive Adjustments */}
      <style>{`
        @media (max-width: 576px) {
          .progress-container {
            max-width: 389px !important; /* ✅ Reduce container width on mobile */
            width: 90% !important;       /* ✅ Ensure it shrinks properly */
          }
          .progress {
            height: 20px !important;     /* ✅ Smaller height for mobile */
            width: 100% !important;      /* ✅ Full-width within container */
            margin: 0 auto !important;   /* ✅ Center align */
          }
          .progress-bar {
            font-size: 10px !important;  /* ✅ Smaller text */
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;
