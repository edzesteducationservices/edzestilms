// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import API from "../../../LoginSystem/axios";
// import {
//     Box, Typography, CircularProgress, TextField, Button, List,
//     ListItemButton, ListItemText, IconButton, Stack, Chip, Divider, MenuItem,
//     Paper, RadioGroup, Radio, FormControlLabel, Tooltip
// } from "@mui/material";
// import { Add, Delete, Save, ContentCopy, ArrowBack, ArrowForward } from "@mui/icons-material";
// import { Checkbox } from "@mui/material";

// const DEBOUNCE_MS = 1000;

// const prettyType = (t) => {
//     if (!t) return "Question";
//     const s = String(t).replace(/_/g, " ").trim();          // "Multi_Choice" -> "Multi Choice"
//     return s.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
// };


// export default function AdminMockTestQuestionEditor() {
//     const { mockTestId } = useParams();

//     const [outline, setOutline] = useState([]);       // [{i,id,title,options}]
//     const [summary, setSummary] = useState({ totalQuestions: 0, totalMarks: 0 });

//     const [activeIndex, setActiveIndex] = useState(0);
//     const [question, setQuestion] = useState(null);   // single question object
//     const [loading, setLoading] = useState(true);
//     const [qLoading, setQLoading] = useState(false);

//     const [saving, setSaving] = useState(false);
//     const [dirty, setDirty] = useState(false);
//     const [filterText, setFilterText] = useState("");

//     // NEW: dynamic difficulties from Excel (unique, trimmed, non-empty)
//     const [difficultyOptions, setDifficultyOptions] = useState([]);

//     const saveTimer = useRef(null);
//     const isMulti = /multi_choice/i.test(question?.questionType || "");

//     function toggleCorrect(zeroBasedIndex) {
//         const one = zeroBasedIndex + 1;
//         const curr = Array.isArray(question.correct) ? [...question.correct] : [];
//         const i = curr.indexOf(one);
//         if (i >= 0) curr.splice(i, 1);
//         else curr.push(one);
//         curr.sort((a, b) => a - b);
//         patch({ correct: curr });
//     }

//     // load outline (lightweight)
//     useEffect(() => {
//         (async () => {
//             try {
//                 const r = await API.get(`/api/admin/mocktests/fetch/${mockTestId}/questions/outline`);
//                 setOutline(r.data?.outline || []);
//                 setSummary(r.data?.summary || {});
//                 setActiveIndex(0);
//             } catch (e) {
//                 console.error("outline failed:", e);
//                 alert("❌ Unable to load questions");
//             } finally {
//                 setLoading(false);
//             }
//         })();
//     }, [mockTestId]);

//     // after outline: try to fetch the full questions blob once to derive all difficulties
//     useEffect(() => {
//         if (loading) return;
//         (async () => {
//             try {
//                 const r = await API.get(`/api/admin/mocktests/fetch/${mockTestId}/questions`);
//                 const rows = Array.isArray(r.data?.rows) ? r.data.rows : [];
//                 const uniq = Array.from(
//                     new Set(
//                         rows
//                             .map(q => (q?.difficulty ?? "").toString().trim())
//                             .filter(Boolean)
//                     )
//                 );
//                 if (uniq.length) setDifficultyOptions(uniq);
//             } catch (e) {
//                 // Non-fatal: we’ll still learn lazily from each loaded question
//                 // console.warn("bulk difficulties load skipped:", e?.message || e);
//             }
//         })();
//     }, [loading, mockTestId]);

//     // load a single question whenever index changes
//     useEffect(() => {
//         if (loading) return;
//         if (outline.length === 0) { setQuestion(null); return; }
//         (async () => {
//             try {
//                 setQLoading(true);
//                 const r = await API.get(`/api/admin/mocktests/fetch/${mockTestId}/questions/${activeIndex}`);
//                 const q = normalize(r.data?.question || {});
//                 setQuestion(q);
//                 setSummary(r.data?.summary || {});
//                 setDirty(false);

//                 // lazily merge difficulty into options
//                 const d = (q.difficulty ?? "").toString().trim();
//                 if (d) {
//                     setDifficultyOptions(prev => prev.includes(d) ? prev : [...prev, d]);
//                 }
//             } catch (e) {
//                 console.error("load question failed:", e);
//                 alert("❌ Failed to load question");
//             } finally {
//                 setQLoading(false);
//             }
//         })();
//     }, [activeIndex, outline.length, loading, mockTestId]);

