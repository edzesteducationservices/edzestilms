import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../LoginSystem/axios";


import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";



export default function StudentQBankHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch all attempts from backend
  useEffect(() => {
    async function fetchAttempts() {
      try {
        const res = await API.get("/student/qbank/attempts/my");
        setAttempts(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching attempts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAttempts();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (attempts.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          ⚠️ No attempts found yet.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Start your first Question Bank practice to see results here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "bold", color: "#4748ac" }}
      >
        📊 My Question Bank Attempts
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: "12px", overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ background: "#f0f0f0" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Bank ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Score</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attempts.map((a, i) => (
              <TableRow key={a.attemptId}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  {new Date(a.startedAt).toLocaleDateString()}{" "}
                  {new Date(a.startedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>{a.bankId}</TableCell>
                <TableCell>
                  {a.score !== undefined ? `${a.score}/${a.total}` : "—"}
                </TableCell>
                <TableCell>
                  {a.status === "COMPLETED" ? (
                    <Typography color="green" fontWeight="bold">
                      ✅ Completed
                    </Typography>
                  ) : (
                    <Typography color="orange" fontWeight="bold">
                      ⏳ In Progress
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {a.status === "COMPLETED" ? (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ background: "#4748ac" }}
                      onClick={() =>
                        navigate(`/student/qbank/session/${a.attemptId}`, {
                          state: { reviewMode: true },
                        })
                      }
                    >
                      Review
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        navigate(`/student/qbank/session/${a.attemptId}`)
                      }
                    >
                      Resume
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
