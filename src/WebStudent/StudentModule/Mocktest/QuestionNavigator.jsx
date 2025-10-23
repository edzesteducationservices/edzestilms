// // src/Student/widgets/QuestionNavigatorModal.jsx
// import * as React from "react";
// import {
//   Box,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Typography,
//   Chip,
// } from "@mui/material";
// import FlagIcon from "@mui/icons-material/Flag";
// import StickyNote2Icon from "@mui/icons-material/StickyNote2";


// export default function QuestionNavigator({
//   open,
//   onClose,
//   current,
//   onJump,
//   items = [],
// }) {
//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 1,
//           // allow manual resize like Pearson’s resizable window
//           resize: "both",
//           overflow: "auto",
//         },
//       }}
//     >
//       {/* Blue title bar */}
//       <DialogTitle
//         sx={{
//           bgcolor: "#1e5ea8",           // Pearson-ish blue
//           color: "#fff",
//           py: 1,
//           fontSize: 16,
//           fontWeight: 600,
//         }}
//       >
//         Navigator – select a question to go to it
//       </DialogTitle>

//       <DialogContent sx={{ p: 0 }}>
//         <TableContainer sx={{ maxHeight: 420 }}>
//           <Table stickyHeader size="small" aria-label="navigator table">
//             <TableHead>
//               <TableRow sx={{ "& th": { bgcolor: "#e3f2fd", fontWeight: 700 } }}>
//                 <TableCell width={160}>Question #</TableCell>
//                 <TableCell width={140}>Status</TableCell>
//                 <TableCell width={170}>Marked for Review</TableCell>
//                 <TableCell>Notes</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {items.map((row) => {
//                 const isCurrent = row.index === current;

//                 return (
//                   <TableRow
//                     key={row.index}
//                     hover
//                     onClick={() => onJump(row.index)}
//                     sx={{
//                       cursor: "pointer",
//                       // Yellow highlight for current row
//                       bgcolor: isCurrent ? "#fff9c4" : "inherit",
//                       "&:hover": {
//                         bgcolor: isCurrent ? "#fff59d" : "action.hover",
//                       },
//                     }}
//                   >
//                     <TableCell>
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <Chip
//                           size="small"
//                           label={row.index + 1}
//                           sx={{
//                             minWidth: 38,
//                             fontWeight: 600,
//                             bgcolor: isCurrent ? "#1e88e5" : "#e0e0e0",
//                             color: isCurrent ? "#fff" : "text.primary",
//                           }}
//                         />
//                         <Typography variant="body2" noWrap title={row.title || ""}>
//                           {row.title || `Question ${row.index + 1}`}
//                         </Typography>
//                       </Box>
//                     </TableCell>

//                     <TableCell>
//                       {row.status === "Incomplete" ? (
//                         <Typography variant="body2" sx={{ color: "#d32f2f", fontWeight: 600 }}>
//                           Incomplete
//                         </Typography>
//                       ) : row.status === "Answered" ? (
//                         <Typography variant="body2" sx={{ color: "success.main", fontWeight: 600 }}>
//                           Answered
//                         </Typography>
//                       ) : (
//                         <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                           Unseen
//                         </Typography>
//                       )}
//                     </TableCell>

//                     <TableCell>
//                       {row.marked ? (
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                           <FlagIcon fontSize="small" color="warning" />
//                           <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                             Marked
//                           </Typography>
//                         </Box>
//                       ) : (
//                         <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                           —
//                         </Typography>
//                       )}
//                     </TableCell>

//                     <TableCell>
//                       {row.notes ? (
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 80 }}>
//                           <StickyNote2Icon fontSize="small" />
//                           <Typography
//                             variant="body2"
//                             noWrap
//                             title={row.notes}
//                             sx={{ maxWidth: 360 }}
//                           >
//                             {row.notes}
//                           </Typography>
//                         </Box>
//                       ) : (
//                         <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                           —
//                         </Typography>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </DialogContent>

//       <DialogActions sx={{ px: 2, py: 1.5 }}>
//         <Box sx={{ flex: 1 }} />
//         <Button variant="outlined" onClick={onClose}>
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }



import * as React from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography,
  Chip,
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";

export default function QuestionNavigator({
  open,
  onClose,
  current,
  onJump,
  items = [],
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          resize: "both",
          overflow: "auto",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#1e5ea8",
          color: "#fff",
          py: 1,
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        Navigator – select a question to go to it
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <TableContainer sx={{ maxHeight: 420 }}>
          <Table stickyHeader size="small" aria-label="navigator table">
            <TableHead>
              <TableRow sx={{ "& th": { bgcolor: "#e3f2fd", fontWeight: 700 } }}>
                <TableCell width={160}>Question #</TableCell>
                <TableCell width={140}>Status</TableCell>
                <TableCell width={170}>Marked for Review</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((row) => {
                const isCurrent = row.index === current;

                return (
                  <TableRow
                    key={row.index}
                    hover
                    onClick={() => onJump(row.index)}
                    sx={{
                      cursor: "pointer",
                      bgcolor: isCurrent ? "#fff9c4" : "inherit",
                      "&:hover": { bgcolor: isCurrent ? "#fff59d" : "action.hover" },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                          size="small"
                          label={row.index + 1}
                          sx={{
                            minWidth: 38,
                            fontWeight: 600,
                            bgcolor: isCurrent ? "#1e88e5" : "#e0e0e0",
                            color: isCurrent ? "#fff" : "text.primary",
                          }}
                        />
                        <Typography variant="body2" noWrap title={row.title || ""}>
                          {row.title || `Question ${row.index + 1}`}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {row.status === "Answered" ? (
                        <Typography variant="body2" sx={{ color: "success.main", fontWeight: 600 }}>
                          Answered
                        </Typography>
                      ) : row.status === "Incomplete" ? (
                        <Typography variant="body2" sx={{ color: "#d32f2f", fontWeight: 600 }}>
                          Incomplete
                        </Typography>
                      ) : (
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Unseen
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      {row.marked ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <FlagIcon fontSize="small" color="warning" />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Marked
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          —
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      {row.notes ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 80 }}>
                          <StickyNote2Icon fontSize="small" />
                          <Typography
                            variant="body2"
                            noWrap
                            title={row.notes}
                            sx={{ maxWidth: 360 }}
                          >
                            {row.notes}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Box sx={{ flex: 1 }} />
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