//     // guard on unload
//     useEffect(() => {
//         const onBeforeUnload = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
//         window.addEventListener("beforeunload", onBeforeUnload);
//         return () => window.removeEventListener("beforeunload", onBeforeUnload);
//     }, [dirty]);

//     const filtered = useMemo(() => {
//         const s = (filterText || "").toLowerCase();
//         if (!s) return outline;
//         return outline.filter((o) => {
//             const t = (o.title || "").toLowerCase();
//             const opts = (o.options || []).join(" ").toLowerCase();
//             return t.includes(s) || opts.includes(s);
//         });
//     }, [outline, filterText]);

//     function normalize(q) {
//         return {
//             id: q.id || `q_${Date.now()}`,
//             instruction: q.instruction || "",
//             question: q.question || q.text || q.Question || "",
//             questionType: q.questionType || q.QuestionType || "Single_Choice",
//             options: Array.isArray(q.options) ? q.options : ["", "", "", ""],
//             answer: Number.isInteger(q.answer) ? q.answer : null,
//             correct: Array.isArray(q.correct) ? q.correct.slice() : [],
//             explanation: q.explanation || "",
//             tags: Array.isArray(q.tags)
//                 ? q.tags
//                 : typeof q.tags === "string"
//                     ? q.tags.split(",").map(s => s.trim()).filter(Boolean)
//                     : [],
//             section: q.section || q.Section || "",
//             // take difficulty exactly as present in S3/Excel (no hard-coded list)
//             difficulty:
//                 (q.difficulty ?? q.Difficulty ?? q.level ?? q.Level ?? "")
//                     .toString()
//                     .trim(),
//             marks: typeof q.marks === "number" ? q.marks : 1,
//         };
//     }

//     const patch = (p) => {
//         setQuestion((prev) => ({ ...prev, ...p }));
//         setDirty(true);
//         scheduleAutosave();
//     };

//     const updateOption = (idx, val) => {
//         const opts = [...(question?.options || [])];
//         opts[idx] = val;
//         patch({ options: opts });
//     };
//     const addOption = () => patch({ options: [...(question?.options || []), ""] });
//     const removeOption = (idx) => {
//         const opts = (question?.options || []).filter((_, i) => i !== idx);
//         let ans = question?.answer;
//         if (Number.isInteger(ans)) {
//             if (ans === idx) ans = null;
//             else if (idx < ans) ans = ans - 1;
//         }

//         let corr = Array.isArray(question?.correct) ? [...question.correct] : [];
//         // drop removed option from correct; shift those after it (1-based)
//         corr = corr
//             .filter(oneBased => oneBased !== idx + 1)
//             .map(oneBased => (oneBased > idx + 1 ? oneBased - 1 : oneBased));
//         // if single-choice and we have a valid 'answer', keep also correct=[answer+1] for consistency
//         if (!isMulti) {
//             corr = Number.isInteger(ans) ? [ans + 1] : [];
//         }

//         patch({ options: opts, answer: ans });
//     };

//     const scheduleAutosave = () => {
//         clearTimeout(saveTimer.current);
//         saveTimer.current = setTimeout(() => saveOne(true), DEBOUNCE_MS);
//     };

//     async function saveOne(silent = false) {
//         try {
//             if (!question) return;

//             const payload = { ...question };
//             if (isMulti) {
//                 // multi: ignore 'answer' at API level; correctness is in 'correct' (1-based)
//                 payload.answer = null;
//                 payload.correct = Array.isArray(question.correct)
//                     ? [...new Set(question.correct.filter(n => Number.isInteger(n) && n >= 1 && n <= (question.options?.length || 0)))].sort((a, b) => a - b)
//                     : [];
//             } else {
//                 // single: keep 'answer' 0-based and also provide 'correct' for parity
//                 payload.correct = Number.isInteger(question.answer) ? [question.answer + 1] : [];
//             }

//             setSaving(true);
//             const r = await API.patch(
//                 `/api/admin/mocktests/update-mock/${mockTestId}/questions/${activeIndex}`,
//                 payload
//             );
//             setSummary(r.data?.summary || {});
//             setDirty(false);
//             // refresh outline title for this row
//             setOutline((prev) => {
//                 const next = [...prev];
//                 if (next[activeIndex]) next[activeIndex] = {
//                     ...next[activeIndex],
//                     title: (question.question || "").slice(0, 140),
//                     options: question.options?.slice(0, 4) || [],
//                 };
//                 return next;
//             });

