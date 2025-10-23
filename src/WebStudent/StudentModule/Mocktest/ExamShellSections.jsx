import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../LoginSystem/context/AuthContext";
import API from "../../../LoginSystem/axios";

import {
  Box, Stack, Typography, Button, Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

import QuestionView from "./QuestionView";
import QuestionNavigator from "./QuestionNavigator";

function fmtHMS(sec) {
  const s = Math.max(0, Math.floor(sec || 0));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return [h, m, r].map(v => String(v).padStart(2, "0")).join(":");
}

export default function ExamShellSections() {
  const { mockTestId } = useParams();
  const nav = useNavigate();
  const { ready, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);            // attempt doc
  const [currentQ, setCurrentQ] = useState(0);             // index within current section
  const [sectionBase, setSectionBase] = useState(0);       // absolute base index
  const [sectionCount, setSectionCount] = useState(0);     // number of questions in this section
  const [question, setQuestion] = useState(null);          // fetched question payload
  const [breakOpen, setBreakOpen] = useState(false);
  const [breakLeft, setBreakLeft] = useState(0);

  // auth gate
  useEffect(() => { if (ready && !user) nav("/login", { replace: true }); }, [ready, user, nav]);

  // start or resume attempt (server returns existing IN_PROGRESS or creates new)
  useEffect(() => {
    if (!ready || !user) return;
    (async () => {
      try {
        const r = await API.post("/api/student/attempts", { mockTestId });
        const att = r.data;
        setAttempt(att);
      } catch (e) {
        console.error(e);
        alert("Unable to start attempt");
      } finally {
        setLoading(false);
      }
    })();
  }, [ready, user, mockTestId]);

  // compute current section window
  useEffect(() => {
    if (!attempt) return;
    if (!attempt.useSections || !Array.isArray(attempt.sections) || attempt.sections.length === 0) {
      // no sections: treat as one big window
      setSectionBase(0);
      setSectionCount(Number(attempt.totalQuestions || 0)); // optional
      return;
    }
    const i = attempt.currentSection ?? 0;
    let base = 0;
    for (let j = 0; j < i; j++) base += Number(attempt.sections[j]?.count || 0);
    const cnt = Number(attempt.sections[i]?.count || 0);
    setSectionBase(base);
    setSectionCount(cnt);
    setCurrentQ(0);
  }, [attempt]);

  // ---- Correct question loader (binds to attemptId + absolute qIndex)
  async function loadQuestion(absIndex) {
    if (!attempt?.attemptId) return;
    try {
      const r = await API.get(`/api/student/attempts/${attempt.attemptId}/questions/${absIndex}`);
      setQuestion(r.data);
    } catch (e) {
      console.error("load question failed:", e);
      setQuestion(null);
    }
  }

  // fetch current question (uses the fixed loader)
  useEffect(() => {
    if (!attempt?.attemptId) return;
    const absIndex = sectionBase + currentQ; // 0-based absolute
    loadQuestion(absIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt?.attemptId, sectionBase, currentQ]);

  // save progress to the correct endpoint (unchanged logic, just correct route)
  async function saveProgress(delta = {}) {
    if (!attempt?.attemptId) return;
    const absIndex = sectionBase + currentQ;
    try {
      await API.patch(`/api/student/attempts/${attempt.attemptId}/answers/${absIndex}`, {
        ...delta, // { answer, flagged, strikes, highlights, timeSpentSec, currentIndex? }
      });
    } catch (e) {
      console.error("save failed", e);
    }
  }

  function gotoNext() {
    if (currentQ + 1 < sectionCount) setCurrentQ((i) => i + 1);
    else onSubmitSection(); // at section end: trigger submit dialog
  }
  function gotoPrev() {
    if (currentQ > 0) setCurrentQ((i) => i - 1);
  }

  async function onSubmitSection() {
    if (!attempt?.attemptId) return;

    if (!attempt?.useSections) {
      // if single section / no sections -> final
      return onSubmitFinal();
    }
    const sec = attempt.currentSection ?? 0;
    if (!window.confirm(`Submit Section ${sec + 1}? You won't be able to change it later.`)) return;

    const r = await API.patch(`/api/student/attempts/${attempt.attemptId}/submit-section`, { sectionIndex: sec });
    const next = r.data?.nextSection;

    if (next === null || next === undefined) {
      // last section finished
      return onSubmitFinal();
    }

    // open break?
    if (Number(attempt.breakMinutes || 0) > 0) {
      setBreakLeft(Math.floor(Number(attempt.breakMinutes) * 60));
      setBreakOpen(true);
    }

    // refresh attempt (to pick new currentSection)
    const s = await API.get(`/api/student/attempts/${attempt.attemptId}/summary`);
    setAttempt(s.data.attempt);
  }

  async function onSubmitFinal() {
    if (!attempt?.attemptId) return;
    if (!window.confirm("Submit the test? This will finalize your attempt.")) return;
    await API.patch(`/api/student/attempts/${attempt.attemptId}/submit-final`);
    // Redirect to a result page; for now go to attempts list
    nav(`/student/mocktests/${attempt.mockTestId}/attempts`, { replace: true });
  }

  // break countdown effect
  useEffect(() => {
    if (!breakOpen) return;
    if (breakLeft <= 0) return;
    const t = setTimeout(() => setBreakLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [breakOpen, breakLeft]);

  if (loading || !attempt) {
    return <Box p={3} display="grid" placeItems="center"><CircularProgress /></Box>;
  }

  const secIdx = attempt.currentSection ?? 0;
  const totalSections = attempt.useSections ? attempt.sections.length : 1;

  return (
    <Box p={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography fontWeight={700}>
          {attempt.title || "Mock Test"}{" "}
          {attempt.useSections && (
            <Chip size="small" label={`Section ${secIdx + 1}/${totalSections}`} sx={{ ml: 1 }} />
          )}
        </Typography>
        <Typography>Time Left: <strong>{fmtHMS(attempt.timeLeftSec)}</strong></Typography>
      </Stack>

      <QuestionView
        data={question}
        disabled={false}
        onSave={(delta) => saveProgress(delta)}
      />

      <Stack direction="row" spacing={1} mt={2}>
        <Button variant="outlined" onClick={gotoPrev} disabled={currentQ === 0}>Previous</Button>
        <Button variant="contained" onClick={gotoNext}>
          {currentQ + 1 < sectionCount ? "Next" : attempt.useSections ? "Submit Section" : "Submit Test"}
        </Button>
      </Stack>

      <QuestionNavigator
        open={false}
        // wire it the same way you already did in your modal
      />

      {/* Break dialog */}
      <Dialog open={breakOpen} onClose={() => setBreakOpen(false)}>
        <DialogTitle>Section Break</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>
            You can take a break for up to {attempt.breakMinutes} minute(s).
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Remaining: <strong>{fmtHMS(breakLeft)}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBreakOpen(false)}>Skip break</Button>
          <Button onClick={() => setBreakOpen(false)} disabled={breakLeft > 0}>Continue</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
