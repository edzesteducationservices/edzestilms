// src/WebAdmin/MockTests/AdminMockTestList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../LoginSystem/context/AuthContext";
import API from "../../../LoginSystem/axios";
import {
  Box, Typography, Card, CardContent, CardActionArea, CardMedia,
  TextField, MenuItem, Stack, Chip, CircularProgress, Button
} from "@mui/material";

/** s3://bucket/key -> https://bucket.s3.amazonaws.com/key */
const resolveImageUrl = (raw) => {
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const m = String(raw).match(/^s3:\/\/([^/]+)\/(.+)$/i);
  if (!m) return raw;
  const [, bucket, key] = m;
  return `https://${bucket}.s3.amazonaws.com/${encodeURIComponent(key).replace(/%2F/g, "/")}`;
};

export default function AdminMockTestList() {
  const navigate = useNavigate();
  const { user, ready } = useAuth();

  const [mockTests, setMockTests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  // NEW: selected mock for Settings button
  const [selectedMockId, setSelectedMockId] = useState("");

  // fetch list
  useEffect(() => {
    if (!ready) return;
    if (!user) { setLoading(false); return; }
    (async () => {
      try {
        const res = await API.get("/api/admin/mocktests/fetch", {
          params: { instituteId: user?.instituteId },
        });
        const items = Array.isArray(res.data) ? res.data : [];
        setMockTests(items);
        setFiltered(items);
      } catch (err) {
        console.error("Error fetching mocktests:", err);
        alert("❌ Failed to load mocktests");
      } finally {
        setLoading(false);
      }
    })();
  }, [ready, user]);

  // local filters
  useEffect(() => {
    let data = [...mockTests];
    if (statusFilter) data = data.filter((m) => m.status === statusFilter);
    if (search) data = data.filter((m) =>
      (m.title || "").toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(data);
  }, [statusFilter, search, mockTests]);

  // keep selectedMockId sensible when the filtered list changes
  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedMockId("");
    } else if (!selectedMockId || !filtered.find(m => m.mockTestId === selectedMockId)) {
      setSelectedMockId(filtered[0].mockTestId);
    }
  }, [filtered, selectedMockId]);

  const goToSettings = () => {
    if (!selectedMockId) {
      alert("Select a mock test first.");
      return;
    }
    // ⬇️ adjust this route if your router uses a different path
    navigate(`/admin/mocktests/editor/${selectedMockId}/settings`);

  };

  if (!ready || loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography mt={2}>
          {!ready ? "Preparing your session..." : "Loading mocktests..."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth={1100} mx="auto" mt={4}>
      {/* Header row with top-right actions */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Section-wise Breakdown
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          {/* Select which mock to open in Settings */}
          <TextField
            select
            size="small"
            sx={{ minWidth: 220 }}
            label="Select Mock"
            value={selectedMockId}
            onChange={(e) => setSelectedMockId(e.target.value)}
          >
            {filtered.map(m => (
              <MenuItem key={m.mockTestId} value={m.mockTestId}>
                {m.title}
              </MenuItem>
            ))}
          </TextField>

          {/* Settings button */}
          <Button variant="outlined" onClick={goToSettings} disabled={!selectedMockId}>
            Settings
          </Button>

          {/* Create New Mock Test button */}
          <Button variant="contained" onClick={() => navigate("/admin/mocktests/create")}>
            Create New Mock Test
          </Button>
        </Stack>
      </Stack>

      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, display:"flex", alignItems:"center", gap:1 }}>
            <span style={{
              width: 10, height: 10, borderRadius: 2, background: "#7c3aed", display: "inline-block"
            }} />
            All Mock Tests
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Search Title"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">Status</MenuItem>
              <MenuItem value="PUBLISHED">Published</MenuItem>
              <MenuItem value="DRAFT">Draft</MenuItem>
              <MenuItem value="UNPUBLISHED">Unpublished</MenuItem>
              <MenuItem value="DELETED">Deleted</MenuItem>
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      {/* grid */}
      {filtered.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" mt={5}>
          No mock tests found.
        </Typography>
      ) : (
        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={2} sx={{ rowGap: 2 }}>
          {filtered.map((m) => {
            const img = resolveImageUrl(m.imageUrl || "");
            const statusColor =
              m.status === "PUBLISHED" ? "success" :
              m.status === "DRAFT" ? "warning" : "default";
            return (
              <Card key={m.mockTestId} sx={{ width: { xs: "100%", sm: 360 }, borderRadius: 2 }}>
                <CardActionArea
                  onClick={() => navigate(`/admin/mocktests/editor/${m.mockTestId}/sections`)}
                >
                  {img ? (
                    <CardMedia component="img" height="180" image={img} alt={m.title}
                               sx={{ objectFit: "cover" }} />
                  ) : (
                    <Box sx={{
                      height: 180, bgcolor: "#f3f4f6", display:"flex",
                      alignItems:"center", justifyContent:"center", color:"text.secondary"
                    }}>
                      No cover image
                    </Box>
                  )}

                  <CardContent>
                    <Typography variant="h6" sx={{
                      fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis",
                      whiteSpace: "nowrap", mb: 1
                    }}>
                      {m.title}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip size="small" label={m.status}
                            color={statusColor}
                            variant={statusColor === "default" ? "outlined" : "filled"} />
                      <Chip size="small"
                            label={m.isFree ? "Free" : `₹${m.price}`}
                            color={m.isFree ? "default" : "primary"}
                            variant={m.isFree ? "outlined" : "filled"} />
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
