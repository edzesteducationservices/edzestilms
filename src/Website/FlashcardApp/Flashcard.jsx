// import React, { useState, useEffect } from "react";

// const Flashcard = ({
//   currentCard,
//   currentCardIndex,
//   setCurrentCardIndex,
//   totalCards,
//   isFlipped,          // ✅ Controlled flip state from parent
//   setIsFlipped,        // ✅ Flip handler from parent
// }) => {
//   const [flipped, setFlipped] = useState(false); // ✅ Local flip state for manual flipping

//   // ✅ Sync local flipped state with the parent flip state
//   useEffect(() => {
//     setFlipped(isFlipped); // When isFlipped changes, update flipped state
//   }, [isFlipped]);

//   // ✅ Handle card flip when clicked
//   const handleFlip = () => {
//     setFlipped((prev) => !prev);      // Toggle local flip
//     setIsFlipped((prev) => !prev);    // Sync with parent
//   };

//   // ✅ Load saved index & flip state from localStorage on initial render
//   useEffect(() => {
//     const savedIndex = localStorage.getItem("currentCardIndex");
//     const savedFlipped = localStorage.getItem("flipped");

//     const index = Number(savedIndex);
//     if (!isNaN(index) && index >= 0 && index < totalCards) {
//       setCurrentCardIndex(index);
//     } else {
//       setCurrentCardIndex(0);
//     }

//     if (savedFlipped !== null) {
//       setFlipped(savedFlipped === "true");
//       setIsFlipped(savedFlipped === "true"); // ✅ Sync with parent state
//     }
//   }, [setCurrentCardIndex, setIsFlipped, totalCards]);

//   // ✅ Save the current index & flip state to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("currentCardIndex", currentCardIndex.toString());
//     localStorage.setItem("flipped", flipped.toString());
//   }, [currentCardIndex, flipped]);

//   if (!currentCard) {
//     return <div>No flashcards available. Please select a category.</div>;
//   }

//   return (
//     <div
//       className="flashcard-container d-flex justify-content-center align-items-center"
//       style={{
//         width: "100%",
//         padding: "20px",
//       }}
//     >
//       <div
//         className="card text-center shadow-lg rounded-4 p-3 bg-grey-500"
//         style={{
//           width: "100%",
//           maxWidth: "30rem",
//           height: "12rem",
//           cursor: "pointer",
//           transition: "transform 0.6s",
//           transformStyle: "preserve-3d",
//           position: "relative",
//           transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", // ✅ Flip effect
//         }}
//         onClick={handleFlip} // ✅ Trigger flip on click
//       >
//         {/* ✅ Front Side (Question) */}
//         <div
//           className="card-body d-flex flex-column justify-content-center align-items-center"
//           style={{
//             position: "absolute",
//             width: "100%",
//             height: "100%",
//             backfaceVisibility: "hidden",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//           }}
//         >

//           <h3 className="card-text text-dark">
//             {currentCard.question || "No Question Available"}
//           </h3>
//         </div>

//         {/* ✅ Back Side (Answer) */}
//         <div
//           className="card-body d-flex flex-column justify-content-center align-items-center rounded-4"
//           style={{
//             position: "absolute",
//             width: "100%",
//             height: "100%",
//             backfaceVisibility: "hidden",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%) rotateY(180deg)",
//           }}
//         >

//           <p className="card-text text-dark">
//             {currentCard.answer || "No Answer Available"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Flashcard;

// import React, { useState, useEffect } from "react";

// const Flashcard = ({
//   currentCard,
//   currentCardIndex,
//   setCurrentCardIndex,
//   totalCards,
//   isFlipped,
//   setIsFlipped,
// }) => {
//   const [flipped, setFlipped] = useState(false);

//   useEffect(() => {
//     setFlipped(isFlipped);
//   }, [isFlipped]);

//   const handleFlip = () => {
//     setFlipped((prev) => !prev);
//     setIsFlipped((prev) => !prev);
//   };

//   useEffect(() => {
//     const savedIndex = localStorage.getItem("currentCardIndex");
//     const savedFlipped = localStorage.getItem("flipped");
//     const index = Number(savedIndex);
//     if (!isNaN(index) && index >= 0 && index < totalCards) {
//       setCurrentCardIndex(index);
//     } else {
//       setCurrentCardIndex(0);
//     }
//     if (savedFlipped !== null) {
//       setFlipped(savedFlipped === "true");
//       setIsFlipped(savedFlipped === "true");
//     }
//   }, [setCurrentCardIndex, setIsFlipped, totalCards]);

//   useEffect(() => {
//     localStorage.setItem("currentCardIndex", currentCardIndex.toString());
//     localStorage.setItem("flipped", flipped.toString());
//   }, [currentCardIndex, flipped]);

//   if (!currentCard) {
//     return <div>No flashcards available. Please select a category.</div>;
//   }

