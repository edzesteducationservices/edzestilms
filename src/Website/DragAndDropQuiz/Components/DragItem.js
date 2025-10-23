

// import React from "react"; // Importing the React library

// // DragItem component represents a draggable item
// const DragItem = ({ term, handleDragStart }) => {
//   return (
//     <div
//       className="drag-item" // Applying CSS class for styling
//       draggable // Makes the item draggable
//       onDragStart={(e) => handleDragStart(e, term)} // Calls handleDragStart function when dragging starts
//     >
//       {term} {/* Displays the term inside the draggable item */}
//     </div>
//   );
// };

// export default DragItem; // Exporting DragItem component for use in other parts of the app

import React from "react"; // Importing the React library

// DragItem component represents a draggable item
const DragItem = ({ term, handleDragStart }) => {
  return (
    <div
      className="drag-item" // Applying CSS class for styling
      draggable // Makes the item draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", term); // Explicit MIME type for Chrome
        e.dataTransfer.effectAllowed = "move"; // Ensures proper drag behavior
        handleDragStart(e, term); // Calls the existing function
      }}
    >
      {term} {/* Displays the term inside the draggable item */}
    </div>
  );
};

export default DragItem; // Exporting DragItem component for use in other parts of the app
