// // LMS/LessonRenderer/types/QuizLesson.jsx
// import React, { useContext, createContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getLessonProgress, markLessonComplete } from "../../../../utils/ProgressApi";

// let RoleContextValue = null;
// try { const { AuthContext } = require("../../../context/AuthContext"); RoleContextValue = AuthContext; } catch {}
// const FallbackContext = createContext(null);

// export default function QuizLesson({ lesson }) {
//   const navigate = useNavigate();
//   const roleCtx = useContext(RoleContextValue || FallbackContext);
//   const role = String(roleCtx?.user?.role || "").toLowerCase();
//   const testId = lesson?.mockTestId || lesson?.meta?.testId;

//   const [completed, setCompleted] = useState(false);
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         if (!lesson?._id) return;
//         const saved = await getLessonProgress(lesson._id);
//         if (alive) setCompleted(Boolean(saved?.completed));
//       } catch {}
//     })();
//     return () => { alive = false; };
//   }, [lesson?._id]);

//   // When user returns from quiz, detect flag and mark complete
//   useEffect(() => {
//     const onFocus = async () => {
//       if (!testId || completed) return;
//       if (localStorage.getItem(`quiz-finished:${testId}`) === "1") {
//         try { await markLessonComplete(lesson._id, true); setCompleted(true); } catch {}
//       }
//     };
//     window.addEventListener("focus", onFocus);
//     return () => window.removeEventListener("focus", onFocus);
//   }, [testId, lesson?._id, completed]);

//   if (!testId) return <div className="alert alert-warning">Quiz is not configured yet.</div>;

//   const go = () => {
//     if (role === "admin" || role === "teacher") navigate(`/exam/${testId}`);
//     else navigate(`/test-overview/${testId}`);
//   };

//   return (
//     <div className="text-center">
//       <h5 className="mb-3">{lesson?.title || "Quiz"}</h5>
//       <button className="btn btn-success" onClick={go}>
//         Open Quiz
//       </button>
//       {completed && <div className="text-success mt-2 small">Completed</div>}
//     </div>
//   );
// }



// LMS/LessonRenderer/types/QuizLesson.jsx
// import React, { useContext, createContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getLessonProgress, markLessonComplete } from "../../../../utils/ProgressApi";

// let RoleContextValue = null;
// try {
//   const { AuthContext } = require("../../../context/AuthContext");
//   RoleContextValue = AuthContext;
//   // inside QuizLesson component, near top
// console.log("Quiz testId:", lesson?.mockTestId || lesson?.meta?.testId, "raw lesson:", lesson);

// } catch {}

// const FallbackContext = createContext(null);

// export default function QuizLesson({ lesson, onQuizComplete }) {
//   const navigate = useNavigate();
//   const roleCtx = useContext(RoleContextValue || FallbackContext);
//   const role = String(roleCtx?.user?.role || "").toLowerCase();
//   const testId = lesson?.mockTestId || lesson?.meta?.testId;

//   const [completed, setCompleted] = useState(false);

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         if (!lesson?._id) return;
//         const saved = await getLessonProgress(lesson._id);
//         if (alive) setCompleted(Boolean(saved?.completed));
//       } catch {}
//     })();
//     return () => { alive = false; };
//   }, [lesson?._id]);

//   // When user returns from quiz, detect flag and mark complete
//   useEffect(() => {
//     const onFocus = async () => {
//       if (!testId || completed) return;
//       if (localStorage.getItem(`quiz-finished:${testId}`) === "1") {
//         try {
//           await markLessonComplete(lesson._id, true);
//           setCompleted(true);
//           // 🔔 New: bubble completion upward without changing your logic
//           if (typeof onQuizComplete === "function") onQuizComplete();
//         } catch {}
//       }
//     };
//     window.addEventListener("focus", onFocus);
//     return () => window.removeEventListener("focus", onFocus);
//   }, [testId, lesson?._id, completed, onQuizComplete]);

//   if (!testId) return <div className="alert alert-warning">Quiz is not configured yet.</div>;

//   const go = () => {
//     if (role === "admin" || role === "teacher") navigate(`/exam/${testId}`);
//     else navigate(`/test-overview/${testId}`);
//   };

//   return (
//     <div className="text-center">
//       <h5 className="mb-3">{lesson?.title || "Quiz"}</h5>
//       <button className="btn btn-success" onClick={go}>
//         Open Quiz
//       </button>
//       {completed && <div className="text-success mt-2 small">Completed</div>}
//     </div>
//   );
// }





import React, { useContext, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLessonProgress, markLessonComplete }from '../../../../../utils/ProgressApi';

let RoleContextValue = null;
try {
  const { AuthContext } = require("../../../context/AuthContext");
  RoleContextValue = AuthContext;
} catch {}

const FallbackContext = createContext(null);

export default function QuizLesson({ lesson, onQuizComplete }) {
  const navigate = useNavigate();
  const roleCtx = useContext(RoleContextValue || FallbackContext);
  const role = String(roleCtx?.user?.role || "").toLowerCase();

  // be flexible: check multiple places for id
  const testId =
    lesson?.mockTestId ||
    lesson?.meta?.testId ||
    lesson?.testId ||
    (typeof lesson?.fileUrl === "string" ? lesson.fileUrl.split("/").pop() : "");

  // debug
  console.log("Quiz testId:", testId, "raw lesson:", lesson);

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!lesson?._id) return;
        const saved = await getLessonProgress(lesson._id);
        if (alive) setCompleted(Boolean(saved?.completed));
      } catch {}
    })();
    return () => { alive = false; };
  }, [lesson?._id]);

  // When user returns from quiz, detect flag and mark complete
  useEffect(() => {
    const onFocus = async () => {
      if (!testId || completed) return;
      if (localStorage.getItem(`quiz-finished:${testId}`) === "1") {
        try {
          await markLessonComplete(lesson._id, true);
          setCompleted(true);
          if (typeof onQuizComplete === "function") onQuizComplete();
        } catch {}
      }
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [testId, lesson?._id, completed, onQuizComplete]);

  if (!testId) return <div className="alert alert-warning">Quiz is not configured yet.</div>;

  const go = () => {
    if (role === "admin" || role === "teacher") navigate(`/exam/${testId}`);
    else navigate(`/test-overview/${testId}`);
  };

  return (
    <div className="text-center">
      <h5 className="mb-3">{lesson?.title || "Quiz"}</h5>
      <button className="btn btn-success" onClick={go}>
        Open Quiz
      </button>
      {completed && <div className="text-success mt-2 small">Completed</div>}
    </div>
  );


  
}
