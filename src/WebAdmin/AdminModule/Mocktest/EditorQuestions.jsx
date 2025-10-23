// // src/WebAdmin/MockTests/EditorQuestions.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../../../LoginSystem/axios";
// import {
//     Box, Card, CardContent, Typography,
//     Accordion, AccordionSummary, AccordionDetails,
//     Chip, Stack, CircularProgress, IconButton, Tooltip, Divider
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

// function SectionHeader({ idx, sec }) {
//     return (
//         <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%" }}>
//             <Chip size="small" label={idx + 1} variant="outlined" sx={{ minWidth: 28 }} />
//             <Typography sx={{ fontWeight: 700, flex: 1 }}> {sec.name || `Section ${idx + 1}`} </Typography>
//             <Typography sx={{ color: "text.secondary", mr: 1 }}>
//                 {sec.count} Questions • {(sec.count || 0)} Marks • 0 Groups
//             </Typography>
//             <Stack direction="row" spacing={0.5}>
//                 <Tooltip title="Move up">
//                     <span>
//                         <IconButton size="small" disabled={idx === 0}><ArrowUpwardIcon fontSize="small" /></IconButton>
//                     </span>
//                 </Tooltip>
//                 <Tooltip title="Move down">
//                     <span>
//                         <IconButton size="small" disabled={false}><ArrowDownwardIcon fontSize="small" /></IconButton>
//                     </span>
//                 </Tooltip>
//                 <Tooltip title="More">
//                     <IconButton size="small"><MoreVertIcon fontSize="small" /></IconButton>
//                 </Tooltip>
//             </Stack>
//         </Stack>
//     );
// }

// function QuestionRow({ i, q, onClick }) {
//     return (
//         <Box
//             onClick={onClick}
//             sx={{
//                 display: "grid",
//                 gridTemplateColumns: "40px 1fr auto",
//                 alignItems: "center",
//                 gap: 1.5,
//                 px: 1, py: 1,
//                 borderBottom: "1px solid",
//                 borderColor: "divider",
//                 cursor: "pointer",
//                 "&:hover": { bgcolor: "rgba(248,250,252,0.7)" }
//             }}
//         >
//             <Typography sx={{ color: "text.secondary" }}>{i + 1}</Typography>
//             <Typography noWrap title={q.question}>{q.question}</Typography>
//             <Stack direction="row" spacing={1}>
//                 {q.domain && <Chip size="small" variant="outlined" label={`#${q.domain}`} />}
//                 <Chip size="small" variant="outlined" label="Explanation" />
//                 {q.difficulty && <Chip size="small" variant="outlined" label={q.difficulty} />}
//             </Stack>
//         </Box>
//     );
// }

// export default function EditorQuestions() {
//     const { mockTestId } = useParams();
//     const navigate = useNavigate();

//     const [loading, setLoading] = useState(true);
//     const [header, setHeader] = useState(null);        // title, status, totals
//     const [sections, setSections] = useState([]);      // [{ name, startSerial, endSerial, count }]
//     const [open, setOpen] = useState({});              // { [idx]: true }
//     const [qCache, setQCache] = useState({});          // { [idx]: { loading, items } }

//     useEffect(() => {
//         (async () => {
//             try {
//                 const res = await API.get(`/api/admin/mocktests/${mockTestId}/sections`);
//                 setHeader({
//                     title: res.data?.title,
//                     status: res.data?.status,
//                     totalQuestions: res.data?.totalQuestions,
//                     totalMarks: res.data?.totalMarks,
//                 });
//                 setSections(Array.isArray(res.data?.sections) ? res.data.sections : []);
//             } catch (e) {
//                 console.error(e);
//                 alert("❌ Unable to load sections");
//             } finally {
//                 setLoading(false);
//             }
//         })();
//     }, [mockTestId]);

//     const loadQuestions = useCallback(async (idx) => {
//         setQCache((p) => ({ ...p, [idx]: { ...(p[idx] || {}), loading: true } }));
//         try {
//             const res = await API.get(`/api/admin/mocktests/${mockTestId}/sections/${idx}/questions`, {
//                 params: { offset: 0, limit: 200 },
//             });
//             setQCache((p) => ({ ...p, [idx]: { loading: false, items: res.data?.questions || [] } }));
//         } catch (e) {
//             console.error(e);
//             setQCache((p) => ({ ...p, [idx]: { loading: false, items: [] } }));
//         }
//     }, [mockTestId]);

