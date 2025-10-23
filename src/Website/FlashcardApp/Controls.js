



import React, { useState, useEffect } from "react";
import { Toast, ToastContainer, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Controls = ({
  currentCardIndex,
  totalCards,
  answeredCards,
  setAnsweredCards,
  setCurrentCardIndex,
  setScore,
  setSelectedCategory,
  setIsFlipped,
  score,
}) => {
  const [forceNextEnabled, setForceNextEnabled] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [disableIKnowButton, setDisableIKnowButton] = useState(false);
  const [disabledIKnowCards, setDisabledIKnowCards] = useState(
    JSON.parse(localStorage.getItem("disabledIKnowCards")) || {}
  );

  const navigate = useNavigate();

  const handlePrev = () => {
    setCurrentCardIndex((prev) => Math.max(prev - 1, 0));
    setIsFlipped(false);
    setForceNextEnabled(false);
    setDisableIKnowButton(disabledIKnowCards[currentCardIndex - 1] || true);
  };

  const handleNext = () => {
    setCurrentCardIndex((prev) => Math.min(prev + 1, totalCards - 1));
    setIsFlipped(false);
    setForceNextEnabled(false);
    setDisableIKnowButton(disabledIKnowCards[currentCardIndex + 1] || false);
  };

  const handleAnswer = (isCorrect) => {
    if (!answeredCards[currentCardIndex]) {
      setAnsweredCards((prev) => ({
        ...prev,
        [currentCardIndex]: isCorrect,
      }));

      localStorage.setItem(
        "answeredCards",
        JSON.stringify({
          ...answeredCards,
          [currentCardIndex]: isCorrect,
        })
      );

      if (isCorrect) {
        if (!disableIKnowButton) {
          setScore((prev) => prev + 1);
        }
        setIsFlipped(false);
        handleNext();
      } else {
        setIsFlipped(true);
        setForceNextEnabled(true);
        setDisableIKnowButton(true);

        const updatedDisabledCards = {
          ...disabledIKnowCards,
          [currentCardIndex]: true,
        };
        setDisabledIKnowCards(updatedDisabledCards);
        localStorage.setItem(
          "disabledIKnowCards",
          JSON.stringify(updatedDisabledCards)
        );
      }
    }
  };

  useEffect(() => {
    setDisableIKnowButton(disabledIKnowCards[currentCardIndex] || false);
  }, [currentCardIndex, disabledIKnowCards]);

  useEffect(() => {
    if (Object.keys(answeredCards).length === totalCards) {
      setShowToast(true);
    }
  }, [answeredCards, totalCards]);

  const handleTryAgain = () => {
    setCurrentCardIndex(0);
    setAnsweredCards({});
    setScore(0);
    setIsFlipped(false);
    setShowToast(false);
    setDisableIKnowButton(false);
    setDisabledIKnowCards({});
    localStorage.removeItem("answeredCards");
    localStorage.removeItem("disabledIKnowCards");
  };

  const handleClose = () => {
    navigate("/flashcards");
  };

  // ✅ Listen for the "clearScore" event from the sidebar
  const handleClearScore = () => {
    console.log("🧹 Clear Score Event Triggered");
  
    setCurrentCardIndex(0);
    setAnsweredCards({});
    setScore(0);
    setIsFlipped(false);
    setDisableIKnowButton(false);
  
    // ✅ Clear disabledIKnowCards from both state and localStorage
    setDisabledIKnowCards({});
    localStorage.removeItem("disabledIKnowCards");
  
    // ✅ Ensure the state is in sync with localStorage
    const clearedData = JSON.parse(localStorage.getItem("disabledIKnowCards")) || {};
    setDisabledIKnowCards(clearedData);
  
    console.log("After Clear:", localStorage.getItem("disabledIKnowCards"));
  };
  useEffect(() => {
    // ✅ Add event listener for "clearScore"
    window.addEventListener("clearScore", handleClearScore);
  
    // ✅ Cleanup on unmount
    return () => {
      window.removeEventListener("clearScore", handleClearScore);
    };
  }, []);
  
  
  
  

  return (
    <div className="text-center mt-3">
      <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
        {/* <button
          className="btn btn-success"
          onClick={handlePrev}
          disabled={currentCardIndex === 0}
        >
          <i class="fa-solid fa-arrow-left"></i>
        </button> */}

        <button
          className="btn"
          style={{backgroundColor : '#4748ac', color : "white"}}
          onClick={() => handleAnswer(true)}
          disabled={disableIKnowButton}
        >
          I Know this
        </button>

        <button
          className="btn btn-danger"
          onClick={() => handleAnswer(false)}
        >
         I don't know this
        </button>

        <button
          className="btn btn-success"
          onClick={handleNext}
          disabled={
            (!answeredCards[currentCardIndex] && !forceNextEnabled) ||
            currentCardIndex === totalCards - 1
          }
        >
          Next
        </button>
      </div>

      <ToastContainer
  className="p-3"
  style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1055,
  }}
>
  <Toast key={score} onClose={() => setShowToast(false)} show={showToast}>
    <Toast.Header closeButton={true}>
      <strong className="me-auto">Quiz Completed</strong>
    </Toast.Header>
    <Toast.Body className="text-center">
      You scored <strong>{score}</strong> out of <strong>{totalCards}</strong>!
      <div className="mt-3 d-flex justify-content-around">
        <Button variant="btn" style={{backgroundColor:"#4748ac", color:"white"}} onClick={handleTryAgain}>
          Try Again
        </Button>
        <Button variant="btn" style={{backgroundColor:"#4748ac", color:"white"}} onClick={handleClose}>
          Close
        </Button>
      </div>
    </Toast.Body>
  </Toast>
</ToastContainer>

    </div>
  );
};

export default Controls;


