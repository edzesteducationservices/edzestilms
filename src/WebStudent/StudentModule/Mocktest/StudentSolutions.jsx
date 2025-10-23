import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../../../LoginSystem/axios";
import { useAuth } from "../../../LoginSystem/context/AuthContext";
import {
  Box, Paper, Stack, Typography, Button, Chip, CircularProgress, Divider
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const BRAND = "#4748ac";
const GREEN = "#22c55e";
const RED = "#ef4444";

function inAns(ans, i) {
  return Array.isArray(ans) ? ans.includes(i) : Number(ans) === Number(i);
}
function isCorrectIndex(correct, i) {
  return Array.isArray(correct) ? correct.includes(i) : Number(correct) === Number(i);
}

export default function StudentSolutions() {
  const { attemptId } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const { ready, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ total: 0, questions: [], scope: { type: "all" }, sections: [] });
  const [idx, setIdx] = useState(0);
  const [authErr, setAuthErr] = useState(false);
  const [notSubmitted, setNotSubmitted] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const ac = new AbortController();
    (async () => {
      try {
        setAuthErr(false);
        setNotSubmitted(false);
        setLoading(true);

        const qs = new URLSearchParams(location.search);
        const section = qs.get("section");
        const url = section == null
          ? `/api/student/attempts/${attemptId}/solutions`
          : `/api/student/attempts/${attemptId}/solutions?section=${encodeURIComponent(section)}`;

        // generous timeout; server is fast (answered-only)
        const r = await API.get(url, { signal: ac.signal, timeout: 45000 });

        if (!ac.signal.aborted) {
          setData({
            total: Number(r.data?.total || 0),
            questions: r.data?.questions || [],
            scope: r.data?.scope || { type: "all" },
            sections: Array.isArray(r.data?.sections) ? r.data.sections : [],
          });
          setIdx(0);
        }
      } catch (e) {
        if (ac.signal.aborted) return;
        const status = e?.response?.status;
        if (status === 401) setAuthErr(true);
        else if (status === 400) setNotSubmitted(true);
        console.error(e);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [ready, user, attemptId, location.search]);

  useEffect(() => {
    setIdx((i) => Math.min(Math.max(0, i), Math.max(0, data.total - 1)));
  }, [data.total]);

  const q = data.questions[idx];

  const header = useMemo(() => {
    if (!q) return null;

    // Prefer “inside section” numbering if we have it
    const showInside = Number.isFinite(q.sectionNo) && Number.isFinite(q.sectionTotal);
    const title = showInside
      ? `Q ${q.sectionNo} of ${q.sectionTotal}`
      : `Question ${idx + 1} of ${data.total}`;

    const sectionChip =
      q.sectionName != null
        ? `${q.sectionName} ${Number.isFinite(q.sectionIndex) ? `(#${q.sectionIndex + 1})` : ""}`
        : null;

    return {
      title,
      status: q.status,
      sectionChip,
    };
  }, [q, idx, data.total]);

  if (!ready || loading) {
    return <Box p={4} display="grid" placeItems="center"><CircularProgress /></Box>;
  }

  if (ready && !user) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" sx={{ mb: 1 }}>Sign in required</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Please log in to view solutions.
        </Typography>
        <Button variant="contained" onClick={() => nav("/login")} sx={{ mr: 1 }}>
          Go to Login
        </Button>
        <Button variant="text" onClick={() => nav(-1)} startIcon={<ArrowBackIcon />}>
          Back
        </Button>
      </Box>
    );
  }

  if (authErr) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" sx={{ mb: 1 }}>Session expired</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Please log in again to continue.
        </Typography>
        <Button variant="contained" onClick={() => nav("/login")} sx={{ mr: 1 }}>
          Go to Login
        </Button>
        <Button variant="text" onClick={() => nav(-1)} startIcon={<ArrowBackIcon />}>
          Back
        </Button>
      </Box>
    );
  }

  if (notSubmitted) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" sx={{ mb: 1 }}>Solutions unavailable</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          You can view solutions after submitting your test.
        </Typography>
        <Button variant="contained" onClick={() => nav(-1)}>Go Back</Button>
      </Box>
    );
  }

  if (!q) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6">No questions found</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => nav(-1)}>Go Back</Button>
      </Box>
    );
  }

  function prev() { setIdx(i => Math.max(0, i - 1)); }
  function next() { setIdx(i => Math.min(data.total - 1, i + 1)); }

  return (
    <Box maxWidth={1300} mx="auto" my={3} px={2}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => nav(-1)} sx={{ textTransform: "none" }}>
          Back
        </Button>
        <Typography variant="h5" fontWeight={800}>Solutions</Typography>
        <Chip size="small" label={header?.title || ""} sx={{ ml: 1 }} />

        {header?.sectionChip && (
          <Chip size="small" label={header.sectionChip} sx={{ ml: 1 }} />
        )}

        {header?.status === "correct" && <Chip size="small" color="success" label="Correct" />}
        {header?.status === "wrong"   && <Chip size="small" color="error"   label="Wrong" />}
        {header?.status === "skipped" && <Chip size="small"               label="Skipped" />}
      </Stack>

      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} fontFamily={"sans-serif"} sx={{ mb: 2 }}>
          {q.questionText || "—"}
        </Typography>

        <Stack spacing={1.25}>
          {(q.options || []).map((opt, i) => {
            const picked   = inAns(q.userAnswer, i);
            const correct  = isCorrectIndex(q.correct, i);

            let border = "1px solid rgba(0,0,0,0.12)";
            let bg = "transparent";
            let color = "inherit";
            if (correct) {
              border = `1px solid ${GREEN}`;
              bg = "rgba(34,197,94,0.08)";
            }
            if (picked && !correct) {
              border = `1px solid ${RED}`;
              bg = "rgba(239,68,68,0.08)";
              color = RED;
            }

            return (
              <Box
                key={i}
                sx={{
                  p: 1.25, borderRadius: 1,
                  border, backgroundColor: bg, color,
                  transition: "all .15s ease",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="baseline">
                  <Box
                    sx={{
                      minWidth: 28, height: 28, borderRadius: "50%",
                      border: "1px solid rgba(0,0,0,0.2)",
                      display: "grid", placeItems: "center",
                      fontSize: 14, fontWeight: 700,
                      backgroundColor: picked ? "rgba(0,0,0,0.05)" : "transparent",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </Box>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {opt}
                  </Typography>
                </Stack>
              </Box>
            );
          })}
        </Stack>

        {q.explanation && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ color: BRAND, fontWeight: 800, mb: .75 }}>
              Explanation
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {q.explanation}
            </Typography>
          </>
        )}

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<NavigateBeforeIcon />}
            onClick={prev}
            disabled={idx === 0}
          >
            Previous
          </Button>
          <Typography color="text.secondary">
            {idx + 1}/{data.total}
          </Typography>
          <Button
            variant="contained"
            endIcon={<NavigateNextIcon />}
            onClick={next}
            disabled={idx + 1 >= data.total}
            sx={{ backgroundColor: BRAND }}
          >
            Next
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
