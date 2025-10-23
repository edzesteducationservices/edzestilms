



// import { FaSyncAlt } from "react-icons/fa"; // Import refresh icon from react-icons
// // import InstructionPage from "../Components/InstructionPage"; // Import the InstructionPage component
// import DragItem from "../Components/DragItem"; // Import the DragItem component, which represents draggable items
// import DropZone from "../Components/DropZone"; // Import the DropZone component, which represents areas where items can be dropped
// import Score from "../Components/Score"; // Import the Score component to display the user's score
// import Solution from "../Components/Solution"; // Import the Solution component to show correct answers
// import quizData from "./quizData"; // Import quiz data (questions, terms, and definitions)
// import { useState, useEffect } from "react"; // Import React hooks for managing state and side effects
// import "../../Styles/DragAndDropQuiz.css"; // Import the CSS file for styling

// // Function to shuffle an array using the Fisher-Yates algorithm
// const shuffleArray = (array) => {
//   let shuffled = [...array]; // Create a copy of the original array
//   for (let i = shuffled.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
//     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
//   }
//   return shuffled; // Return the shuffled array
// };

// // Main component for the drag-and-drop quiz
// const DragAndDropQuiz1 = () => {
//   // State variables to manage quiz behavior
//   // const [showInstructions, setShowInstructions] = useState(true); // Show/hide instructions
//   const [currentQuestion, setCurrentQuestion] = useState(0); // Track the current question index
//   const [score, setScore] = useState(0); // Track the user's score
//   const [userMatches, setUserMatches] = useState({}); // Store user's matched answers
//   const [solutions, setSolutions] = useState(Array(quizData.length).fill([])); // Store solutions for each question
//   const [showSolution, setShowSolution] = useState(false); // Show/hide the solution modal
//   const [quizCompleted, setQuizCompleted] = useState(false); // Track if the quiz is completed
//   const [placedItems, setPlacedItems] = useState({}); // Track placed draggable items
//   const [shuffledDefinitions, setShuffledDefinitions] = useState([]); // Store shuffled definitions for the current question

//   // Effect to shuffle definitions whenever the question changes
//   useEffect(() => {
//     if (quizData[currentQuestion]) {
//       setShuffledDefinitions(shuffleArray(quizData[currentQuestion].definitions));
//     }
//   }, [currentQuestion]); // Runs whenever `currentQuestion` changes

//   // Function to handle the start of a drag event
//   const handleDragStart = (e, term) => {
//     // e.dataTransfer.setData("term", term); // Store the dragged term in the event data
//     e.dataTransfer.setData("text/plain", term);
//   };

//   // Function to handle when an item is dropped into a drop zone
//   const handleDrop = (e, definition) => {
//     const draggedTerm = e.dataTransfer.getData("term"); // Retrieve the dragged term
//     const isCorrect = draggedTerm === definition.match; // Check if the match is correct

//     // Prevent overriding an already placed item
//     if (!placedItems[currentQuestion]?.[definition.text]) {
//       // Update user matches
//       setUserMatches((prev) => ({
//         ...prev,
//         [currentQuestion]: [
//           ...(prev[currentQuestion] || []),
//           {
//             term: draggedTerm,
//             correct: isCorrect,
//             correctMatch: definition.match,
//           },
//         ],
//       }));

//       // Store placed items to prevent reusing them
//       setPlacedItems((prev) => ({
//         ...prev,
//         [currentQuestion]: {
//           ...prev[currentQuestion],
//           [definition.text]: draggedTerm,
//         },
//       }));
//     }
//   };

//   // Function to check and increase the score if all answers are correct
//   const checkAndIncreaseScore = (questionIndex) => {
//     const matches = userMatches[questionIndex] || [];
//     if (
//       matches.length === quizData[questionIndex].terms.length && // Check if all terms are matched
//       matches.every((match) => match.correct) // Ensure all matches are correct
//     ) {
//       setScore((prev) => prev + 1); // Increment score
//     }
//   };

//   // Function to proceed to the next question
//   const nextQuestion = () => {
//     // Save the user's answers before moving to the next question
//     setSolutions((prevSolutions) => {
//       const updatedSolutions = [...prevSolutions];
//       updatedSolutions[currentQuestion] = [...(userMatches[currentQuestion] || [])];
//       return updatedSolutions;
//     });

