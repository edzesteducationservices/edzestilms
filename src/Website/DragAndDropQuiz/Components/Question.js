
// import React from "react";
// import DragItem from "./DragItem";
// import DropZone from "./DropZone";

// const Question = ({ questionData, handleDragStart, handleDrop }) => {
//   return (
//     <div className="question-container">
//       {/* ✅ Added Serial Number Before Each Question */}
//       <h3 className="question-text">Q{questionData.id}. {questionData.question}</h3>

//       <div className="drag-drop-area">
//         {questionData.terms.map((term, index) => (
//           <div className="drag-drop-row" key={index}>
//             {/* ✅ Added Serial Number to Drag and Drop Items */}
//             <span className="serial-number">{index + 1}.</span>
//             <DragItem term={term} handleDragStart={handleDragStart} />
//             <DropZone definition={questionData.definitions[index]} handleDrop={handleDrop} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Question;


import React from "react";
import DragItem from "./DragItem"; // ✅ Importing the DragItem component
import DropZone from "./DropZone"; // ✅ Importing the DropZone component

// Question component handles displaying the question, draggable terms, and drop zones
const Question = ({ questionData, handleDragStart, handleDrop }) => {
  return (
    <div className="question-container">
      {/* ✅ Display the question with its serial number */}
      <h3 className="question-text">
        Q{questionData.id}. {questionData.question}
      </h3>

      {/* ✅ Section for draggable items and their corresponding drop zones */}
      <div className="drag-drop-area">
        {questionData.terms.map((term, index) => (
          <div className="drag-drop-row" key={index}>
            {/* ✅ Display a serial number for each term-definition pair */}
            <span className="serial-number">{index + 1}.</span>

            {/* ✅ Draggable item */}
            <DragItem term={term} handleDragStart={handleDragStart} />

            {/* ✅ Drop zone for the corresponding definition */}
            <DropZone 
              definition={questionData.definitions[index]} 
              handleDrop={handleDrop} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question; // ✅ Exporting the Question component for use in other parts of the app