//   return (
//     <div className="flashcard-container d-flex justify-content-center align-items-center" style={{ width: "100%", padding: "20px" }}>
//       <div
//         className="card text-center shadow-lg rounded-4 p-3 bg-grey-500"
//         style={{
//           width: "100%",
//           maxWidth: "30rem",
//           height: "12rem",
//           cursor: "pointer",
//           transition: "transform 0.6s",
//           transformStyle: "preserve-3d",
//           position: "relative",
//           transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
//         }}
//         onClick={handleFlip}
//       >
//         <div
//           className="card-body d-flex flex-column justify-content-center align-items-center"
//           style={{
//             position: "absolute",
//             width: "100%",
//             height: "100%",
//             backfaceVisibility: "hidden",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             overflow: "hidden",
//             wordWrap: "break-word",
//             padding: "10px",
//           }}
//         >
//           <h3 className="card-text text-dark" style={{ fontSize: "1.2rem", textAlign: "center" }}>
//             {currentCard.question || "No Question Available"}
//           </h3>
//         </div>

//         <div
//           className="card-body d-flex flex-column justify-content-center align-items-center rounded-4"
//           style={{
//             position: "absolute",
//             width: "100%",
//             height: "100%",
//             backfaceVisibility: "hidden",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%) rotateY(180deg)",
//             overflowY: "auto",
//             wordWrap: "break-word",
//             padding: "10px",
//             textAlign: "center",
//           }}
//         >
//           <p className="card-text text-dark" style={{ fontSize: "1rem" }}>
//             {currentCard.answer || "No Answer Available"}
//           </p>
//           {currentCard.example && (
//             <p className="card-text text-muted" style={{ fontSize: "0.9rem" }}>
//               <strong>Example:</strong> {currentCard.example}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Flashcard;



import React, { useState, useEffect } from "react";

const Flashcard = ({
  currentCard,
  currentCardIndex,
  setCurrentCardIndex,
  totalCards,
  isFlipped,
  setIsFlipped,
}) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(isFlipped);
  }, [isFlipped]);

  const handleFlip = () => {
    setFlipped((prev) => !prev);
    setIsFlipped((prev) => !prev);
  };

  useEffect(() => {
    const savedIndex = localStorage.getItem("currentCardIndex");
    const savedFlipped = localStorage.getItem("flipped");
    const index = Number(savedIndex);
    if (!isNaN(index) && index >= 0 && index < totalCards) {
      setCurrentCardIndex(index);
    } else {
      setCurrentCardIndex(0);
    }
    if (savedFlipped !== null) {
      setFlipped(savedFlipped === "true");
      setIsFlipped(savedFlipped === "true");
    }
  }, [setCurrentCardIndex, setIsFlipped, totalCards]);

  useEffect(() => {
    localStorage.setItem("currentCardIndex", currentCardIndex.toString());
    localStorage.setItem("flipped", flipped.toString());
  }, [currentCardIndex, flipped]);

  if (!currentCard) {
    return <div>No flashcards available. Please select a category.</div>;
  }

  return (
    <div
  className="flashcard-container d-flex justify-content-center align-items-center"
  style={{
    width: "100%",
    padding: "20px",
  }}
>
  <div
    className="card text-center shadow-lg rounded-4 p-3 bg-grey-500"
    style={{
      width: "95%", // ✅ Slightly wider in mobile
      maxWidth: "32rem", // ✅ Slightly increased max width
      height: "auto",
      minHeight: "12rem",
      cursor: "pointer",
      transition: "transform 0.6s",
      transformStyle: "preserve-3d",
      position: "relative",
      transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
    }}
    onClick={handleFlip}
  >
    {/* Front Side */}
    <div
      className="card-body d-flex flex-column justify-content-center align-items-center"
      style={{
        position: "absolute",
        width: "100%",
        minHeight: "12rem",
        height: "100%",
        backfaceVisibility: "hidden",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        overflow: "hidden",
        wordWrap: "break-word",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h3
        className="card-text text-dark"
        style={{
          fontSize: "1.1rem",
          textAlign: "center",
          wordBreak: "break-word",
          padding: "5px",
        }}
      >
        {currentCard.question || "No Question Available"}
      </h3>
    </div>

    {/* Back Side */}
    <div
      className="card-body d-flex flex-column align-items-center rounded-4"
      style={{
        position: "absolute",
        width: "100%",
        minHeight: "12rem",
        height: "100%",
        backfaceVisibility: "hidden",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) rotateY(180deg)",
        overflowY: "auto",
        wordWrap: "break-word",
        padding: "10px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <p
        className="card-text text-dark"
        style={{
          fontSize: "0.95rem",
          padding: "5px",
          marginTop: "5px",
        }}
      >
        {currentCard.answer || "No Answer Available"}
      </p>
      {currentCard.example && (
        <p className="card-text text-muted" style={{ fontSize: "0.85rem" }}>
          <strong>Example:</strong> {currentCard.example}
        </p>
      )}
    </div>
  </div>
</div>



  );
};

export default Flashcard;