//             // also ensure difficultyOptions includes the current saved value
//             const d = (question.difficulty ?? "").toString().trim();
//             if (d) setDifficultyOptions(prev => prev.includes(d) ? prev : [...prev, d]);

//             if (!silent) alert("✅ Saved");
//         } catch (e) {
//             console.error("save failed:", e);
//             if (!silent) alert("❌ Failed to save");
//         } finally {
//             setSaving(false);
//         }
//     }

//     async function createNew(after = true) {
//         try {
//             const body = { question: normalize({}), at: after ? activeIndex + 1 : activeIndex };
//             const r = await API.post(`/api/admin/mocktests/update-mock/${mockTestId}/questions`, body);
//             // reload outline and jump to new index
//             const ol = await API.get(`/api/admin/mocktests/fetch/${mockTestId}/questions/outline`);
//             setOutline(ol.data?.outline || []);
//             setSummary(ol.data?.summary || {});
//             setActiveIndex(r.data?.index ?? (after ? activeIndex + 1 : activeIndex));
//         } catch (e) {
//             console.error("create failed:", e);
//             alert("❌ Failed to add question");
//         }
//     }

//     async function duplicateCurrent() {
//         try {
//             if (!question) return;
//             const body = { question: { ...question, id: `q_${Date.now()}` }, at: activeIndex + 1 };
//             const r = await API.post(`/api/admin/mocktests/update-mock/${mockTestId}/questions`, body);
//             const ol = await API.get(`/api/admin/mocktests/fetch/${mockTestId}/questions/outline`);
//             setOutline(ol.data?.outline || []);
//             setSummary(ol.data?.summary || {});
//             setActiveIndex(r.data?.index ?? activeIndex + 1);
//         } catch (e) {
//             console.error("duplicate failed:", e);
//             alert("❌ Failed to duplicate");
//         }
//     }

//     async function deleteCurrent() {
//         if (!outline.length) return;
//         if (!window.confirm("Delete this question?")) return;
//         try {
//             await API.delete(`/api/admin/mocktests/update-mock/${mockTestId}/questions/${activeIndex}`);
//             const ol = await API.get(`/api/admin/mocktests/fetch/${mockTestId}/questions/outline`);
//             setOutline(ol.data?.outline || []);
//             setSummary(ol.data?.summary || {});
//             setActiveIndex((i) => Math.max(0, i - 1));
//             setQuestion(null);
//         } catch (e) {
//             console.error("delete failed:", e);
//             alert("❌ Failed to delete");
//         }
//     }

//     const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
//     const next = () => setActiveIndex((i) => Math.min(outline.length - 1, i + 1));

//     if (loading) {
//         return (
//             <Box textAlign="center" mt={10}>
//                 <CircularProgress />
//                 <Typography mt={2}>Loading questions…</Typography>
//             </Box>
//         );
//     }

//     return (
//         <Box maxWidth="1100px" mx="auto" mt={3} mb={6}>
//             <Typography variant="h5" fontWeight="bold" mb={1}>📝 Question Editor</Typography>
//             <Typography variant="body2" color="text.secondary" mb={2}>
//                 {outline.length ? `${(activeIndex + 1)}/${outline.length} Questions • ${summary?.totalMarks ?? ""} Marks` : "No questions"}
//                 {dirty ? " • unsaved" : ""}
//             </Typography>

