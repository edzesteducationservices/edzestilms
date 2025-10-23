
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../../LoginSystem/axios";

// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Card,
//   CardContent,
// } from "@mui/material";



// export default function AdminQBankUpload() {
//   const [name, setName] = useState("");
//   const [file, setFile] = useState(null);
//   const navigate = useNavigate();

//   const handleUpload = async () => {
//     if (!name || !file) {
//       alert("⚠️ Please provide Question Bank Name and select an Excel file");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("file", file);

//       await API.post("api/admin/qbank/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("✅ Uploaded successfully");
//       setName("");
//       setFile(null);
//     } catch (err) {
//       console.error("❌ Upload error:", err);
//       alert("Upload failed. Check console for details.");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #f5f7fa, #e4ecf5)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         p: 3,
//       }}
//     >
//       <Card
//         sx={{
//           maxWidth: 500,
//           width: "100%",
//           boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
//           borderRadius: 3,
//         }}
//       >
//         <CardContent sx={{ p: 4 }}>
//           <Typography
//             variant="h5"
//             gutterBottom
//             sx={{ fontWeight: "bold", textAlign: "center", color: "#2c3e50" }}
//           >
//             📤 Upload Question Bank
//           </Typography>

//           {/* Question Bank Name */}
//           <TextField
//             label="Question Bank Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             fullWidth
//             margin="normal"
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: 2,
//               },
//             }}
//           />

//           {/* Excel File Upload */}
//           <Box
//             sx={{
//               mt: 2,
//               p: 2,
//               border: "2px dashed #90caf9",
//               borderRadius: 2,
//               textAlign: "center",
//               backgroundColor: "#f9fcff",
//               cursor: "pointer",
//               "&:hover": { backgroundColor: "#f1f9ff" },
//             }}
//             onClick={() => document.getElementById("fileInput").click()}
//           >
//             <Typography variant="body2" sx={{ color: "#1976d2" }}>
//               {file
//                 ? `📄 ${file.name}`
//                 : "Click to select Excel file (.xlsx, .xls)"}
//             </Typography>
//             <input
//               id="fileInput"
//               type="file"
//               accept=".xlsx,.xls"
//               onChange={(e) => setFile(e.target.files[0])}
//               style={{ display: "none" }}
//             />
//           </Box>

//           {/* Buttons */}
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               mt: 3,
//             }}
//           >
//             <Button
//               variant="contained"
//               onClick={handleUpload}
//               sx={{
//                 background: "linear-gradient(45deg, #42a5f5, #478ed1)",
//                 textTransform: "none",
//                 fontWeight: "600",
//                 borderRadius: 2,
//                 px: 3,
//                 "&:hover": {
//                   background: "linear-gradient(45deg, #1e88e5, #1565c0)",
//                 },
//               }}
//             >
//               Upload Excel
//             </Button>

//             <Button
//               variant="outlined"
//               onClick={() => navigate("/admin/qbank/list")}
//               sx={{
//                 borderRadius: 2,
//                 textTransform: "none",
//                 fontWeight: "600",
//                 px: 3,
//               }}
//             >
//               View All
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../LoginSystem/axios";

import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Divider,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

export default function AdminQBankUpload() {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  // 🔧 for the Settings picker
  const [banks, setBanks] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState("");

  const navigate = useNavigate();
  const brand = "#4748ac";

  // Fetch banks for the Settings picker (doesn't affect upload flow)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/api/admin/qbank");
        setBanks(res.data || []);
      } catch (e) {
        console.error("Failed loading banks for settings picker:", e);
      }
    };
    load();
  }, []);

  const handleUpload = async () => {
    if (!name || !file) {
      alert("⚠️ Please provide Question Bank Name and select an Excel file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);

      await API.post("/api/admin/qbank/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Uploaded successfully");
      setName("");
      setFile(null);
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Upload failed. Check console for details.");
    }
  };

  const openSettings = (bankId) => {
    navigate(`/admin/qbank/${bankId}/qbsetting`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa, #e4ecf5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        position: "relative",
      }}
    >
      {/* ⚙️ Single Settings button — top-right */}
      <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}>
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
      </Box>

      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "center", color: "#2c3e50" }}
          >
            📤 Upload Question Bank
          </Typography>

          {/* Question Bank Name */}
          <TextField
            label="Question Bank Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          {/* Excel File Upload */}
          <Box
            sx={{
              mt: 2,
              p: 2,
              border: "2px dashed #90caf9",
              borderRadius: 2,
              textAlign: "center",
              backgroundColor: "#f9fcff",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f1f9ff" },
            }}
            onClick={() => document.getElementById("qbankFileInput").click()}
          >
            <Typography variant="body2" sx={{ color: "#1976d2" }}>
              {file ? `📄 ${file.name}` : "Click to select Excel file (.xlsx, .xls)"}
            </Typography>
            <input
              id="qbankFileInput"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ display: "none" }}
            />
          </Box>

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleUpload}
              sx={{
                background: "linear-gradient(45deg, #42a5f5, #478ed1)",
                textTransform: "none",
                fontWeight: "600",
                borderRadius: 2,
                px: 3,
                "&:hover": {
                  background: "linear-gradient(45deg, #1e88e5, #1565c0)",
                },
              }}
            >
              Upload Excel
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/admin/qbank/list")}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: "600", px: 3 }}
            >
              View All
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 🎛️ Settings picker dialog */}
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
          <Button onClick={() => setPickerOpen(false)} sx={{ textTransform: "none" }}>
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
              "&:hover": { background: `linear-gradient(135deg, #3e40a5, #2a2c86)` },
            }}
          >
            Open Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
