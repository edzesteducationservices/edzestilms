

// src/components/student/StudentQBankDetailsPage.js


import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../../LoginSystem/context/AuthContext";
import API from "../../../LoginSystem/axios";
import { useNavigate, useParams,useLocation } from "react-router-dom";

import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Stack,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

export default function StudentQBankDetailsPage() {
  const { bankId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [attemptsMap, setAttemptsMap] = useState({});
  const [bankMeta, setBankMeta] = useState(null);

  // Explanation dialog state
  const [expOpen, setExpOpen] = useState(false);
  const [loadingExp, setLoadingExp] = useState(false);
  const [expData, setExpData] = useState(null); // { attemptId, review: [...] }

  // fetch qbank meta
  useEffect(() => {
    API.get("/api/admin/qbank")
      .then((res) => {
        const list = res.data || [];
        const b = list.find((x) => (x.bankId || x._id || x.id) === bankId);
        setBankMeta(b || null);
      })
      .catch(() => {});
  }, [bankId]);

  // fetch attempts (for chart/table + to know if any attempt exists)
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const studentId = user?.sub || user?.id || user?.userId;
        if (!studentId) return;
        const res = await API.get(`/api/student/qbank/student/attempts/${studentId}`);
        setAttemptsMap(res.data?.attempts || {});
      } catch (e) {
        console.error(e);
      }
    };
    fetchAttempts();
  }, [user]);

  const latest = attemptsMap[bankId];
  const denom = latest?.filters?.questionCount || 1;

  // timeline (ascending by date)
  const timeline = useMemo(() => {
    let arr = latest?.allAttempts || [];
    arr = arr.slice().sort((a, b) => new Date(a.attemptDate) - new Date(b.attemptDate));
    if (!arr.length && latest) {
      return [
        {
          score: latest.score || 0,
          attemptDate: latest.startTime,
          total: latest.filters?.questionCount || denom,
        },
      ];
    }
    return arr;
  }, [latest, denom]);

  // chart data
  const chartData = useMemo(() => {
    return (timeline || []).map((a, i) => {
      const total = a.total || denom || 1;
      const percent = Math.round(((a.score || 0) / total) * 100);
      return {
        idx: i + 1,
        attempt: `Attempt ${i + 1}`,
        percent,
        date: a.attemptDate ? new Date(a.attemptDate).toLocaleString("en-IN") : "",
      };
    });
  }, [timeline, denom]);

  const startSession = () =>
  navigate(`/student/qbank/filter?bankId=${encodeURIComponent(bankId)}`);
  

  // Enable button if there’s any attempt at all
  const hasAnyAttempt = Boolean((timeline && timeline.length) || latest);

  // 🚀 Fetch latest explanation from new backend alias
  const openExplanation = async () => {
    setExpOpen(true);
    setLoadingExp(true);
    setExpData(null);
    try {
      // If your backend reads studentId from JWT, the params are optional
      const studentId = user?.sub || user?.id || user?.userId;
      const res = await API.get(
        `/api/student/qbank/${encodeURIComponent(bankId)}/latest-explanation`,
        { params: { studentId } }
      );
      setExpData(res.data || { attemptId: null, review: [] });
    } catch (err) {
      console.error("Explanation load failed:", err);
      setExpData({ error: "Failed to load explanation." });
    } finally {
      setLoadingExp(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Back to list */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIosNewIcon />}
          onClick={() => navigate("/student/qbank")}
          sx={{ color: "#4748ac", textTransform: "none", fontWeight: 600, px: 0 }}
        >
          Back to Banks
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        {bankMeta?.name || "Question Bank"} — Details
      </Typography>

      {/* TOP SECTION */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              🧾 Summary
            </Typography>
            <Typography variant="body2">
              Total Questions (last): <b>{denom}</b>
            </Typography>
            <Typography variant="body2">
              Total Attempts: <b>{chartData.length}</b>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Last Attempt:{" "}
              <b>
                {latest?.startTime
                  ? new Date(latest.startTime).toLocaleString("en-IN")
                  : (timeline?.length
                      ? (timeline[timeline.length - 1]?.attemptDate
                          ? new Date(timeline[timeline.length - 1].attemptDate).toLocaleString("en-IN")
                          : "—")
                      : "—")}
              </b>
            </Typography>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ background: "#4748ac" }}
                  onClick={startSession}
                >
                  Start Practice
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={openExplanation}
                  disabled={!hasAnyAttempt}
                  sx={{
                    borderColor: "#4748ac",
                    color: "#4748ac",
                    "&:hover": { borderColor: "#3c3da0", color: "#3c3da0" },
                  }}
                >
                  Explanation (Latest Attempt)
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              ℹ️ Info
            </Typography>
            <Typography variant="body2">
              View your complete attempt history and analyze progress.
            </Typography>
            <Typography variant="body2">
              Each bar below represents one attempt, with color indicating improvement (🟩 up, 🟥 down).
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* CHART */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          📊 Performance Trend (All Attempts)
        </Typography>
        <Box sx={{ width: "100%", height: 420 }}>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={chartData} margin={{ top: 40, right: 20, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="idx"
                tickFormatter={(v) => v}
                ticks={chartData.map((d) => d.idx)}
                label={{ value: "Attempt #", position: "insideBottom", dy: 45 }}
              />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} label={{ value: "Score (%)", angle: -90, position: "insideLeft" }} />
              <Legend verticalAlign="top" height={30} />
              <Tooltip formatter={(v) => [`${v}%`, "Score"]} labelFormatter={(_, p) => p?.[0]?.payload?.attempt || ""} />
              <Bar dataKey="percent" name="Score (%)" maxBarSize={30}>
                {chartData.map((d, i, arr) => {
                  const prev = i > 0 ? arr[i - 1].percent : d.percent;
                  let color = "#B0BEC5";
                  if (d.percent > prev) color = "#4CAF50";
                  else if (d.percent < prev) color = "#E53935";
                  return <Cell key={i} fill={color} />;
                })}
              </Bar>
              <Line type="monotone" dataKey="percent" name="Trend" stroke="#1976D2" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell align="right">Percent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeline.map((a, idx) => {
              const total = a.total || denom || 1;
              const pct = Math.round(((a.score || 0) / total) * 100);
              return (
                <TableRow key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{a.attemptDate ? new Date(a.attemptDate).toLocaleString("en-IN") : "—"}</TableCell>
                  <TableCell align="right">
                    {a.score || 0} / {total}
                  </TableCell>
                  <TableCell align="right">{pct}%</TableCell>
                </TableRow>
              );
            })}
            {!timeline.length && (
              <TableRow>
                <TableCell colSpan={4}>No attempts yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Explanation Modal */}
      <Dialog open={expOpen} onClose={() => setExpOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Latest Attempt Explanation
        </DialogTitle>

        <DialogContent dividers>
          {loadingExp && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <CircularProgress size={24} />
              <Typography>Loading…</Typography>
            </Stack>
          )}

          {!loadingExp && expData?.error && (
            <Typography color="error">{expData.error}</Typography>
          )}

          {!loadingExp && expData?.review?.length > 0 && (
            <Box sx={{ display: "grid", gap: 2 }}>
              {expData.review.map((r, idx) => {
                const isCorrect = String(r.selected ?? "").trim().toUpperCase() === String(r.correct ?? "").trim().toUpperCase();
                return (
                  <Paper
                    key={r.questionId || idx}
                    elevation={2}
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      border: "1px solid #eee",
                      background: isCorrect ? "#f5fff7" : "#fff6f6",
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, mb: 1 }}>
                      Q{idx + 1}. {r.questionText || "Question"}
                    </Typography>

                    {/* Options */}
                    <Box sx={{ mb: 1 }}>
                      {(r.options || []).map((opt, i) => {
                        const label = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[i] || `${i + 1}`;
                        return (
                          <Box key={i} sx={{ display: "flex", gap: 1, alignItems: "center", mb: 0.5 }}>
                            <Box
                              sx={{
                                width: 26, height: 26, borderRadius: "6px",
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 700, border: "1px solid #ddd",
                              }}
                            >
                              {label}
                            </Box>
                            <Typography>{opt}</Typography>
                          </Box>
                        );
                      })}
                    </Box>

                    {/* Selected vs Correct */}
                    <Stack direction="row" spacing={2} sx={{ mb: 1, flexWrap: "wrap" }}>
                      <Tag label="Selected" value={r.selected} />
                      <Tag label="Correct" value={r.correct} highlight />
                    </Stack>

                    {/* Explanation */}
                    {(r.explanation ?? "") !== "" && (
                      <Box
                        sx={{
                          p: 1.5, borderRadius: "10px", background: "#f8f9ff",
                          border: "1px solid #e6e8ff",
                        }}
                      >
                        <Typography sx={{ fontWeight: 600, mb: 0.5, color: "#4748ac" }}>
                          Explanation
                        </Typography>
                        <Typography sx={{ whiteSpace: "pre-wrap" }}>{r.explanation}</Typography>
                      </Box>
                    )}
                  </Paper>
                );
              })}
            </Box>
          )}

          {!loadingExp && !expData?.review?.length && !expData?.error && (
            <Typography>No explanation available for the latest attempt.</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setExpOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/** Small pill tag used in the modal */
function Tag({ label, value, highlight }) {
  return (
    <Box
      sx={{
        px: 1.2, py: 0.6, borderRadius: "999px",
        background: highlight ? "#e8fff0" : "#f2f2f2",
        border: "1px solid", borderColor: highlight ? "#bff3cf" : "#e0e0e0",
        display: "inline-flex", alignItems: "center", gap: 1,
      }}
    >
      <Typography sx={{ fontSize: 12, opacity: 0.7 }}>{label}:</Typography>
      <Typography sx={{ fontWeight: 600 }}>{String(value ?? "").toUpperCase()}</Typography>
    </Box>
  );
}
