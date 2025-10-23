// import { FaSyncAlt } from "react-icons/fa"; // Import refresh icon
// import InstructionPage from "../Components/InstructionPage";
// import DragItem from "../Components/DragItem";
// import DropZone from "../Components/DropZone";
// import Score from "../Components/Score";
// import Solution from "../Components/Solution";
// import quizData from "./quizData";
// import { useState, useEffect } from "react";
// import "../../Styles/DragAndDropQuiz.css"; // ✅ Ensure the correct path

// const shuffleArray = (array) => {
//   let shuffled = [...array];
//   for (let i = shuffled.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//   }
//   return shuffled;
// };

// const DragAndDropQuiz3 = () => {
//   const [showInstructions, setShowInstructions] = useState(true);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [score, setScore] = useState(0);
//   const [userMatches, setUserMatches] = useState({});
//   const [solutions, setSolutions] = useState(Array(quizData.length).fill([]));
//   const [showSolution, setShowSolution] = useState(false);
//   const [quizCompleted, setQuizCompleted] = useState(false);
//   const [placedItems, setPlacedItems] = useState({});
//   const [shuffledDefinitions, setShuffledDefinitions] = useState([]);

//   useEffect(() => {
//     if (quizData[currentQuestion]) {
//       setShuffledDefinitions(
//         shuffleArray(quizData[currentQuestion].definitions)
//       );
//     }
//   }, [currentQuestion]);

//   const handleDragStart = (e, term) => {
//     e.dataTransfer.setData("term", term);
//   };

//   const handleDrop = (e, definition) => {
//     const draggedTerm = e.dataTransfer.getData("term");
//     const isCorrect = draggedTerm === definition.match;

//     if (!placedItems[currentQuestion]?.[definition.text]) {
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

//       setPlacedItems((prev) => ({
//         ...prev,
//         [currentQuestion]: {
//           ...prev[currentQuestion],
//           [definition.text]: draggedTerm,
//         },
//       }));
//     }
//   };

//   const checkAndIncreaseScore = (questionIndex) => {
//     const matches = userMatches[questionIndex] || [];
//     if (
//       matches.length === quizData[questionIndex].terms.length &&
//       matches.every((match) => match.correct)
//     ) {
//       setScore((prev) => prev + 1);
//     }
//   };

//   const nextQuestion = () => {
//     setSolutions((prevSolutions) => {
//       const updatedSolutions = [...prevSolutions];
//       updatedSolutions[currentQuestion] = [
//         ...(userMatches[currentQuestion] || []),
//       ];
//       return updatedSolutions;
//     });

//     checkAndIncreaseScore(currentQuestion);

//     if (currentQuestion < quizData.length - 1) {
//       setCurrentQuestion((prev) => prev + 1);
//     }
//   };

//   const handleSubmit = () => {
//     setSolutions((prevSolutions) => {
//       const updatedSolutions = [...prevSolutions];
//       updatedSolutions[currentQuestion] = [
//         ...(userMatches[currentQuestion] || []),
//       ];
//       return updatedSolutions;
//     });

//     checkAndIncreaseScore(currentQuestion);
//     setQuizCompleted(true);
//   };

//   const handleRefresh = () => {
//     // Agar user ne koi attempt nahi kiya hai to refresh kaam nahi karega
//     if (
//       !userMatches[currentQuestion] ||
//       userMatches[currentQuestion].length === 0
//     ) {
//       return;
//     }

//     // Reset only the current question state
//     setUserMatches((prev) => ({
//       ...prev,
//       [currentQuestion]: [],
//     }));
//     setPlacedItems((prev) => ({
//       ...prev,
//       [currentQuestion]: {},
//     }));
//     setShuffledDefinitions(shuffleArray(quizData[currentQuestion].definitions));
//   };

//   return (
//     <div className="quiz-container">
//       {showSolution ? (
//         <Solution
//           solutions={solutions}
//           totalQuestions={quizData.length}
//           closeSolution={() => setShowSolution(false)}
//           quizData={quizData}
//           quizCompleted={quizCompleted}
//         />
//       ) : (
//         <>
//           <div className="question-header">
//             <h2>
//               Q{currentQuestion + 1}. {quizData[currentQuestion]?.question}
//             </h2>
//           </div>

//           <div className="quiz-content">
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

//           {quizCompleted && (
//             <div className="score-container">
//               <Score
//                 score={score}
//                 totalQuestions={quizData.length}
//                 viewSolution={() => setShowSolution(true)}
//               />
//             </div>
//           )}

//           {/* Refresh Icon inside the container */}
//           <div className="refresh-container">
//             <FaSyncAlt className="refresh-icon" onClick={handleRefresh} />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default DragAndDropQuiz3;


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

const DragAndDropQuiz3 = () => {
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

export default DragAndDropQuiz3;
