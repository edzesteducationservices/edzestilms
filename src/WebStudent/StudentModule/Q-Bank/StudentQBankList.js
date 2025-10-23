

// import React, { useEffect, useState } from "react";
// import { useAuth } from "../../../LoginSystem/context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import API from "../../../LoginSystem/axios";

// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Grid,
//   CardActionArea,
// } from "@mui/material";

// export default function StudentQBankList() {
//   const [banks, setBanks] = useState([]);
//   const [attempts, setAttempts] = useState({});
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchBanks();
//   }, []);

//   useEffect(() => {
//     if (user) fetchAttempts();
//   }, [user]);

//   const fetchBanks = async () => {
//     try {
//       const res = await API.get("/api/admin/qbank");
//       setBanks(res.data || []);
//     } catch (err) {
//       console.error("❌ Error fetching banks:", err);
//     }
//   };

//   const fetchAttempts = async () => {
//     try {
//       const studentId = user?.sub || user?.id || user?.userId;
//       if (!studentId) return;
//       const res = await API.get(
//         `/api/student/qbank/student/attempts/${studentId}`
//       );
//       setAttempts(res.data?.attempts || {});
//     } catch (err) {
//       console.error("❌ Error fetching attempts:", err);
//     }
//   };

//   // ✅ match App.js route: /student/qbank/details/:bankId
//   const goDetails = (bankId) => navigate(`/student/qbank/details/${bankId}`);

//   // ✅ go to Filter page
//   const goFilter = (bank) => {
//     const bankId = bank.bankId || bank._id || bank.id;
//     navigate(`/student/qbank/filter?bankId=${encodeURIComponent(bankId)}`, {
//       state: { bankId, bankName: bank.name },
//     });
//   };

//   // ✅ Only show published banks to students (no API change; render-time filter)
//   const visibleBanks = (banks || []).filter((b) => b?.status === "PUBLISHED");

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" gutterBottom>
//         📚 Available Question Banks
//       </Typography>

//       <Grid container spacing={2}>
//         {visibleBanks.map((bank) => {
//           const bankId = bank.bankId || bank._id || bank.id;
//           const prev =
//             attempts[bankId] || attempts[bank.bankId] || attempts[bank._id];

//           const lastAttemptTime = prev?.startTime
//             ? new Date(prev.startTime).toLocaleString("en-IN")
//             : "—";

//           return (
//             <Grid item xs={12} sm={6} md={4} key={bankId}>
//               <Card sx={{ p: 1, boxShadow: 3 }}>
//                 {/* Whole card clickable → details page */}
//                 <CardActionArea onClick={() => goDetails(bankId)}>
//                   <CardContent>
//                     <Typography variant="h6" sx={{ mb: 0.5 }}>
//                       {bank.name}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Last used: {lastAttemptTime}
//                     </Typography>
//                   </CardContent>
//                 </CardActionArea>

//                 {/* Start button → Filter page */}
//                 <Box sx={{ px: 2, pb: 2, pt: 0.5 }}>
//                   <Button
//                     fullWidth
//                     variant="contained"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       goFilter(bank);
//                     }}
//                     sx={{ background: "#4748ac" }}
//                   >
//                     Start
//                   </Button>
//                 </Box>
//               </Card>
//             </Grid>
//           );
//         })}
//       </Grid>
//     </Box>
//   );
// }


// src/components/student/StudentQBankList.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../LoginSystem/context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../../LoginSystem/axios";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CardActionArea,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function StudentQBankList() {
  const [banks, setBanks] = useState([]);
  const [attempts, setAttempts] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchBanks();
  }, []);

  useEffect(() => {
    if (user) fetchAttempts();
  }, [user]);

  const fetchBanks = async () => {
    try {
      const res = await API.get("/api/admin/qbank");
      setBanks(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching banks:", err);
    }
  };

  const fetchAttempts = async () => {
    try {
      const studentId = user?.sub || user?.id || user?.userId;
      if (!studentId) return;
      const res = await API.get(
        `/api/student/qbank/student/attempts/${studentId}`
      );
      setAttempts(res.data?.attempts || {});
    } catch (err) {
      console.error("❌ Error fetching attempts:", err);
    }
  };

  // ✅ match App.js route: /student/qbank/details/:bankId
  const goDetails = (bankId) => navigate(`/student/qbank/details/${bankId}`);

  // ✅ go to Filter page
  const goFilter = (bank) => {
    const bankId = bank.bankId || bank._id || bank.id;
    navigate(`/student/qbank/filter?bankId=${encodeURIComponent(bankId)}`, {
      state: { bankId, bankName: bank.name },
    });
  };

  // ✅ Only show published banks to students (no API change; render-time filter)
  const visibleBanks = (banks || []).filter((b) => b?.status === "PUBLISHED");

  return (
    <Box sx={{ p: 3 }}>
      {/* Back to student dashboard */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIosNewIcon />}
          onClick={() => navigate("/student/dashboard")} // ← if your dashboard route is "/student", change here
          sx={{ color: "#4748ac", textTransform: "none", fontWeight: 600, px: 0 }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        📚 Available Question Banks
      </Typography>

      <Grid container spacing={2}>
        {visibleBanks.map((bank) => {
          const bankId = bank.bankId || bank._id || bank.id;
          const prev =
            attempts[bankId] || attempts[bank.bankId] || attempts[bank._id];

          const lastAttemptTime = prev?.startTime
            ? new Date(prev.startTime).toLocaleString("en-IN")
            : "—";

          return (
            <Grid item xs={12} sm={6} md={4} key={bankId}>
              <Card sx={{ p: 1, boxShadow: 3 }}>
                {/* Whole card clickable → details page */}
                <CardActionArea onClick={() => goDetails(bankId)}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      {bank.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last used: {lastAttemptTime}
                    </Typography>
                  </CardContent>
                </CardActionArea>

                {/* Start button → Filter page */}
                <Box sx={{ px: 2, pb: 2, pt: 0.5 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      goFilter(bank);
                    }}
                    sx={{ background: "#4748ac" }}
                  >
                    Start
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
