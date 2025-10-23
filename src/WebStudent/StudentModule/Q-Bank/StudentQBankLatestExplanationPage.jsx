import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../LoginSystem/context/AuthContext";
import API from "../../../LoginSystem/axios";
import { Box, Button, Typography, CircularProgress, Paper } from "@mui/material";

import ExplanationPanelSessionUI from "../../../Shared/ExplanationPanelSessionUI";

export default function StudentQBankLatestExplanationPage() {
  const { bankId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState(null); // { attemptId, review: [...] }

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const studentId = user?.sub || user?.id || user?.userId;
        const res = await API.get(
          `/api/student/qbank/${encodeURIComponent(bankId)}/latest-explanation`,
          { params: { studentId } }
        );
        setPayload(res.data || { attemptId: null, review: [] });
      } catch (e) {
        console.error(e);
        setError("Failed to load latest explanation.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [bankId, user]);

  // map API -> panel props
  const results = (payload?.review || []).map((r) => ({
    questionId: r.questionId,
    questionText: r.questionText,
    options: Array.isArray(r.options) ? r.options : [],
    submitted: Array.isArray(r.selected) ? r.selected : r.selected ? [r.selected] : [],
    correct: Array.isArray(r.correct) ? r.correct : r.correct ? [r.correct] : [],
    explanation: r.explanation || "",
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Latest Attempt Explanation
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
          <Button
            variant="contained"
            sx={{ background: "#4748ac" }}
            onClick={() => navigate(`/student/qbank/${bankId}/details`)}
          >
            Go to Analytics
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <CircularProgress size={22} />
          <Typography>Loading…</Typography>
        </Box>
      )}

      {!loading && error && (
        <Paper sx={{ p: 2, border: "1px solid #f5c2c7", background: "#f8d7da" }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {!loading && !error && results.length === 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography>No explanation available. Please complete a practice attempt.</Typography>
        </Paper>
      )}

      {!loading && !error && results.length > 0 && (
        <ExplanationPanelSessionUI results={results} />
      )}
    </Box>
  );
}