//     const handleToggle = (idx, expanded) => {
//         setOpen((p) => ({ ...p, [idx]: expanded }));
//         if (expanded && !qCache[idx]?.items) loadQuestions(idx);

//         // compute the starting global index for a section
//         const sectionBaseIndex = (secIndex) => {
//             const s = sections[secIndex] || {};
//             // Prefer parser-provided serials if present
//             if (Number.isInteger(s.startSerial)) return Math.max(0, s.startSerial - 1);
//             // Fallback: accumulate counts of earlier sections
//             let base = 0;
//             for (let i = 0; i < secIndex; i++) base += Number(sections[i]?.count || 0);
//             return base;
//         };
//     };

//     if (loading) {
//         return (
//             <Box textAlign="center" mt={10}>
//                 <CircularProgress />
//                 <Typography sx={{ mt: 2 }}>Loading sections…</Typography>
//             </Box>
//         );
//     }

//     return (
//         <Box sx={{ maxWidth: 1100, mx: "auto", mt: 3 }}>
//             {/* Title row */}
//             <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
//                 {header?.status && <Chip label={header.status} color={header.status === "PUBLISHED" ? "success" : "default"} />}
//                 <Typography variant="h5" sx={{ fontWeight: 800 }}>
//                     Section-wise Breakdown
//                 </Typography>
//             </Stack>

//             <Card>
//                 <CardContent>
//                     {sections.map((sec, idx) => {
//                         const cache = qCache[idx];
//                         return (
//                             <Accordion
//                                 key={idx}
//                                 expanded={!!open[idx]}
//                                 onChange={(_, exp) => handleToggle(idx, exp)}
//                                 disableGutters
//                                 sx={{ borderRadius: 1, "&:before": { display: "none" }, mb: 1 }}
//                             >
//                                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                                     <SectionHeader idx={idx} sec={sec} />
//                                 </AccordionSummary>
//                                 <AccordionDetails sx={{ p: 0 }}>
//                                     {cache?.loading && (
//                                         <Box textAlign="center" py={3}><CircularProgress size={24} /></Box>
//                                     )}
//                                     {!cache?.loading && (cache?.items || []).map((q, i) => (
//                                         <QuestionRow
//                                             key={q.id || i}
//                                             i={i}
//                                             q={q}
//                                             onClick={() => {
//                                                 const absolute = sectionBaseIndex(idx) + i;
//                                                 navigate(`/admin/mocktests/editor/${mockTestId}/questions?idx=${absolute}`);
//                                             }}
//                                         />
//                                     ))}
//                                     {!cache?.loading && (!cache?.items || cache.items.length === 0) && (
//                                         <Typography sx={{ color: "text.secondary", px: 2, py: 2 }}>
//                                             No questions in this section.
//                                         </Typography>
//                                     )}
//                                 </AccordionDetails>
//                             </Accordion>
//                         );
//                     })}
//                     <Divider sx={{ mt: 1 }} />
//                     <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                         Tip: sections & counts come directly from your Excel parsing; expanding a section loads its questions on demand.
//                     </Typography>
//                 </CardContent>
//             </Card>
//         </Box>
//     );
// }




// src/WebAdmin/MockTests/EditorQuestions.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../LoginSystem/axios";
import {
  Box, Card, CardContent, Typography,
  Accordion, AccordionSummary, AccordionDetails,
  Chip, Stack, CircularProgress, IconButton, Tooltip, Divider
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function SectionHeader({ idx, sec }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%" }}>
      <Chip size="small" label={idx + 1} variant="outlined" sx={{ minWidth: 28 }} />
      <Typography sx={{ fontWeight: 700, flex: 1 }}>{sec.name || `Section ${idx + 1}`}</Typography>
      <Typography sx={{ color: "text.secondary", mr: 1 }}>
        {sec.count} Questions • {(sec.count || 0)} Marks • 0 Groups
      </Typography>
      <Stack direction="row" spacing={0.5}>
        <Tooltip title="Move up">
          <span>
            <IconButton size="small" disabled={idx === 0}><ArrowUpwardIcon fontSize="small" /></IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Move down">
          <span>
            <IconButton size="small"><ArrowDownwardIcon fontSize="small" /></IconButton>
          </span>
        </Tooltip>
        <Tooltip title="More">
          <IconButton size="small"><MoreVertIcon fontSize="small" /></IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}

function QuestionRow({ i, q, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "grid",
        gridTemplateColumns: "40px 1fr auto",
        alignItems: "center",
        gap: 1.5,
        px: 1, py: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:hover": { bgcolor: "rgba(248,250,252,0.7)" }
      }}
    >
      <Typography sx={{ color: "text.secondary" }}>{i + 1}</Typography>
      <Typography noWrap title={q.question}>{q.question}</Typography>
      <Stack direction="row" spacing={1}>
        {q.domain && <Chip size="small" variant="outlined" label={`#${q.domain}`} />}
        <Chip size="small" variant="outlined" label="Explanation" />
        {q.difficulty && <Chip size="small" variant="outlined" label={q.difficulty} />}
      </Stack>
    </Box>
  );
}