//     checkAndIncreaseScore(currentQuestion); // Check if the answer is correct and update the score

//     if (currentQuestion < quizData.length - 1) {
//       setCurrentQuestion((prev) => prev + 1); // Move to the next question
//     }
//   };

//   // Function to submit the quiz
//   const handleSubmit = () => {
//     setSolutions((prevSolutions) => {
//       const updatedSolutions = [...prevSolutions];
//       updatedSolutions[currentQuestion] = [...(userMatches[currentQuestion] || [])];
//       return updatedSolutions;
//     });

//     checkAndIncreaseScore(currentQuestion); // Update score
//     setQuizCompleted(true); // Mark quiz as completed
//   };

//   // Function to refresh the current question
//   const handleRefresh = () => {
//     // Prevent refresh if no attempt was made
//     if (!userMatches[currentQuestion] || userMatches[currentQuestion].length === 0) {
//       return;
//     }

//     // Reset matches and placed items for the current question
//     setUserMatches((prev) => ({
//       ...prev,
//       [currentQuestion]: [],
//     }));
//     setPlacedItems((prev) => ({
//       ...prev,
//       [currentQuestion]: {},
//     }));

//     // Reshuffle definitions
//     setShuffledDefinitions(shuffleArray(quizData[currentQuestion].definitions));
//   };

//   return (
//     <div className="quiz-container">
//       {showSolution ? ( // If the solution is being viewed
//         <Solution
//           solutions={solutions}
//           totalQuestions={quizData.length}
//           closeSolution={() => setShowSolution(false)}
//           quizData={quizData}
//           quizCompleted={quizCompleted}
//         />
//       ) : (
//         <>
//           {/* Display the current question */}
//           <div className="question-header">
//             <h2>
//               Q{currentQuestion + 1}. {quizData[currentQuestion]?.question}
//             </h2>
//           </div>

//           <div className="quiz-content">
//             {/* Container for draggable terms */}
//             <div className="drag-container">
//               {quizData[currentQuestion].terms.map(
//                 (term, index) =>
//                   !(
//                     placedItems[currentQuestion] &&
//                     Object.values(placedItems[currentQuestion]).includes(term)
//                   ) && (
//                     <DragItem
//                       key={index}
//                       term={term}
//                       handleDragStart={handleDragStart}
//                     />
//                   )
//               )}
//             </div>

//             {/* Container for drop zones */}
//             <div className="drop-container">
//               {shuffledDefinitions.map((definition, index) => (
//                 <DropZone
//                   key={index}
//                   definition={definition}
//                   handleDrop={handleDrop}
//                   placedItem={placedItems[currentQuestion]?.[definition.text]}
//                 />
//               ))}
//             </div>
//           </div>

//           {!quizCompleted && (
//             <>
//               {/* Show "Next" button if there are more questions, otherwise show "Submit" */}
//               {currentQuestion < quizData.length - 1 ? (
//                 <button onClick={nextQuestion} className="next-btn">
//                   Next
//                 </button>
//               ) : (
//                 <button onClick={handleSubmit} className="btn btn-primary">
//                   Submit
//                 </button>
//               )}
//             </>
//           )}

//           {/* Display score after completing the quiz */}
//           {quizCompleted && (
//             <div className="score-container">
//               <Score
//                 score={score}
//                 totalQuestions={quizData.length}
//                 viewSolution={() => setShowSolution(true)}
//               />
//             </div>
//           )}
          
//           {/* Refresh button */}
//           <div className="refresh-container">
//             <FaSyncAlt className="refresh-icon" onClick={handleRefresh} />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default DragAndDropQuiz1;


import React, { useState, useEffect } from "react";
import quizData from "./quizData";
import "bootstrap/dist/css/bootstrap.min.css";
import InstructionPage from "../Components/InstructionPage";
import DragItem from "../Components/DragItem";
import DropZone from "../Components/DropZone";
import Score from "../Components/Score";
import Solution from "../Components/Solution";
import { FaSyncAlt } from "react-icons/fa"; // Import the refresh icon
import "../DragAndDropQuiz.css"; // Import the CSS file for styling

