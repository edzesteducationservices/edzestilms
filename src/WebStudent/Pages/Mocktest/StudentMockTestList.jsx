import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../LoginSystem/axios";
import { useAuth } from "../../../LoginSystem/context/AuthContext";

import {
  Box, Typography, Stack, Card, CardActionArea, CardMedia, CardContent,
  Chip, Button, CircularProgress
} from "@mui/material";

const resolveImageUrl = (raw) => {
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const m = String(raw).match(/^s3:\/\/([^/]+)\/(.+)$/i);
  if (!m) return raw;
  const [, bucket, key] = m;
  return `https://${bucket}.s3.amazonaws.com/${encodeURIComponent(key).replace(/%2F/g, "/")}`;
};

export default function StudentMockTestList() {
  const nav = useNavigate();
  const { ready, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  // Auth gate
  useEffect(() => {
    if (!ready) return;
    if (!user) nav("/login", { replace: true });
  }, [ready, user, nav]);

  // Fetch available mock tests
  useEffect(() => {
    if (!ready || !user) return;
    (async () => {
      try {
        const r = await API.get("/api/student/mocktests");
        setItems(Array.isArray(r.data?.items) ? r.data.items : []);
      } catch (e) {
        console.error(e);
        alert("Failed to load mock tests");
      } finally {
        setLoading(false);
      }
    })();
  }, [ready, user]);

  // Keep existing start/resume behavior for the button
  const startOrResume = async (mockTestId) => {
    try {
      const r = await API.post("/api/student/attempts", { mockTestId });
      // Use your exam route (match what ExamShell expects)
      nav(`/student/exam/${r.data?.attemptId}`);
    } catch (e) {
      console.error(e);
      alert("Could not start attempt");
    }
  };

  // New: clicking the card opens the Attempts page for that mock
  const openAttemptsForMock = (mockTestId) => {
    nav(`/student/attempts/${mockTestId}`);
  };

  if (!ready) {
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
        <Typography mt={2}>Loading…</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth={1200} mx="auto" mt={3}>
      <Typography variant="h5" fontWeight={800} mb={2}>Available Mock Tests</Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ rowGap: 2 }}>
        {items.map((m) => {
          const img = resolveImageUrl(m.imageUrl || "");
          const price = m.isFree ? "Free" : (m.price > 0 ? `₹${m.price}` : "Free");
          return (
            <Card key={m.mockTestId} sx={{ width: { xs: "100%", sm: 320 }, borderRadius: 2 }}>
              {/* Card click -> Attempts page (list in-progress/completed) */}
              <CardActionArea onClick={() => openAttemptsForMock(m.mockTestId)}>
                {img ? (
                  <CardMedia component="img" height="160" image={img} alt={m.title} sx={{ objectFit: "cover" }} />
                ) : (
                  <Box height={160} display="grid" placeItems="center" bgcolor="#f3f4f6" color="text.secondary">
                    No image
                  </Box>
                )}
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" fontWeight={700} noWrap>{m.title}</Typography>
                    <Chip
                      size="small"
                      label={m.status || "DRAFT"}
                      color={m.status === "PUBLISHED" ? "success" : "default"}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>{price}</Typography>
                </CardContent>
              </CardActionArea>

              {/* Button keeps existing behavior: starts/resumes immediately */}
              <Box px={2} pb={2}>
                <Button fullWidth variant="contained" onClick={() => openAttemptsForMock(m.mockTestId)}>
                  Start / Resume
                </Button>
              </Box>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}




