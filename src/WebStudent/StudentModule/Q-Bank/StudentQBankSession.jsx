import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import API from "../../../LoginSystem/axios";

// ✅ single MUI import (avoids duplicate bindings)
import {
  Box,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  FormGroup,
  Stack,
} from "@mui/material";

export default function StudentQBankSession() {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const bankId = location.state?.bankId || null;

  // ✅ Questions and duration from navigation state
  const [questions, setQuestions] = useState(location.state?.questions || []);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(
    location.state?.duration * 60 || 600
  );
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [session, setSession] = useState({
    sessionId: sessionId || location.state?.sessionId || null,
  });

  // ✅ Explanation toggle (same page)
  const [showExplain, setShowExplain] = useState(false);

  // ✅ TIMER: keep interval id + submission guard
  const timerRef = useRef(null);
  const submittedRef = useRef(false); // prevents double submit (manual/auto)

  // ✅ NEW: confirm modal state (does not change submit logic)
  const [confirmOpen, setConfirmOpen] = useState(false);

  /* ==========================================================
     ✅ Check for missing questions (for safety)
  ========================================================== */
  useEffect(() => {
    if (!questions.length) {
      console.warn(
        "⚠️ No questions found in state. If page was refreshed, implement GET /session/:id to reload."
      );
    } else {
      console.log("✅ Loaded questions from filter form.");
    }
  }, [questions]);

  /* ==========================================================
     ✅ Countdown Timer (STRICTMODE-SAFE)
  ========================================================== */
  useEffect(() => {
    if (result || submittedRef.current) return; // don't start if already submitted
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (!submittedRef.current) {
            submittedRef.current = true;
            handleSubmit(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [result]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  /* ==========================================================
     ✅ Handle answer change
  ========================================================== */
  const handleChange = (qid, val) => {
    if (result) return;
    setAnswers({ ...answers, [qid]: val });
  };

  /* ==========================================================
     ✅ Submit answers (final submission) — LOGIC UNCHANGED
  ========================================================== */
  const handleSubmit = async (auto = false) => {
    try {
      if (submittedRef.current) return;
      submittedRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);

      const sid =
        session?.sessionId || location.state?.sessionId || sessionId || null;

      if (!sid) {
        console.error("❌ Missing sessionId — cannot submit");
        return;
      }

      const res = await API.post(`/api/student/qbank/session/${sid}/submit`, {
        answers,
      });

      setResult(res.data);
      console.log("✅ Submit success:", res.data);
    } catch (err) {
      console.error("❌ Submit failed", err);
      if (!auto) submittedRef.current = false;
    }
  };

  // ✅ NEW: Open confirm instead of direct submit
  const requestSubmit = () => setConfirmOpen(true);

  const currentQuestion = questions[currentQIndex];

  /* ==========================================================
     ✅ UI Render
  ========================================================== */
  return (
    <Box sx={{ p: 3, display: "flex", gap: 4 }}>
      {/* Left Side */}
      <Box sx={{ flex: 3 }}>
        {/* Left Side */}

        {/* ← Back button goes here */}
        <Box sx={{ mb: 2 }}>
          <Button
            variant="text"
            startIcon={<ArrowBackIosNewIcon />}
            onClick={() => {
              if (bankId) {
                navigate(`/student/qbank/details/${bankId}`);
              } else {
                navigate("/student/qbank");
              }
            }}
            sx={{
              color: "#4748ac",
              textTransform: "none",
              fontWeight: 600,
              px: 0,
            }}
          >
            Back to Details
          </Button>
        </Box>

        {result && (
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{ color: "green", fontWeight: "bold" }}
            >
              ✅ Test Completed
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your Score: <b>{result.score}</b> / <b>{result.total}</b>
            </Typography>

            {/* Explanation toggle under score */}
            <Button
              variant="contained"
              onClick={() => setShowExplain((v) => !v)}
              sx={styles.explanationToggle}
            >
              {showExplain ? "Hide Explanation" : "Show Explanation"}
            </Button>

            {/* 🔄 One-by-one explanation (new) */}
            {showExplain && (
              <ExplanationPager results={result?.results || []} />
            )}
          </Box>
        )}

        {!result && currentQuestion && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }} style={{}}>
              {currentQIndex + 1}. {currentQuestion.questionText}
            </Typography>

            {/* Single Select */}
            {currentQuestion.questionType === "Single-Select" && (
              <RadioGroup
                value={answers[currentQuestion.questionId] || ""}
                onChange={(e) =>
                  handleChange(currentQuestion.questionId, [e.target.value])
                }
              >
                {currentQuestion.options.map((opt, i) => (
                  <FormControlLabel
                    key={i}
                    value={String.fromCharCode(65 + i)}
                    control={<Radio />}
                    label={`${String.fromCharCode(65 + i)}. ${opt}`}
                  />
                ))}
              </RadioGroup>
            )}

            {/* Multi Select */}
            {/* Multi Select — vertical list (UI-only change) */}
            {currentQuestion.questionType === "Multi-Select" && (
              <FormGroup
                sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}
              >
                {currentQuestion.options.map((opt, i) => {
                  const label = String.fromCharCode(65 + i);
                  const qid = currentQuestion.questionId;
                  const prev = answers[qid] || [];
                  const checked = prev.includes(label);

                  return (
                    <FormControlLabel
                      key={i}
                      sx={{ m: 0, alignItems: "flex-start", width: "100%" }}
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...prev, label]
                              : prev.filter((x) => x !== label);
                            handleChange(qid, next); // ← same handler, same data shape
                          }}
                        />
                      }
                      label={`${label}. ${opt}`}
                    />
                  );
                })}
              </FormGroup>
            )}

            {/* True/False */}
            {currentQuestion.questionType === "True/False" && (
              <RadioGroup
                value={answers[currentQuestion.questionId] || ""}
                onChange={(e) =>
                  handleChange(currentQuestion.questionId, [e.target.value])
                }
              >
                <FormControlLabel value="A" control={<Radio />} label="True" />
                <FormControlLabel value="B" control={<Radio />} label="False" />
              </RadioGroup>
            )}
          </Box>
        )}

        {/* Navigation + Submit */}
        {!result && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
              }}
            >
              <Button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex((i) => i - 1)}
              >
                Previous
              </Button>
              <Button
                disabled={currentQIndex === questions.length - 1}
                onClick={() => setCurrentQIndex((i) => i + 1)}
              >
                Next
              </Button>
            </Box>

            {/* 🔒 Submit now opens confirm dialog; real submit still uses handleSubmit(false) */}
            <Button
              variant="contained"
              onClick={requestSubmit}
              sx={{ mt: 3, backgroundColor: "#4748ac" }}
            >
              Submit
            </Button>
          </>
        )}
      </Box>

      {/* Right Navigator (hide whole column after submit so layout centers) */}
      {!result && (
        <Box sx={{ flex: 1, borderLeft: "1px solid #ccc", pl: 2 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: "bold",
              color: timeLeft < 60 ? "red" : "green",
            }}
          >
            Time Left: {formatTime(timeLeft)}
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
            Question Navigator
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {questions.map((q, idx) => (
              <Button
                key={idx}
                variant={currentQIndex === idx ? "contained" : "outlined"}
                sx={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: answers[q.questionId]
                    ? "#4748ac"
                    : "inherit",
                  color: answers[q.questionId] ? "white" : "inherit",
                }}
                onClick={() => setCurrentQIndex(idx)}
              >
                {idx + 1}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {/* ✅ Confirm dialog (keeps your submit logic intact) */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to submit your answers?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setConfirmOpen(false);
              handleSubmit(false); // ← original submit, unchanged
            }}
          >
            Yes, Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* ==========================================================
   ✅ ONE-BY-ONE EXPLANATION (new component)
   - Only one question explanation visible at a time
   - Prev/Next + progress bar
   - Styling aligned with your app
========================================================== */
/* ==========================================================
   ✅ ONE-BY-ONE EXPLANATION (only styling tweaks as asked)
   - Question text: BOLD (explanation mode only)
   - Options: Left aligned
   - Explanation text: Bold + #4748ac
   - NO logic change, NO color change for correct/incorrect
========================================================== */
function ExplanationPager({ results = [] }) {
  const [idx, setIdx] = useState(0);
  const total = Array.isArray(results) ? results.length : 0;
  const item = total ? results[idx] : null;
  const BRAND = "#4748ac";

  const normalizeArray = (v) => {
    if (Array.isArray(v)) {
      if (v.length === 1 && typeof v[0] === "string" && v[0].includes(",")) {
        return v[0].split(",").map((s) => s.trim());
      }
      return v.map(String);
    }
    if (typeof v === "string" && v.includes(",")) {
      return v.split(",").map((s) => s.trim());
    }
    return v != null ? [String(v)] : [];
  };

  const selected = normalizeArray(item?.submitted).map((x) => String(x).toUpperCase());
  const correct  = normalizeArray(item?.correct).map((x) => String(x).toUpperCase());
  const options  = Array.isArray(item?.options) ? item.options : [];

  // ⬇️ SAME coloring logic, bas left align force kar rahe hain
  const optionStyle = (label) => {
    const base = {
      ...styles.optionRow,
      textAlign: "left",
      alignItems: "flex-start",
    };
    const isSel = selected.includes(label);
    const isCor = correct.includes(label);
    if (isSel && isCor) return { ...base, ...styles.optionRowCorrect };     // ✅ as-is
    if (isSel && !isCor) return { ...base, ...styles.optionRowIncorrect };  // ✅ as-is
    if (!isSel && isCor) return { ...base, ...styles.optionRowHighlightCorrect }; // ✅ as-is
    return base;
  };

  if (!total) return <Typography sx={{ mt: 2 }}>No explanations found.</Typography>;

  return (
    <Box sx={{ mt: 2 }}>
      {/* top controls (unchanged) */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Chip
          label={`Question ${idx + 1} of ${total}`}
          sx={{ bgcolor: "rgba(71,72,172,0.08)", color: BRAND, fontWeight: 700 }}
        />
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            disabled={idx === 0}
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            sx={{ textTransform: "none", borderColor: BRAND, color: BRAND }}
          >
            Prev
          </Button>
          <Button
            variant="contained"
            disabled={idx >= total - 1}
            onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
            sx={{ textTransform: "none", bgcolor: BRAND, "&:hover": { bgcolor: "#3e40a5" } }}
          >
            {idx < total - 1 ? "Next" : "Done"}
          </Button>
        </Stack>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={((idx + 1) / total) * 100}
        sx={{ height: 8, borderRadius: 999, mb: 2, "& .MuiLinearProgress-bar": { backgroundColor: BRAND } }}
      />

      {/* card */}
      <div style={styles.card}>
        {/* 🔸 QUESTION TEXT BOLD (explanation view only) */}
        {!!item?.questionText && (
          <div style={{ ...styles.qTitle, fontWeight: 500 }}>
            <span style={styles.qIndex}>Q{idx + 1}:</span> {item.questionText}
          </div>
        )}

        {/* 🔸 OPTIONS LEFT-ALIGNED */}
        {options.length > 0 && (
          <div>
            {options.map((opt, i) => {
              const label = String.fromCharCode(65 + i);
              return (
                <div key={i} style={optionStyle(label)}>
                  <div style={{ ...styles.optionLabel, textAlign: "center" }}>{label}.</div>
                  <div style={{ ...styles.optionText, textAlign: "left" }}>{opt}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* 🔸 EXPLANATION TEXT BLUE (#4748ac) + BOLD */}
      {!!item?.explanation && (
  <div style={styles.explainBox}>
    <span style={{ color: "#000", fontWeight: 500 }}>
      Explanation:&nbsp;{item.explanation}
    </span>
  </div>
)}

      </div>
    </Box>
  );
}


/* =========================
   🎨 Inline styles (alignment-focused)
========================= */
const styles = {
  explanationToggle: {
    mt: 1.5,
    backgroundColor: "#4748ac",
    color: "white",
    borderRadius: "8px",
    px: 2.5,
    py: 1,
    textTransform: "none",
    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
    "&:hover": { backgroundColor: "#3f41a0", color: "white" },
  },

  card: {
    backgroundColor: "#eaf3ff",
    border: "1px solid #d6e2ff",
    borderRadius: 12,
    padding: "14px 16px",
    marginBottom: 16,
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  },

  qTitle: {
    fontSize: "1.15rem",
    marginBottom: 12,
    lineHeight: 1.4,
  },
  qIndex: {
    fontWeight: 700,
    marginRight: 6,
  },

  optionRow: {
    display: "grid",
    gridTemplateColumns: "32px 1fr",
    alignItems: "center",
    gap: 8,
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: "10px 12px",
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
    fontWeight: 600,
  },
  optionLabel: { width: 32, textAlign: "center" },
  optionText: { whiteSpace: "pre-wrap", wordBreak: "break-word" },

  optionRowCorrect: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
    color: "#fff",
  },
  optionRowIncorrect: {
    backgroundColor: "#f44336",
    borderColor: "#f44336",
    color: "#fff",
  },
  optionRowHighlightCorrect: {
    backgroundColor: "#d4edda",
    borderColor: "#28a745",
    color: "#155724",
  },

  explainBox: {
    marginTop: 12,
    padding: "10px 12px",
    background: "#ffffff",
    border: "1px solid #cddafc",
    borderLeft: "4px solid #4748ac",
    borderRadius: 8,
    color: "#333",
  },
};

// import React, { useState, useEffect, useRef } from "react";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import API from "../../../LoginSystem/axios";

// // ✅ single MUI import (avoids duplicate bindings)
// import {
//   Box,
//   Button,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Checkbox,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Chip,
//   LinearProgress,
//   FormGroup,
//   Stack,
// } from "@mui/material";

// export default function StudentQBankSession() {
//   const { sessionId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const bankId = location.state?.bankId || null;

//   // ✅ Questions and duration from navigation state
//   const [questions, setQuestions] = useState(location.state?.questions || []);
//   const [answers, setAnswers] = useState({});
//   const [timeLeft, setTimeLeft] = useState(location.state?.duration * 60 || 600);
//   const [currentQIndex, setCurrentQIndex] = useState(0);
//   const [result, setResult] = useState(null);
//   const [session, setSession] = useState({
//     sessionId: sessionId || location.state?.sessionId || null,
//   });

//   // ✅ Explanation toggle (same page)
//   const [showExplain, setShowExplain] = useState(false);

//   // ✅ TIMER: keep interval id + submission guard
//   const timerRef = useRef(null);
//   const submittedRef = useRef(false); // prevents double submit (manual/auto)

//   // ✅ NEW: confirm modal state (does not change submit logic)
//   const [confirmOpen, setConfirmOpen] = useState(false);

//   useEffect(() => {
//     if (!questions.length) {
//       console.warn(
//         "⚠️ No questions found in state. If page was refreshed, implement GET /session/:id to reload."
//       );
//     } else {
//       console.log("✅ Loaded questions from filter form.");
//     }
//   }, [questions]);

//   useEffect(() => {
//     if (result || submittedRef.current) return;
//     if (timerRef.current) clearInterval(timerRef.current);

//     timerRef.current = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           if (timerRef.current) clearInterval(timerRef.current);
//           if (!submittedRef.current) {
//             submittedRef.current = true;
//             handleSubmit(true);
//           }
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [result]);

//   const formatTime = (secs) => {
//     const m = Math.floor(secs / 60);
//     const s = secs % 60;
//     return `${m}:${s < 10 ? "0" : ""}${s}`;
//   };

//   const handleChange = (qid, val) => {
//     if (result) return;
//     setAnswers({ ...answers, [qid]: val });
//   };

//   const handleSubmit = async (auto = false) => {
//     try {
//       if (submittedRef.current) return;
//       submittedRef.current = true;
//       if (timerRef.current) clearInterval(timerRef.current);

//       const sid =
//         session?.sessionId ||
//         location.state?.sessionId ||
//         sessionId ||
//         null;

//       if (!sid) {
//         console.error("❌ Missing sessionId — cannot submit");
//         return;
//       }

//       const res = await API.post(`/api/student/qbank/session/${sid}/submit`, {
//         answers,
//       });

//       setResult(res.data);
//       console.log("✅ Submit success:", res.data);
//     } catch (err) {
//       console.error("❌ Submit failed", err);
//       if (!auto) submittedRef.current = false;
//     }
//   };

//   const requestSubmit = () => setConfirmOpen(true);

//   const currentQuestion = questions[currentQIndex];

//   return (
//     <Box sx={{ p: 3, display: "flex", gap: 4, alignItems: "flex-start" }}>
//       {/* Left Side */}
//       <Box sx={{ flex: 3, maxWidth: 920, mx: "auto" }}>
//         {/* Back */}
//         <Box sx={{ mb: 2 }}>
//           <Button
//             variant="text"
//             startIcon={<ArrowBackIosNewIcon />}
//             onClick={() => {
//               if (bankId) {
//                 navigate(`/student/qbank/details/${bankId}`);
//               } else {
//                 navigate("/student/qbank");
//               }
//             }}
//             sx={{ color: "#4748ac", textTransform: "none", fontWeight: 600, px: 0 }}
//           >
//             Back to Details
//           </Button>
//         </Box>

//         {/* Result header + Explanation toggle */}
//         {result && (
//           <Box sx={{ mb: 3, textAlign: "left" }}>
//             <Typography variant="h5" sx={{ color: "green", fontWeight: "bold" }}>
//               ✅ Test Completed
//             </Typography>
//             <Typography variant="h6" sx={{ mb: 2 }}>
//               Your Score: <b>{result.score}</b> / <b>{result.total}</b>
//             </Typography>

//             <Button
//               variant="contained"
//               onClick={() => setShowExplain((v) => !v)}
//               sx={styles.explanationToggle}
//             >
//               {showExplain ? "Hide Explanation" : "Show Explanation"}
//             </Button>

//             {showExplain && (
//               <ExplanationPager results={result?.results || []} />
//             )}
//           </Box>
//         )}

//         {/* Question screen */}
//         {!result && currentQuestion && (
//           <Box sx={{ mb: 4 }}>
//             <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
//               {currentQIndex + 1}. {currentQuestion.questionText}
//             </Typography>

//             {/* Single Select */}
//             {currentQuestion.questionType === "Single-Select" && (
//               <RadioGroup
//                 sx={{
//                   gap: 1,
//                   alignItems: "flex-start",
//                   textAlign: "left",
//                   "& .MuiFormControlLabel-root": { m: 0, alignItems: "flex-start" },
//                   "& .MuiFormControlLabel-label": { whiteSpace: "pre-wrap", textAlign: "left" }
//                 }}
//                 value={answers[currentQuestion.questionId] || ""}
//                 onChange={(e) =>
//                   handleChange(currentQuestion.questionId, [e.target.value])
//                 }
//               >
//                 {currentQuestion.options.map((opt, i) => (
//                   <FormControlLabel
//                     key={i}
//                     value={String.fromCharCode(65 + i)}
//                     control={<Radio />}
//                     label={`${String.fromCharCode(65 + i)}. ${opt}`}
//                   />
//                 ))}
//               </RadioGroup>
//             )}

//             {/* Multi Select */}
//             {currentQuestion.questionType === "Multi-Select" && (
//               <FormGroup
//                 sx={{
//                   mt: 1,
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 1,
//                   textAlign: "left",
//                   "& .MuiFormControlLabel-root": { m: 0, alignItems: "flex-start" },
//                   "& .MuiFormControlLabel-label": { whiteSpace: "pre-wrap", textAlign: "left" }
//                 }}
//               >
//                 {currentQuestion.options.map((opt, i) => {
//                   const label = String.fromCharCode(65 + i);
//                   const qid = currentQuestion.questionId;
//                   const prev = answers[qid] || [];
//                   const checked = prev.includes(label);

//                   return (
//                     <FormControlLabel
//                       key={i}
//                       control={
//                         <Checkbox
//                           checked={checked}
//                           onChange={(e) => {
//                             const next = e.target.checked
//                               ? [...prev, label]
//                               : prev.filter((x) => x !== label);
//                             handleChange(qid, next);
//                           }}
//                         />
//                       }
//                       label={`${label}. ${opt}`}
//                     />
//                   );
//                 })}
//               </FormGroup>
//             )}

//             {/* True/False */}
//             {currentQuestion.questionType === "True/False" && (
//               <RadioGroup
//                 sx={{
//                   gap: 1,
//                   alignItems: "flex-start",
//                   textAlign: "left",
//                   "& .MuiFormControlLabel-root": { m: 0, alignItems: "flex-start" },
//                 }}
//                 value={answers[currentQuestion.questionId] || ""}
//                 onChange={(e) =>
//                   handleChange(currentQuestion.questionId, [e.target.value])
//                 }
//               >
//                 <FormControlLabel value="A" control={<Radio />} label="True" />
//                 <FormControlLabel value="B" control={<Radio />} label="False" />
//               </RadioGroup>
//             )}
//           </Box>
//         )}

//         {/* Navigation + Submit */}
//         {!result && (
//           <>
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 mt: 3,
//               }}
//             >
//               <Button
//                 disabled={currentQIndex === 0}
//                 onClick={() => setCurrentQIndex((i) => i - 1)}
//               >
//                 Previous
//               </Button>
//               <Button
//                 disabled={currentQIndex === questions.length - 1}
//                 onClick={() => setCurrentQIndex((i) => i + 1)}
//               >
//                 Next
//               </Button>
//             </Box>

//             <Button
//               variant="contained"
//               onClick={requestSubmit}
//               sx={{ mt: 3, backgroundColor: "#4748ac" }}
//             >
//               Submit
//             </Button>
//           </>
//         )}
//       </Box>

//       {/* Right Navigator */}
//       {!result && (
//         <Box sx={{ flex: 1, borderLeft: "1px solid #e5e7eb", pl: 2 }}>
//           <Typography
//             variant="h6"
//             sx={{
//               mb: 2,
//               fontWeight: "bold",
//               color: timeLeft < 60 ? "red" : "green",
//             }}
//           >
//             Time Left: {formatTime(timeLeft)}
//           </Typography>

//           <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
//             Question Navigator
//           </Typography>
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//             {questions.map((q, idx) => (
//               <Button
//                 key={idx}
//                 variant={currentQIndex === idx ? "contained" : "outlined"}
//                 sx={{
//                   minWidth: 40,
//                   height: 40,
//                   borderRadius: "50%",
//                   backgroundColor: answers[q.questionId]
//                     ? "#4748ac"
//                     : "inherit",
//                   color: answers[q.questionId] ? "white" : "inherit",
//                 }}
//                 onClick={() => setCurrentQIndex(idx)}
//               >
//                 {idx + 1}
//               </Button>
//             ))}
//           </Box>
//         </Box>
//       )}

//       {/* ✅ Confirm dialog */}
//       <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
//         <DialogTitle>Confirm Submission</DialogTitle>
//         <DialogContent>
//           <Typography>Are you sure you want to submit your answers?</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={() => {
//               setConfirmOpen(false);
//               handleSubmit(false);
//             }}
//           >
//             Yes, Submit
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// /* ==========================================================
//    ✅ ONE-BY-ONE EXPLANATION (polished as per your ask)
//    - Question text: BOLD
//    - Options: Left aligned
//    - Explanation text: Bold + #4748ac
// ========================================================== */
// /* ==========================================================
//    ✅ ONE-BY-ONE EXPLANATION (only styling tweaks as asked)
//    - Question text: BOLD (explanation mode only)
//    - Options: Left aligned
//    - Explanation text: Bold + #4748ac
//    - NO logic change, NO color change for correct/incorrect
// ========================================================== */
// function ExplanationPager({ results = [] }) {
//   const [idx, setIdx] = useState(0);
//   const total = Array.isArray(results) ? results.length : 0;
//   const item = total ? results[idx] : null;
//   const BRAND = "#4748ac";

//   const normalizeArray = (v) => {
//     if (Array.isArray(v)) {
//       if (v.length === 1 && typeof v[0] === "string" && v[0].includes(",")) {
//         return v[0].split(",").map((s) => s.trim());
//       }
//       return v.map(String);
//     }
//     if (typeof v === "string" && v.includes(",")) {
//       return v.split(",").map((s) => s.trim());
//     }
//     return v != null ? [String(v)] : [];
//   };

//   const selected = normalizeArray(item?.submitted).map((x) => String(x).toUpperCase());
//   const correct  = normalizeArray(item?.correct).map((x) => String(x).toUpperCase());
//   const options  = Array.isArray(item?.options) ? item.options : [];

//   // ⬇️ SAME coloring logic, bas left align force kar rahe hain
//   const optionStyle = (label) => {
//     const base = {
//       ...styles.optionRow,
//       textAlign: "left",
//       alignItems: "flex-start",
//     };
//     const isSel = selected.includes(label);
//     const isCor = correct.includes(label);
//     if (isSel && isCor) return { ...base, ...styles.optionRowCorrect };     // ✅ as-is
//     if (isSel && !isCor) return { ...base, ...styles.optionRowIncorrect };  // ✅ as-is
//     if (!isSel && isCor) return { ...base, ...styles.optionRowHighlightCorrect }; // ✅ as-is
//     return base;
//   };

//   if (!total) return <Typography sx={{ mt: 2 }}>No explanations found.</Typography>;

//   return (
//     <Box sx={{ mt: 2 }}>
//       {/* top controls (unchanged) */}
//       <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
//         <Chip
//           label={`Question ${idx + 1} of ${total}`}
//           sx={{ bgcolor: "rgba(71,72,172,0.08)", color: BRAND, fontWeight: 700 }}
//         />
//         <Stack direction="row" spacing={1}>
//           <Button
//             variant="outlined"
//             disabled={idx === 0}
//             onClick={() => setIdx((i) => Math.max(0, i - 1))}
//             sx={{ textTransform: "none", borderColor: BRAND, color: BRAND }}
//           >
//             Prev
//           </Button>
//           <Button
//             variant="contained"
//             disabled={idx >= total - 1}
//             onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
//             sx={{ textTransform: "none", bgcolor: BRAND, "&:hover": { bgcolor: "#3e40a5" } }}
//           >
//             {idx < total - 1 ? "Next" : "Done"}
//           </Button>
//         </Stack>
//       </Stack>

//       <LinearProgress
//         variant="determinate"
//         value={((idx + 1) / total) * 100}
//         sx={{ height: 8, borderRadius: 999, mb: 2, "& .MuiLinearProgress-bar": { backgroundColor: BRAND } }}
//       />

//       {/* card */}
//       <div style={styles.card}>
//         {/* 🔸 QUESTION TEXT BOLD (explanation view only) */}
//         {!!item?.questionText && (
//           <div style={{ ...styles.qTitle, fontWeight: 700 }}>
//             <span style={styles.qIndex}>Q{idx + 1}:</span> {item.questionText}
//           </div>
//         )}

//         {/* 🔸 OPTIONS LEFT-ALIGNED */}
//         {options.length > 0 && (
//           <div>
//             {options.map((opt, i) => {
//               const label = String.fromCharCode(65 + i);
//               return (
//                 <div key={i} style={optionStyle(label)}>
//                   <div style={{ ...styles.optionLabel, textAlign: "center" }}>{label}.</div>
//                   <div style={{ ...styles.optionText, textAlign: "left" }}>{opt}</div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* 🔸 EXPLANATION TEXT BLUE (#4748ac) + BOLD */}
//         {!!item?.explanation && (
//           <div style={styles.explainBox}>
//             <span style={{ color: BRAND, fontWeight: 700 }}>
//               Explanation:&nbsp;{item.explanation}
//             </span>
//           </div>
//         )}
//       </div>
//     </Box>
//   );
// }


// /* =========================
//    🎨 Inline styles (alignment-focused)
// ========================= */
// const styles = {
//   explanationToggle: {
//     mt: 1.5,
//     backgroundColor: "#4748ac",
//     color: "white",
//     borderRadius: "8px",
//     px: 2.5,
//     py: 1,
//     textTransform: "none",
//     boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
//     "&:hover": { backgroundColor: "#3f41a0", color: "white" },
//   },

//   card: {
//     backgroundColor: "#f8fbff",
//     border: "1px solid #e3ebff",
//     borderRadius: 12,
//     padding: "16px 18px",
//     marginBottom: 16,
//     boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
//     textAlign: "left",
//   },

//   qTitle: {
//     fontSize: "1rem",
//     marginBottom: 12,
//     lineHeight: 1.5,
//     textAlign: "left",
//   },
//   qIndex: {
//     fontWeight: 700,
//     marginRight: 6,
//   },

//   // Strong left alignment, no centering anywhere
//   optionRow: {
//     display: "grid",
//     gridTemplateColumns: "32px 1fr",
//     justifyContent: "start",
//     alignItems: "center",
//     gap: 10,
//     border: "1px solid #e5e7eb",
//     borderRadius: 10,
//     padding: "10px 12px",
//     marginBottom: 8,
//     backgroundColor: "#ffffff",
//     fontWeight: 500,
//     textAlign: "left",
//   },
//   optionLabel: { width: 32, textAlign: "center", fontWeight: 700 },
//   optionText: { whiteSpace: "pre-wrap", wordBreak: "break-word", textAlign: "left" },

//   // Selected & correct (subtle)
//   optionRowCorrect: {
//     backgroundColor: "#e8f6ee",
//     borderColor: "#b7e3c6",
//   },
//   // Selected but incorrect (subtle)
//   optionRowIncorrect: {
//     backgroundColor: "#fdecea",
//     borderColor: "#f5c2c0",
//   },
//   // Not selected but correct
//   optionRowHighlightCorrect: {
//     backgroundColor: "#f0f7ff",
//     borderColor: "#cfe2ff",
//   },

//   // Box + border, text bold/purple applied in component
//   explainBox: {
//     marginTop: 12,
//     padding: "12px 14px",
//     background: "#ffffff",
//     border: "1px solid #cddafc",
//     borderLeft: "4px solid #4748ac",
//     borderRadius: 8,
//   },
// };