// Function to shuffle an array randomly (Fisher-Yates Algorithm)
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const DragAndDropQuiz1 = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userMatches, setUserMatches] = useState([]);
  const [solutions, setSolutions] = useState(Array(quizData.length).fill([]));
  const [showSolution, setShowSolution] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [placedItems, setPlacedItems] = useState({});
  const [shuffledDefinitions, setShuffledDefinitions] = useState([]);

  // Shuffle drop zones (definitions) when question changes
  useEffect(() => {
    if (quizData[currentQuestion]) {
      setShuffledDefinitions(shuffleArray(quizData[currentQuestion].definitions));
    }
  }, [currentQuestion]);

  const handleDragStart = (e, term) => {
    e.dataTransfer.setData("term", term);
  };

  const handleDrop = (e, definition) => {
    const draggedTerm = e.dataTransfer.getData("term");
    const isCorrect = draggedTerm === definition.match;

    if (!placedItems[definition.text]) {
      setUserMatches((prev) => [...prev, { term: draggedTerm, correct: isCorrect, correctMatch: definition.match }]);
      setPlacedItems((prev) => ({ ...prev, [definition.text]: draggedTerm }));
    }
  };

  const nextQuestion = () => {
    setSolutions((prevSolutions) => {
      const updatedSolutions = [...prevSolutions];
      updatedSolutions[currentQuestion] = [...userMatches];
      return updatedSolutions;
    });

    const allCorrect =
      userMatches.length === quizData[currentQuestion].terms.length &&
      userMatches.every((match) => match.correct);

    if (allCorrect) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setUserMatches([]);
      setPlacedItems({});
    }
  };

  const handleSubmit = () => {
    setSolutions((prevSolutions) => {
      const updatedSolutions = [...prevSolutions];
      updatedSolutions[currentQuestion] = [...userMatches];
      return updatedSolutions;
    });

    const allCorrect =
      userMatches.length === quizData[currentQuestion].terms.length &&
      userMatches.every((match) => match.correct);

    if (allCorrect) {
      setScore((prev) => prev + 1);
    }

    setQuizCompleted(true);
  };

  const handleRefresh = () => {
    // Reset only the states for the current question, keeping the current question index intact
    setUserMatches([]);  // Reset user matches for the current question
    setPlacedItems({});   // Reset placed items for the current question
    setShuffledDefinitions(shuffleArray(quizData[currentQuestion]?.definitions));  // Re-shuffle definitions for the current question
    setShowSolution(false);  // Hide solution if it's visible
  };
  return (
    <div className="quiz-container">
      {showSolution ? (
        <Solution
          solutions={solutions}
          totalQuestions={quizData.length}
          closeSolution={() => setShowSolution(false)}
          quizData={quizData}
          quizCompleted={quizCompleted}
        />
      ) : (
        <>
          <h2 className="question-header">
            Q{currentQuestion + 1}. {quizData[currentQuestion]?.question}
          </h2>

          <div className="quiz-content">
            <div className="drag-container">
              {quizData[currentQuestion].terms.map((term, index) => (
                !Object.values(placedItems).includes(term) && (
                  <DragItem key={index} term={term} handleDragStart={handleDragStart} />
                )
              ))}
            </div>

            <div className="drop-container">
              {shuffledDefinitions.map((definition, index) => (
                <DropZone
                  key={index}
                  definition={definition}
                  handleDrop={handleDrop}
                  placedItem={placedItems[definition.text]}
                />
              ))}
            </div>
          </div>

          {!quizCompleted && (
            <>
              

              {currentQuestion < quizData.length - 1 ? (
                <button onClick={nextQuestion} className="next-btn">
                  Next Question
                </button>
              ) : (
                <button onClick={handleSubmit} className="btn btn-primary">
                  Submit
                </button>
              )}
            </>
          )}

          {quizCompleted && (
            <div className="score-container">
              <Score score={score} totalQuestions={quizData.length} viewSolution={() => setShowSolution(true)} />
            </div>
          )}
          
          <div className="refresh-container">
            <FaSyncAlt className="refresh-icon" onClick={handleRefresh} />
          </div>
        </>
      )}
    </div>
  );
};

export default DragAndDropQuiz1;
