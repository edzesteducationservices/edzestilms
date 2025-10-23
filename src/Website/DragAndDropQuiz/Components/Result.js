// import React from "react";
// import { Button } from "react-bootstrap";

// const Result = ({ score, total, allMatches, showSolution, setShowSolution }) => {
//   return (
//     <div className="text-center">
//       <h2 className="text-success">Quiz Completed!</h2>
//       <h4 className="text-primary">Your Score: {score} / {total}</h4>

//       <Button
//         variant="info"
//         className="mt-3"
//         onClick={() => setShowSolution(!showSolution)}
//       >
//         {showSolution ? "Hide Solution" : "View Solution"}
//       </Button>

//       <div className="mt-4">
//         {allMatches.map((question, index) => (
//           <div key={index} className="card p-3 mt-3 shadow">
//             <h5 className="text-dark">{question.question}</h5>
//             {Object.keys(question.answers).map((definition) => {
//               const userAnswer = question.userMatches?.[definition] || ""; 
//               const correctAnswer = question.answers[definition];
//               const isCorrect = userAnswer === correctAnswer;
//               const isAttempted = userAnswer !== "";

//               return (
//                <p
//   key={definition}
//   className={`p-2 rounded ${
//     showSolution
//       ? isCorrect
//         ? "bg-success text-white"  // ✅ Green if correct
//         : "bg-danger text-white"  // ❌ Red if incorrect
//       : "bg-light text-dark" // Normal before View Solution
//   }`}
// >
//   <strong>{definition}:</strong> {userAnswer || "Not Attempted"}  
//   {showSolution && !isCorrect && isAttempted && (
//     <>
//       <br />
//       <span className="text-warning">
//         ✅ Correct Answer: {correctAnswer}
//       </span>
//     </>
//   )}
// </p>
//               );
//             })}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Result;

import React from "react"; // Importing React library
import { Button } from "react-bootstrap"; // Importing Button component from React Bootstrap

// Result component displays the quiz result and allows the user to view the correct solutions
const Result = ({ score, total, allMatches, showSolution, setShowSolution }) => {
  return (
    <div className="text-center">
      {/* Heading indicating quiz completion */}
      <h2 className="text-success">Quiz Completed!</h2>
      
      {/* Displaying the user's score */}
      <h4 className="text-primary">Your Score: {score} / {total}</h4>

      {/* Button to toggle the visibility of solutions */}
      <Button
        variant="info"
        className="mt-3"
        onClick={() => setShowSolution(!showSolution)}
      >
        {showSolution ? "Hide Solution" : "View Solution"}
      </Button>

      {/* Section to display questions and user responses */}
      <div className="mt-4">
        {allMatches.map((question, index) => (
          <div key={index} className="card p-3 mt-3 shadow">
            {/* Displaying the question */}
            <h5 className="text-dark">{question.question}</h5>

            {/* Iterating over all answer choices */}
            {Object.keys(question.answers).map((definition) => {
              const userAnswer = question.userMatches?.[definition] || ""; // User's selected answer (if any)
              const correctAnswer = question.answers[definition]; // Correct answer for this definition
              const isCorrect = userAnswer === correctAnswer; // Checking if the user's answer is correct
              const isAttempted = userAnswer !== ""; // Checking if the user attempted this question

              return (
                <p
                  key={definition}
                  className={`p-2 rounded ${
                    showSolution
                      ? isCorrect
                        ? "bg-success text-white"  // ✅ Green if correct
                        : "bg-danger text-white"  // ❌ Red if incorrect
                      : "bg-light text-dark" // Default state before viewing the solution
                  }`}
                >
                  {/* Displaying the definition and user’s answer */}
                  <strong>{definition}:</strong> {userAnswer || "Not Attempted"}  
                  
                  {/* Showing the correct answer if the solution is visible and the user's answer is incorrect */}
                  {showSolution && !isCorrect && isAttempted && (
                    <>
                      <br />
                      <span className="text-warning">
                        ✅ Correct Answer: {correctAnswer}
                      </span>
                    </>
                  )}
                </p>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Result; // Exporting the Result component for use in other parts of the application