//             {/* Toolbar */}
//             <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ xs: "stretch", md: "center" }} mb={1}>
//                 <TextField
//                     fullWidth size="small" placeholder="Search (question / options)"
//                     value={filterText} onChange={(e) => setFilterText(e.target.value)}
//                 />
//                 <Stack direction="row" spacing={1} justifyContent="flex-end">
//                     <Tooltip title="Previous"><span>
//                         <IconButton onClick={prev} disabled={activeIndex === 0}><ArrowBack /></IconButton>
//                     </span></Tooltip>
//                     <Tooltip title="Next"><span>
//                         <IconButton onClick={next} disabled={activeIndex >= outline.length - 1}><ArrowForward /></IconButton>
//                     </span></Tooltip>
//                     <Button variant="outlined" startIcon={<ContentCopy />} onClick={duplicateCurrent}>Duplicate</Button>
//                     <Button variant="outlined" color="error" startIcon={<Delete />} onClick={deleteCurrent}>Delete</Button>
//                     <Button variant="contained" style={{backgroundColor:"#4748ac"}} startIcon={<Add />} onClick={() => createNew(true)}>New Question</Button>
//                     <Button variant="contained" color="success" startIcon={<Save />} onClick={() => saveOne(false)} disabled={saving || !question}>
//                         {saving ? "Saving…" : "Save"}
//                     </Button>
//                 </Stack>
//             </Stack>

//             {/* Editor */}
//             {qLoading ? (
//                 <Box textAlign="center" my={4}><CircularProgress /></Box>
//             ) : question ? (
//                 <Paper sx={{ p: 2 }}>
//                     <Typography variant="subtitle1" fontWeight="bold" mb={3}>{prettyType(question?.questionType)}</Typography>


//                     <TextField
//                         label="Question*" fullWidth multiline minRows={3}
//                         value={question.question} onChange={(e) => patch({ question: e.target.value })}
//                         sx={{ mb: 2 }}
//                     />

//                     <Typography fontWeight="600" mb={1}>Options*</Typography>
//                     {isMulti ? (
//                         <>
//                             {(question.options || []).map((opt, idx) => {
//                                 const oneBased = idx + 1;
//                                 const checked = Array.isArray(question.correct) && question.correct.includes(oneBased);
//                                 return (
//                                     <Stack key={idx} direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
//                                         <Checkbox
//                                             checked={!!checked}
//                                             onChange={() => toggleCorrect(idx)}
//                                         />
//                                         <TextField
//                                             fullWidth label={`${String.fromCharCode(65 + idx)}.`}
//                                             value={opt} onChange={(e) => updateOption(idx, e.target.value)}
//                                         />
//                                         <IconButton color="error" onClick={() => removeOption(idx)}><Delete /></IconButton>
//                                     </Stack>
//                                 );
//                             })}
//                         </>
//                     ) : (
//                         <RadioGroup
//                             value={Number.isInteger(question.answer) ? question.answer : -1}
//                             onChange={(e) => patch({ answer: Number(e.target.value) })}
//                         >
//                             {(question.options || []).map((opt, idx) => (
//                                 <Stack key={idx} direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
//                                     <FormControlLabel value={idx} control={<Radio />} label="" sx={{ mr: 0 }} />
//                                     <TextField
//                                         fullWidth label={`${String.fromCharCode(65 + idx)}.`}
//                                         value={opt} onChange={(e) => updateOption(idx, e.target.value)}
//                                     />
//                                     <IconButton color="error" onClick={() => removeOption(idx)}><Delete /></IconButton>
//                                 </Stack>
//                             ))}
//                         </RadioGroup>
//                     )}
//                     <Button startIcon={<Add />} onClick={addOption} sx={{ mb: 2 }}>Add choice</Button>

//                     <TextField
//                         label="Explanation" fullWidth multiline minRows={2}
//                         value={question.explanation} onChange={(e) => patch({ explanation: e.target.value })}
//                         sx={{ mb: 2 }}
//                     />

//                     <Divider sx={{ my: 2 }} />

//                     <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
//                         <TextField label="Section" fullWidth value={question.section} onChange={(e) => patch({ section: e.target.value })} />
//                         <TextField
//                             select fullWidth label="Difficulty"
//                             value={question.difficulty}
//                             onChange={(e) => patch({ difficulty: e.target.value })}
//                         >
//                             <MenuItem value="">(None)</MenuItem>
//                             {difficultyOptions.map((d) => (
//                                 <MenuItem key={d} value={d}>{d}</MenuItem>
//                             ))}
//                         </TextField>
//                         <TextField
//                             label="Marks" type="number" fullWidth
//                             value={question.marks} onChange={(e) => patch({ marks: Number(e.target.value || 1) })}
//                         />
//                     </Stack>

