import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../LoginSystem/context/AuthContext";
import API from "../../../LoginSystem/axios";
import {
  Box, Paper, Stack, Typography, Button, Chip, CircularProgress,
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer, IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

function fmtEpoch(ts) {
  if (!ts) return "-";
  const d = new Date(Number(ts) * 1000);
  return d.toLocaleString();
}
function fmtHMS(sec) {
  const s = Math.max(0, Math.floor(Number(sec || 0)));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return [h, m, r].map(v => String(v).padStart(2, "0")).join(":");
}

export default function StudentAttempts() {
  const { mockTestId } = useParams();
  const nav = useNavigate();
  const { ready, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [mockIndex, setMockIndex] = useState({});
  const [selectedMock, setSelectedMock] = useState(null);

  useEffect(() => {
    if (!ready || !user) return;
    let mounted = true;
    (async () => {
      try {
        const r = await API.get("/api/student/mocktests");
        const items = Array.isArray(r.data?.items) ? r.data.items : [];
        const map = {};
        for (const it of items) {
          map[it.mockTestId] = { title: it.title || "Mock Test", duration: it.duration };
        }
        if (mounted) {
          setMockIndex(map);
          if (mockTestId && map[mockTestId]) setSelectedMock(map[mockTestId]);
        }
      } catch (e) {
        console.error("Load mock list failed:", e);
      }
    })();
    return () => { mounted = false; };
  }, [ready, user, mockTestId]);

  const loadAttempts = useCallback(async () => {
    if (!ready || !user) return;
    setLoading(true);
    try {
      const url = `/api/student/attempts/list${mockTestId ? `?mockTestId=${encodeURIComponent(mockTestId)}` : ""}`;
      const r = await API.get(url);
      const items = Array.isArray(r.data?.items) ? r.data.items : [];
      setRows(items);
    } catch (e) {
      console.error("Load attempts failed:", e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [ready, user, mockTestId]);

  useEffect(() => { loadAttempts(); }, [loadAttempts]);

  useEffect(() => {
    const onShow = () => document.visibilityState === "visible" && loadAttempts();
    document.addEventListener("visibilitychange", onShow);
    return () => document.removeEventListener("visibilitychange", onShow);
  }, [loadAttempts]);

  const tableRows = useMemo(() => {
    return rows
      .slice()
      .sort((a, b) => Number(b.createdAtEpoch || 0) - Number(a.createdAtEpoch || 0))
      .map((r) => {
        const fallback = mockIndex[r.mockTestId];
        return {
          ...r,
          displayTitle: r.title || fallback?.title || "Mock Test",
          adminMinutes: fallback?.duration ?? null,
        };
      });
  }, [rows, mockIndex]);

  // ✅ detect any in-progress attempt (for the current mock when mockTestId is set)
  const hasInProgress = useMemo(
    () => Array.isArray(rows) && rows.some(r => r.status === "IN_PROGRESS"),
    [rows]
  );

  // optional: you can keep these start/resume helpers, or remove them if not needed
  const continueAttempt = async (mId) => {
    try {
      const { data } = await API.post("/api/student/attempts", { mockTestId: mId });
      const attemptId = data?.attemptId;
      if (attemptId) nav(`/student/attempt/${attemptId}`);
      else alert("Could not start/resume the attempt.");
    } catch (e) {
      console.error(e);
      alert("Failed to start/resume the attempt.");
    }
  };
  const createNewAttempt = async (mId) => {
    try {
      const { data } = await API.post("/api/student/attempts", {
        mockTestId: mId,
        forceNew: true,
        cancelPrevious: false,
      });
      const attemptId = data?.attemptId;
      if (attemptId) nav(`/student/attempt/${attemptId}`);
      else alert("Could not start a new attempt.");
    } catch (e) {
      console.error(e);
      alert("Failed to start a new attempt.");
    }
  };

  // 👉 NEW: clear attempts button handler
  const clearAttempts = async () => {
    const scopeText = mockTestId ? "this mock" : "ALL your attempts";
    if (!window.confirm(`Are you sure you want to permanently delete ${scopeText}? This cannot be undone.`)) return;
    try {
      const url = `/api/student/attempts/clear${mockTestId ? `?mockTestId=${encodeURIComponent(mockTestId)}` : ""}`;
      await API.delete(url);
      await loadAttempts();
    } catch (e) {
      console.error("Clear attempts failed:", e);
      alert("Failed to clear attempts.");
    }
  };

  if (!ready) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography mt={2}>Preparing your session…</Typography>
      </Box>
    );
  }
  if (ready && !user) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography>You need to log in to view attempts.</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => nav("/login")}>Go to Login</Button>
      </Box>
    );
  }
  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography mt={2}>Loading your attempts…</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth={1200} mx="auto" my={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <IconButton onClick={() => nav(-1)} size="small" sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={800}>
            {mockTestId ? (selectedMock?.title || "Your Attempts") : "Your Attempts"}
          </Typography>
          {mockTestId && selectedMock?.duration != null && (
            <Chip size="small" label={`Duration: ${selectedMock.duration} min`} sx={{ ml: 1 }} />
          )}
        </Stack>

        <Stack direction="row" spacing={1}>
          {/* Optional start/resume controls — kept as-is */}
          {mockTestId && (
            <>
              {/* 🔒 Hide Start New Attempt when any attempt is IN_PROGRESS */}
              {!hasInProgress && (
                <Button
                  variant="outlined"
                  startIcon={<RestartAltIcon />}
                  onClick={() => createNewAttempt(mockTestId)}
                >
                  Start New Attempt
                </Button>
              )}
            </>
          )}
          {/* 👉 Clear attempts button */}
          <Button color="error" variant="outlined" startIcon={<DeleteSweepIcon />} onClick={clearAttempts}>
            {mockTestId ? "Clear This Mock" : "Clear All"}
          </Button>
        </Stack>
      </Stack>

      <Paper elevation={1}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {!mockTestId && <TableCell>Test</TableCell>}
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell align="right">Duration</TableCell>
                <TableCell align="center" width={220}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tableRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={mockTestId ? 6 : 7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No attempts found.</Typography>
                  </TableCell>
                </TableRow>
              )}

              {tableRows.map((row) => {
                const isInProgress = row.status === "IN_PROGRESS";
                const isSubmitted  = row.status === "SUBMITTED";
                return (
                  <TableRow key={row.attemptId}>
                    {!mockTestId && (
                      <TableCell>
                        <Typography
                          fontWeight={700}
                          sx={{ cursor: "pointer" }}
                          onClick={() => nav(`/student/attempts/${row.mockTestId}`)}
                        >
                          {row.displayTitle}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography>{row.status || "-"}</Typography>
                        {isInProgress && <Chip size="small" label="In Progress" color="warning" />}
                        {isSubmitted  && <Chip size="small" label="Completed" color="success" />}
                      </Stack>
                    </TableCell>
                    <TableCell>{fmtEpoch(row.createdAtEpoch)}</TableCell>
                    <TableCell>{fmtEpoch(row.submittedAtEpoch)}</TableCell>
                    <TableCell align="right">{fmtHMS(row.durationSec)}</TableCell>
                    <TableCell align="center">
                      {isSubmitted ? (
                        <IconButton onClick={() => nav(`/student/results/${row.attemptId}`)} size="small" title="View Result">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<PlayArrowIcon />}
                          onClick={() => continueAttempt(mockTestId)}
                          sx={{ backgroundColor: "#4748ac" }}
                        >
                          Resume
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
