// import React from "react";

// const Score = ({ score, totalQuestions, viewSolution }) => {
//   return (
//     <div className="score-container">
//       <h2>Score: {score} / {totalQuestions}</h2>
//       <button onClick={viewSolution}>View Solution</button>
//     </div>
//   );
// };

// export default Score;


// import React from "react";

// const Score = ({ score, totalQuestions, viewSolution }) => {
//   const handleViewSolution = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ Scroll to top
//     viewSolution(); // ✅ Call the original function
//   };

//   return (
//     <div className="score-container">
//       <h2>Score: {score} / {totalQuestions}</h2>
//       <button onClick={handleViewSolution}>View Solution</button>
//     </div>
//   );
// };

// export default Score;


import React from "react";

// Score component to display the user's score and provide an option to view solutions
const Score = ({ score, totalQuestions, viewSolution }) => {
  
  // Function to handle the "View Solution" button click
  const handleViewSolution = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ Scrolls to the top smoothly
    viewSolution(); // ✅ Calls the function passed as a prop to show solutions
  };

  return (
    <div className="score-container">
      {/* Displaying the user's score */}
      <h2>Score: {score} / {totalQuestions}</h2>

      {/* Button to view the solution */}
      <button onClick={handleViewSolution}>View Solution</button>
    </div>
  );
};

export default Score; // Exporting the Score component for use in