export default function EditorQuestions() {
  const { mockTestId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState(null);        // title, status, totals
  const [sections, setSections] = useState([]);      // [{ name, startSerial, endSerial, count }]
  const [open, setOpen] = useState({});              // { [idx]: true }
  const [qCache, setQCache] = useState({});          // { [idx]: { loading, items } }

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/api/admin/mocktests/${mockTestId}/sections`);
        setHeader({
          title: res.data?.title,
          status: res.data?.status,
          totalQuestions: res.data?.totalQuestions,
          totalMarks: res.data?.totalMarks,
        });
        setSections(Array.isArray(res.data?.sections) ? res.data.sections : []);
      } catch (e) {
        console.error(e);
        alert("❌ Unable to load sections");
      } finally {
        setLoading(false);
      }
    })();
  }, [mockTestId]);

  const loadQuestions = useCallback(async (idx) => {
    setQCache((p) => ({ ...p, [idx]: { ...(p[idx] || {}), loading: true } }));
    try {
      const res = await API.get(`/api/admin/mocktests/${mockTestId}/sections/${idx}/questions`, {
        params: { offset: 0, limit: 200 },
      });
      setQCache((p) => ({ ...p, [idx]: { loading: false, items: res.data?.questions || [] } }));
    } catch (e) {
      console.error(e);
      setQCache((p) => ({ ...p, [idx]: { loading: false, items: [] } }));
    }
  }, [mockTestId]);

  // ⬇️ moved to component scope so it's available in onClick
const sectionBaseIndex = useCallback((secIndex) => {
  const s = sections[secIndex] || {};
  if (Number.isInteger(s.startSerial)) return Math.max(0, s.startSerial - 1);
  let base = 0;
  for (let k = 0; k < secIndex; k++) base += Number(sections[k]?.count || 0);
  return base;
}, [sections]);


  const handleToggle = (idx, expanded) => {
    setOpen((p) => ({ ...p, [idx]: expanded }));
    if (expanded && !qCache[idx]?.items) loadQuestions(idx);
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading sections…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mt: 3 }}>
      {/* Title row */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        {header?.status && (
          <Chip
            label={header.status}
            color={header.status === "PUBLISHED" ? "success" : "default"}
          />
        )}
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Section-wise Breakdown
        </Typography>
      </Stack>

      <Card>
        <CardContent>
          {sections.map((sec, idx) => {
            const cache = qCache[idx];
            return (
              <Accordion
                key={idx}
                expanded={!!open[idx]}
                onChange={(_, exp) => handleToggle(idx, exp)}
                disableGutters
                sx={{ borderRadius: 1, "&:before": { display: "none" }, mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <SectionHeader idx={idx} sec={sec} />
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  {cache?.loading && (
                    <Box textAlign="center" py={3}><CircularProgress size={24} /></Box>
                  )}
                  {!cache?.loading && (cache?.items || []).map((q, i) => (
                    <QuestionRow
                      key={q.id || i}
                      i={i}
                      q={q}
                      onClick={() => {
                        const absolute = sectionBaseIndex(idx) + i;
                        navigate(`/admin/mocktests/editor/${mockTestId}/questions?idx=${absolute}`);
                      }}
                    />
                  ))}
                  {!cache?.loading && (!cache?.items || cache.items.length === 0) && (
                    <Typography sx={{ color: "text.secondary", px: 2, py: 2 }}>
                      No questions in this section.
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
          <Divider sx={{ mt: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Tip: sections & counts come directly from your Excel parsing; expanding a section loads its questions on demand.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
