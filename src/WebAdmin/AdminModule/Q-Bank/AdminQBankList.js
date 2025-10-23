import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../LoginSystem/axios";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stack,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Divider,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function AdminQBankList() {
  const [banks, setBanks] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch all Question Banks
  useEffect(() => {
    async function fetchBanks() {
      try {
        const res = await API.get("/api/admin/qbank");
        setBanks(res.data);
      } catch (err) {
        console.error("❌ Error fetching QBank list:", err);
      }
    }
    fetchBanks();
  }, []);

  // ✅ Open Settings page for a bank
  const openSettings = (bankId) => {
    navigate(`/admin/qbank/${bankId}/qbsetting`);
  };

  // ✅ Delete a Question Bank
  const handleDelete = async (bankId) => {
    if (window.confirm("Are you sure you want to delete this Question Bank?")) {
      try {
        await API.delete(`/api/admin/qbank/${bankId}`);
        setBanks((prev) => prev.filter((bank) => bank.bankId !== bankId));
        alert("🗑️ Question Bank deleted successfully");
      } catch (err) {
        console.error("❌ Error deleting bank:", err);
        alert("Failed to delete Question Bank");
      }
    }
  };

  const brand = "#4748ac";

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa, #e4ecf5)",
        position: "relative",
      }}
    >
      {/* ⬅️ Back to Dashboard (top-left) */}
      <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 1 }}>
        <Tooltip title="Back to Dashboard" arrow>
          <Button
            onClick={() => navigate("/admin/dashboard")} // <-- change path if your dashboard route differs
            startIcon={<ArrowBackIosNewIcon />}
            variant="outlined"
            sx={{
              px: 2,
              py: 0.9,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 700,
              letterSpacing: 0.2,
              borderColor: brand,
              color: brand,
              background: "rgba(71,72,172,0.06)",
              "&:hover": {
                background: "rgba(71,72,172,0.12)",
                borderColor: "#3e40a5",
                color: "#2a2c86",
              },
            }}
          >
            Back
          </Button>
        </Tooltip>
      </Box>

      {/* ⚙️ Single, styled Settings button — top-right */}
      {/* <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}>
        <Tooltip title="Open Question Bank Settings" arrow>
          <Button
            onClick={() => setPickerOpen(true)}
            startIcon={<SettingsIcon />}
            variant="contained"
            sx={{
              px: 2.25,
              py: 1,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 700,
              letterSpacing: 0.2,
              boxShadow:
                "0 6px 18px rgba(71,72,172,0.35), inset 0 0 0 1px rgba(255,255,255,0.15)",
              background: `linear-gradient(135deg, ${brand} 0%, #2f3192 100%)`,
              "&:hover": {
                transform: "translateY(-1px)",
                background: `linear-gradient(135deg, #3e40a5 0%, #2a2c86 100%)`,
                boxShadow:
                  "0 10px 24px rgba(71,72,172,0.45), inset 0 0 0 1px rgba(255,255,255,0.2)",
              },
              "&:active": { transform: "translateY(0)" },
            }}
          >
            Settings
          </Button>
        </Tooltip>
      </Box> */}

      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          mb: 4,
          color: "#2c3e50",
        }}
      >
        📚 All Question Banks
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {banks.map((bank) => (
          <Grid item xs={12} sm={6} md={4} key={bank.bankId}>
            <Card
              sx={{
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                borderRadius: 3,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 6px 30px rgba(0,0,0,0.15)",
                },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px solid rgba(71,72,172,0.08)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "700", color: "#34495e", mb: 1 }}
                >
                  {bank.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Created:{" "}
                  {bank.createdAt
                    ? new Date(bank.createdAt).toLocaleDateString()
                    : "N/A"}
                </Typography>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                >
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        mt: 1,
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        backgroundColor: "#4748ac",
                        boxShadow: "0 6px 14px rgba(71,72,172,0.35)",
                        "&:hover": {
                          backgroundColor: "#3e40a5", // a touch darker on hover
                          boxShadow: "0 8px 18px rgba(71,72,172,0.45)",
                        },
                        "&:active": { backgroundColor: "#35379a" },
                      }}
                      onClick={() =>
                        navigate(`/admin/qbank/edit/${bank.bankId}`)
                      }
                    >
                      ✏️ Edit
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{
                        mt: 1,
                        borderRadius: 2,
                        fontWeight: "600",
                        textTransform: "none",
                        "&:hover": {
                          background: "#4748ac",
                          borderColor: "#c62828",
                          color: "#c62828",
                        },
                      }}
                      onClick={() => handleDelete(bank.bankId)}
                    >
                      🗑️ Delete
                    </Button>
                  </Stack>

                  {bank?.status === "PUBLISHED" ? (
                    <Chip
                      size="small"
                      color="success"
                      label="Published"
                      sx={{ fontWeight: 600 }}
                    />
                  ) : (
                    <Chip
                      size="small"
                      variant="outlined"
                      label="Unpublished"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🎛️ Picker dialog */}
      <Dialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: "#1f2937",
            py: 2.25,
            background:
              "linear-gradient(180deg, rgba(71,72,172,0.06), rgba(71,72,172,0))",
          }}
        >
          Select Question Bank
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            select
            label="Question Bank"
            margin="normal"
            value={selectedBankId}
            onChange={(e) => setSelectedBankId(e.target.value)}
            InputLabelProps={{ sx: { fontWeight: 600 } }}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
              "& .MuiSelect-select": { py: 1.2 },
            }}
          >
            {banks.map((b) => (
              <MenuItem key={b.bankId} value={b.bankId}>
                {b.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setPickerOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!selectedBankId}
            onClick={() => {
              setPickerOpen(false);
              openSettings(selectedBankId);
            }}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              background: `linear-gradient(135deg, ${brand}, #2f3192)`,
              boxShadow: "0 8px 18px rgba(71,72,172,0.35)",
              "&:hover": {
                background: `linear-gradient(135deg, #3e40a5, #2a2c86)`,
              },
            }}
          >
            Open Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
