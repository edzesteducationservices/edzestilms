// import React, { useState, useEffect } from "react";
// import { FaCog, FaTimes, FaMoon, FaSun } from "react-icons/fa";

// const FlashNavbar = ({ setScore, setProgress, setCurrentCardIndex, setAnsweredCards }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(
//     JSON.parse(localStorage.getItem("darkMode")) || false
//   );

//   // Handle Dark Mode
//   useEffect(() => {
//     if (isDarkMode) {
//       document.body.classList.add("dark-mode");
//     } else {
//       document.body.classList.remove("dark-mode");
//     }
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);

//   return (
//     <>
//       {/* Navbar */}
//       <nav className="navbar navbar-dark bg-white px-3 d-flex justify-content-between" style={{ marginTop: "-21px", marginBottom: "-27px" }}>
//         <h4 className="m-0" style={{ color: "#4748ac" }}>Flashcard</h4>
//         <FaCog
//           size={24}
//           className="cursor-pointer"
//           onClick={() => setIsSidebarOpen(true)}
//           style={{ cursor: "pointer", color: "#4748ac" }}
//         />
//       </nav>

//       {/* ✅ Overlay to close sidebar when clicking outside */}
//       {isSidebarOpen && (
//         <div
//           className="overlay"
//           onClick={() => setIsSidebarOpen(false)}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100vh",
//             backgroundColor: "rgba(0, 0, 0, 0.4)",
//             zIndex: 999, // Behind the sidebar
//           }}
//         ></div>
//       )}

//       {/* Sidebar */}
//       <div
//         className={`sidebar ${isSidebarOpen ? "open" : ""}`}
//         style={{
//           position: "fixed",
//           top: 0,
//           right: isSidebarOpen ? "0" : "-250px",
//           width: "250px",
//           height: "100vh",
//           backgroundColor: "#f8f9fa",
//           boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.2)",
//           transition: "right 0.3s ease-in-out",
//           padding: "20px",
//           display: "flex",
//           flexDirection: "column",
//           zIndex: 1000,
//         }}
//         onClick={(e) => e.stopPropagation()} // ✅ Prevent closing when clicking inside the sidebar
//       >
//         {/* Close Button */}
//         <FaTimes
//           size={24}
//           style={{ cursor: "pointer", color: "black" }}
//           onClick={() => setIsSidebarOpen(false)}
//         />

//         {/* Clear Score Button */}
//         <button
//   className="btn btn-danger mt-4"
//   onClick={() => {
//     setScore(0);
//     setProgress(0);
//     setCurrentCardIndex(0);
//     setAnsweredCards({});

//     localStorage.setItem("score", 0);
//     localStorage.setItem("progress", 0);
//     localStorage.setItem("currentCardIndex", 0);
//     localStorage.setItem("answeredCards", JSON.stringify({}));

//     // ✅ Remove disabledIKnowCards from localStorage
//     localStorage.removeItem("disabledIKnowCards");

//     // ✅ Dispatch clearScore event after clearing localStorage
//     window.dispatchEvent(new Event("clearScore"));
//   }}
// >
//   Clear Score
// </button>


//         {/* Dark Mode Toggle */}
//         <button
//           className="btn btn-dark mt-3 d-flex align-items-center justify-content-center"
//           onClick={() => setIsDarkMode(!isDarkMode)}
//         >
//           {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
//           <span className="ms-2">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
//         </button>
//       </div>

//       {/* Dark Mode Styles */}
//       <style>
//         {`
//           .dark-mode {
//             background-color: #121212;
//             color: white;
//           }
//           .dark-mode .card {
//             background-color: #1e1e1e;
//             color: white;
//           }
//           .dark-mode .navbar {
//             background-color: #333;
//           }
//         `}
//       </style>
//     </>
//   );
// };

// export default FlashNavbar;



import React, { useState, useEffect } from "react";
import { FaCog, FaTimes, FaMoon, FaSun } from "react-icons/fa";

const FlashNavbar = ({ setScore, setProgress, setCurrentCardIndex, setAnsweredCards }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <>
      <div className="refresh-btn d-flex justify-content-end"style={{marginTop:"-12px"}}>
      <button
          className="btn btn-danger"
          onClick={() => {
            setScore(0);
            setProgress(0);
            setCurrentCardIndex(0);
            setAnsweredCards({});
            localStorage.setItem("score", 0);
            localStorage.setItem("progress", 0);
            localStorage.setItem("currentCardIndex", 0);
            localStorage.setItem("answeredCards", JSON.stringify({}));
            localStorage.removeItem("disabledIKnowCards");
            window.dispatchEvent(new Event("clearScore"));
          }}
        >
          <i class="fa-solid fa-arrows-rotate"></i>
        
        </button>
        </div>

      {/* {isSidebarOpen && (
        <div
          className="overlay"
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 999,
          }}
        />
      )}

      <div
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          right: isSidebarOpen ? "0" : "-250px",
          width: "250px",
          height: "100vh",
          backgroundColor: "#f8f9fa",
          boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.2)",
          transition: "right 0.3s ease-in-out",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          zIndex: 1000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <FaTimes
          size={24}
          style={{ cursor: "pointer", color: "black" }}
          onClick={() => setIsSidebarOpen(false)}
        />

        

        <button
          className="btn btn-dark mt-3 d-flex align-items-center justify-content-center"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          <span className="ms-2">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      <style>
        {`
          .dark-mode {
            background-color: #121212;
            color: white;
          }
          .dark-mode .card {
            background-color: #1e1e1e;
            color: white;
          }
          .dark-mode .navbar {
            background-color: #333;
          }
        `}
      </style> */}
    </>
  );
};

export default FlashNavbar;