//                     <Typography fontWeight="600" mb={1}>Tags</Typography>
//                     <TagEditor
//                         value={Array.isArray(question.tags) ? question.tags : []}
//                         onAdd={(t) => patch({ tags: [...(question.tags || []), t] })}
//                         onDelete={(t) => patch({ tags: (question.tags || []).filter((x) => x !== t) })}
//                     />
//                 </Paper>
//             ) : (
//                 <Typography color="text.secondary">Select a question to edit.</Typography>
//             )}
//         </Box>
//     );
// }

// function TagEditor({ value, onAdd, onDelete }) {
//     const [input, setInput] = useState("");
//     return (
//         <Box>
//             <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
//                 <TextField
//                     size="small" label="Add tag" value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const t = input.trim(); if (t) onAdd(t); setInput(""); } }}
//                 />
//                 <Button variant="outlined" onClick={() => { const t = input.trim(); if (t) onAdd(t); setInput(""); }}>Add</Button>
//             </Stack>
//             <Stack direction="row" spacing={1} flexWrap="wrap">
//                 {value.map((t) => <Chip key={t} label={t} onDelete={() => onDelete(t)} />)}
//             </Stack>
//         </Box>
//     );
// }





import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams  } from "react-router-dom";
import API from "../../../LoginSystem/axios";
import {
  Box, Typography, CircularProgress, TextField, Button, List,
  ListItemButton, ListItemText, IconButton, Stack, Chip, Divider, MenuItem,
  Paper, RadioGroup, Radio, FormControlLabel, Tooltip
} from "@mui/material";
import { Add, Delete, Save, ContentCopy, ArrowBack, ArrowForward } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import { useAuth } from "../../../LoginSystem/context/AuthContext"; // ← use auth context

const DEBOUNCE_MS = 1000;

const prettyType = (t) => {
  if (!t) return "Question";
  const s = String(t).replace(/_/g, " ").trim();
  return s.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
};

