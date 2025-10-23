

// // DropZone component that acts as a drop area for drag-and-drop functionality
// const DropZone = ({ definition, handleDrop, placedItem, isAllDropped }) => {
//   return (
//     <div
//       className={`drop-zone ${isAllDropped ? "center-drop" : ""}`} // Adds the 'center-drop' class if all items are dropped
//       onDragOver={(e) => e.preventDefault()} // Prevents the default behavior to allow dragging over this area
//       onDrop={(e) => handleDrop(e, definition)} // Calls handleDrop function when an item is dropped
//     >
//       {/* Displays the placed item if available; otherwise, shows the default definition text */}
//       <span className="drop-text">{placedItem || definition.text}</span>
//     </div>
//   );
// };

// export default DropZone; // Exporting the DropZone component for use in other parts of the app



// DropZone component that acts as a drop area for drag-and-drop functionality
const DropZone = ({ definition, handleDrop, placedItem, isAllDropped }) => {
  return (
    <div
      className={`drop-zone ${isAllDropped ? "center-drop" : ""}`} // Adds the 'center-drop' class if all items are dropped
      onDragOver={(e) => {
        e.preventDefault(); // Prevents default behavior to allow dragging over this area
        e.dataTransfer.dropEffect = "move"; // Ensures proper drop behavior
      }}
      onDrop={(e) => {
        const draggedTerm = e.dataTransfer.getData("text/plain"); // Retrieve data using "text/plain" MIME type
        handleDrop(e, definition, draggedTerm); // Calls handleDrop function when an item is dropped
      }}
    >
      {/* Displays the placed item if available; otherwise, shows the default definition text */}
      <span className="drop-text">{placedItem || definition.text}</span>
    </div>
  );
};

export default DropZone; // Exporting the DropZone component for use in other parts of the app