export default function AdminMockTestQuestionEditor() {
  const { mockTestId } = useParams();
  const [searchParams] = useSearchParams();
  const { ready, user } = useAuth(); // ← wait for auth bootstrap

  const [outline, setOutline] = useState([]);       // [{i,id,title,options}]
  const [summary, setSummary] = useState({ totalQuestions: 0, totalMarks: 0 });

  const [activeIndex, setActiveIndex] = useState(0);
  const [question, setQuestion] = useState(null);   // single question object
  const [loading, setLoading] = useState(true);
  const [qLoading, setQLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [filterText, setFilterText] = useState("");

  // dynamic difficulties (unique, trimmed, non-empty)
  const [difficultyOptions, setDifficultyOptions] = useState([]);

  const saveTimer = useRef(null);

  // computed flag per render
  const isMulti = /multi_choice/i.test(question?.questionType || "");

   // NEW: whenever ?idx= changes, move the cursor
  useEffect(() => {
    const raw = searchParams.get("idx");
    const n = Number.parseInt(raw ?? "", 10);
    if (!Number.isNaN(n) && n >= 0) {
      setActiveIndex(n);
    } else {
      setActiveIndex(0);
    }
  }, [searchParams]);

  function toggleCorrect(zeroBasedIndex) {
    const one = zeroBasedIndex + 1;
    const curr = Array.isArray(question?.correct) ? [...question.correct] : [];
    const i = curr.indexOf(one);
    if (i >= 0) curr.splice(i, 1);
    else curr.push(one);
    curr.sort((a, b) => a - b);
    patch({ correct: curr });
  }

  // load outline (lightweight)
  useEffect(() => {
    // ← guard: need auth ready + mockTestId
    if (!ready || !mockTestId) return;
    (async () => {
      try {
        const r = await API.get(`/api/admin/mocktests/fetch/${mockTestId}/questions/outline`);
        setOutline(r.data?.outline || []);
        setSummary(r.data?.summary || {});
         // pick idx from query string if provided
       const raw = searchParams.get("idx");
       const wanted = Number.isInteger(parseInt(raw, 10)) ? Math.max(0, parseInt(raw, 10)) : 0;
       setActiveIndex(wanted);
      } catch (e) {
        console.error("outline failed:", e);
        alert("❌ Unable to load questions");
      } finally {
        setLoading(false);
      }
    })();
  }, [ready, mockTestId]);

  // after outline: fetch the full questions blob once to derive all difficulties
  useEffect(() => {
    if (!ready || loading || !mockTestId) return; // ← guard auth/route
    (async () => {
      try {
        const r = await API.get(`/api/admin/mocktests/fetch/${mockTestId}/questions`);
        const rows = Array.isArray(r.data?.rows) ? r.data.rows : [];
        const uniq = Array.from(
          new Set(
            rows.map(q => (q?.difficulty ?? "").toString().trim()).filter(Boolean)
          )
        );
        if (uniq.length) setDifficultyOptions(uniq);
      } catch (e) {
        // non-fatal
      }
    })();
  }, [ready, loading, mockTestId]);

  // load a single question whenever index changes
  useEffect(() => {
    if (!ready || loading || !mockTestId) return; // ← guard auth/route
    if (outline.length === 0) { setQuestion(null); return; }
    (async () => {
      try {
        setQLoading(true);
        const r = await API.get(`/api/admin/mocktests/fetch/${mockTestId}/questions/${activeIndex}`);
        const q = normalize(r.data?.question || {});
        setQuestion(q);
        setSummary(r.data?.summary || {});
        setDirty(false);

        // lazily merge difficulty into options
        const d = (q.difficulty ?? "").toString().trim();
        if (d) setDifficultyOptions(prev => prev.includes(d) ? prev : [...prev, d]);
      } catch (e) {
        console.error("load question failed:", e);
        alert("❌ Failed to load question");
      } finally {
        setQLoading(false);
      }
    })();
  }, [ready, activeIndex, outline.length, loading, mockTestId]);

  // cleanup autosave timer on unmount
  useEffect(() => {
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); }; // ← cleanup
  }, []);

  // guard on unload
  useEffect(() => {
    const onBeforeUnload = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const filtered = useMemo(() => {
    const s = (filterText || "").toLowerCase();
    if (!s) return outline;
    return outline.filter((o) => {
      const t = (o.title || "").toLowerCase();
      const opts = (o.options || []).join(" ").toLowerCase();
      return t.includes(s) || opts.includes(s);
    });
  }, [outline, filterText]);

  function normalize(q) {
    return {
      id: q.id || `q_${Date.now()}`,
      instruction: q.instruction || "",
      question: q.question || q.text || q.Question || "",
      questionType: q.questionType || q.QuestionType || "Single_Choice",
      options: Array.isArray(q.options) ? q.options : ["", "", "", ""],
      answer: Number.isInteger(q.answer) ? q.answer : null,
      correct: Array.isArray(q.correct) ? q.correct.slice() : [],
      explanation: q.explanation || "",
      tags: Array.isArray(q.tags)
        ? q.tags
        : typeof q.tags === "string"
          ? q.tags.split(",").map(s => s.trim()).filter(Boolean)
          : [],
      section: q.section || q.Section || "",
      difficulty: (q.difficulty ?? q.Difficulty ?? q.level ?? q.Level ?? "").toString().trim(),
      marks: typeof q.marks === "number" ? q.marks : 1,
    };
  }

  const patch = (p) => {
    setQuestion((prev) => ({ ...prev, ...p }));
    setDirty(true);
    scheduleAutosave();
  };

  const updateOption = (idx, val) => {
    const opts = [...(question?.options || [])];
    opts[idx] = val;
    patch({ options: opts });
  };
  const addOption = () => patch({ options: [...(question?.options || []), ""] });

  const removeOption = (idx) => {
    const opts = (question?.options || []).filter((_, i) => i !== idx);

    let ans = question?.answer;
    if (Number.isInteger(ans)) {
      if (ans === idx) ans = null;
      else if (idx < ans) ans = ans - 1;
    }

    let corr = Array.isArray(question?.correct) ? [...question.correct] : [];
    // drop removed option from correct; shift those after it (1-based)
    corr = corr
      .filter(oneBased => oneBased !== idx + 1)
      .map(oneBased => (oneBased > idx + 1 ? oneBased - 1 : oneBased));
    // if single-choice and we have a valid 'answer', keep also correct=[answer+1] for consistency
    if (!isMulti) {
      corr = Number.isInteger(ans) ? [ans + 1] : [];
    }

    patch({ options: opts, answer: ans, correct: corr }); // ← include 'correct'
  };

  const scheduleAutosave = () => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveOne(true), DEBOUNCE_MS);
  };

  async function saveOne(silent = false) {
    try {
      if (!question) return;
      setSaving(true);

      const payload = { ...question };
      if (isMulti) {
        payload.answer = null; // multi: ignore 'answer'
        payload.correct = Array.isArray(question.correct)
          ? [...new Set(question.correct.filter(n => Number.isInteger(n) && n >= 1 && n <= (question.options?.length || 0)))].sort((a, b) => a - b)
          : [];
      } else {
        payload.correct = Number.isInteger(question.answer) ? [question.answer + 1] : [];
      }

      const r = await API.patch(
        `/api/admin/mocktests/update-mock/${mockTestId}/questions/${activeIndex}`,
        payload
      );
      setSummary(r.data?.summary || {});
      setDirty(false);

      // refresh outline title for this row
      setOutline((prev) => {
        const next = [...prev];
        if (next[activeIndex]) next[activeIndex] = {
          ...next[activeIndex],
          title: (question.question || "").slice(0, 140),
          options: question.options?.slice(0, 4) || [],
        };
        return next;
      });

      // ensure difficulty options contains the saved value
      const d = (question.difficulty ?? "").toString().trim();
      if (d) setDifficultyOptions(prev => prev.includes(d) ? prev : [...prev, d]);

      if (!silent) alert("✅ Saved");
    } catch (e) {
      console.error("save failed:", e);
      if (!silent) alert("❌ Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function createNew(after = true) {
    try {
      const body = { question: normalize({}), at: after ? activeIndex + 1 : activeIndex };
      const r = await API.post(`/api/admin/mocktests/update-mock/${mockTestId}/questions`, body);
      const ol = await API.get(`/api/admin/mocktests/fetch/${mockTestId}/questions/outline`);
      setOutline(ol.data?.outline || []);
      setSummary(ol.data?.summary || {});
      setActiveIndex(r.data?.index ?? (after ? activeIndex + 1 : activeIndex));
    } catch (e) {
      console.error("create failed:", e);
      alert("❌ Failed to add question");
    }
  }

  async function duplicateCurrent() {
    try {
      if (!question) return;
      const body = { question: { ...question, id: `q_${Date.now()}` }, at: activeIndex + 1 };
      const r = await API.post(`/api/admin/mocktests/update-mock/${mockTestId}/questions`, body);
      const ol = await API.get(`/api/admin/mocktests/fetch/${mockTestId}/questions/outline`);
      setOutline(ol.data?.outline || []);
      setSummary(ol.data?.summary || {});
      setActiveIndex(r.data?.index ?? activeIndex + 1);
    } catch (e) {
      console.error("duplicate failed:", e);
      alert("❌ Failed to duplicate");
    }
  }

  async function deleteCurrent() {
    if (!outline.length) return;
    if (!window.confirm("Delete this question?")) return;
    try {
      await API.delete(`/api/admin/mocktests/update-mock/${mockTestId}/questions/${activeIndex}`);
      const ol = await API.get(`/api/admin/mocktests/fetch/${mockTestId}/questions/outline`);
      setOutline(ol.data?.outline || []);
      setSummary(ol.data?.summary || {});
      setActiveIndex((i) => Math.max(0, i - 1));
      setQuestion(null);
    } catch (e) {
      console.error("delete failed:", e);
      alert("❌ Failed to delete");
    }
  }

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => setActiveIndex((i) => Math.min(outline.length - 1, i + 1));

  if (!ready) { // ← wait for auth bootstrap
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography mt={2}>Preparing your session…</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography mt={2}>Loading questions…</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="1100px" mx="auto" mt={3} mb={6}>
      <Typography variant="h5" fontWeight="bold" mb={1}>📝 Question Editor</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {outline.length ? `${(activeIndex + 1)}/${outline.length} Questions • ${summary?.totalMarks ?? ""} Marks` : "No questions"}
        {dirty ? " • unsaved" : ""}
      </Typography>

      {/* Toolbar */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ xs: "stretch", md: "center" }} mb={1}>
        <TextField
          fullWidth size="small" placeholder="Search (question / options)"
          value={filterText} onChange={(e) => setFilterText(e.target.value)}
        />
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Tooltip title="Previous"><span>
            <IconButton onClick={prev} disabled={activeIndex === 0}><ArrowBack /></IconButton>
          </span></Tooltip>
          <Tooltip title="Next"><span>
            <IconButton onClick={next} disabled={activeIndex >= outline.length - 1}><ArrowForward /></IconButton>
          </span></Tooltip>
          {/* <Button variant="outlined" startIcon={<ContentCopy />} onClick={duplicateCurrent}>Duplicate</Button> */}
          <Button variant="outlined" color="error" startIcon={<Delete />} onClick={deleteCurrent}>Delete</Button>
          {/* <Button variant="contained" style={{ backgroundColor: "#4748ac" }} startIcon={<Add />} onClick={() => createNew(true)}>New Question</Button> */}
          <Button variant="contained" color="success" startIcon={<Save />} onClick={() => saveOne(false)} disabled={saving || !question}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </Stack>
      </Stack>

      {/* Editor */}
      {qLoading ? (
        <Box textAlign="center" my={4}><CircularProgress /></Box>
      ) : question ? (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={3}>{prettyType(question?.questionType)}</Typography>

          <TextField
            label="Question*" fullWidth multiline minRows={3}
            value={question.question} onChange={(e) => patch({ question: e.target.value })}
            sx={{ mb: 2 }}
          />

          <Typography fontWeight="600" mb={1}>Options*</Typography>
          {isMulti ? (
            <>
              {(question.options || []).map((opt, idx) => {
                const oneBased = idx + 1;
                const checked = Array.isArray(question.correct) && question.correct.includes(oneBased);
                return (
                  <Stack key={idx} direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Checkbox checked={!!checked} onChange={() => toggleCorrect(idx)} />
                    <TextField
                      fullWidth label={`${String.fromCharCode(65 + idx)}.`}
                      value={opt} onChange={(e) => updateOption(idx, e.target.value)}
                    />
                    <IconButton color="error" onClick={() => removeOption(idx)}><Delete /></IconButton>
                  </Stack>
                );
              })}
            </>
          ) : (
            <RadioGroup
              value={Number.isInteger(question.answer) ? question.answer : -1}
              onChange={(e) => patch({ answer: Number(e.target.value) })}
            >
              {(question.options || []).map((opt, idx) => (
                <Stack key={idx} direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <FormControlLabel value={idx} control={<Radio />} label="" sx={{ mr: 0 }} />
                  <TextField
                    fullWidth label={`${String.fromCharCode(65 + idx)}.`}
                    value={opt} onChange={(e) => updateOption(idx, e.target.value)}
                  />
                  <IconButton color="error" onClick={() => removeOption(idx)}><Delete /></IconButton>
                </Stack>
              ))}
            </RadioGroup>
          )}
          <Button startIcon={<Add />} onClick={addOption} sx={{ mb: 2 }}>Add choice</Button>

          <TextField
            label="Explanation" fullWidth multiline minRows={2}
            value={question.explanation} onChange={(e) => patch({ explanation: e.target.value })}
            sx={{ mb: 2 }}
          />

          <Divider sx={{ my: 2 }} />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
            <TextField label="Section" fullWidth value={question.section} onChange={(e) => patch({ section: e.target.value })} />
            <TextField
              select fullWidth label="Difficulty"
              value={question.difficulty}
              onChange={(e) => patch({ difficulty: e.target.value })}
            >
              <MenuItem value="">(None)</MenuItem>
              {difficultyOptions.map((d) => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Marks" type="number" fullWidth
              value={question.marks} onChange={(e) => patch({ marks: Number(e.target.value || 1) })}
            />
          </Stack>

          <Typography fontWeight="600" mb={1}>Tags</Typography>
          <TagEditor
            value={Array.isArray(question.tags) ? question.tags : []}
            onAdd={(t) => patch({ tags: [...(question.tags || []), t] })}
            onDelete={(t) => patch({ tags: (question.tags || []).filter((x) => x !== t) })}
          />
        </Paper>
      ) : (
        <Typography color="text.secondary">Select a question to edit.</Typography>
      )}
    </Box>
  );
}

function TagEditor({ value, onAdd, onDelete }) {
  const [input, setInput] = useState("");
  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <TextField
          size="small" label="Add tag" value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const t = input.trim(); if (t) onAdd(t); setInput(""); } }}
        />
        <Button variant="outlined" onClick={() => { const t = input.trim(); if (t) onAdd(t); setInput(""); }}>Add</Button>
      </Stack>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {value.map((t) => <Chip key={t} label={t} onDelete={() => onDelete(t)} />)}
      </Stack>
    </Box>
  );
}
