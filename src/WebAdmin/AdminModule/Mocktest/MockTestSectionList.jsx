// src/WebAdmin/MockTests/MockTestSectionList.jsx
import React from "react";
import {
  Box, Paper, Typography, IconButton, Stack, Tooltip
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Meta = ({ children }) => (
  <Box sx={{ color: "rgb(107,114,128)", fontSize: 14, display: "inline-flex", gap: 1 }}>
    {children}
  </Box>
);

function Row({
  index, name, questions = 0, marks = 0,
  onMoveUp, onMoveDown, onMore, onClick
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        px: 2, py: 1.25, borderRadius: 2,
        bgcolor: "rgba(248,250,252,0.75)", borderColor: "rgb(229,231,235)"
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <IconButton size="small" sx={{ color: "rgb(156,163,175)" }}>
          <ExpandMoreIcon fontSize="small" />
        </IconButton>

        <Box sx={{
          width: 28, height: 28, borderRadius: "999px",
          bgcolor: "white", border: "1px solid rgb(229,231,235)",
          display: "grid", placeItems: "center", color: "rgb(55,65,81)", fontWeight: 700
        }}>
          {index + 1}
        </Box>

        <Typography
          onClick={onClick}
          sx={{
            flex: 1, fontWeight: 700, color: "rgb(17,24,39)", cursor: "pointer",
            "&:hover": { textDecoration: "underline" }
          }}
        >
          {name || `Section ${index + 1}`}
        </Typography>

        <Meta>{questions} Questions • {marks} Marks </Meta>

        <Stack direction="row" spacing={0.25} sx={{ ml: 1 }}>
          <Tooltip title="Move up">
            <span>
              <IconButton size="small" onClick={onMoveUp} disabled={index === 0}>
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Move down">
            <span>
              <IconButton size="small" onClick={onMoveDown}>
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="More">
            <IconButton size="small" onClick={onMore}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}

/** sections: from header; fallbackCounts lets you show even if API only has totals */
export default function MockTestSectionList({
  sections = [],
  fallbackCounts = { perSectionQuestions: 0, perSectionMarks: 0 },
  onOpenSection,
  onReorder,
}) {
  const move = (from, to) => {
    if (to < 0 || to >= sections.length) return;
    onReorder && onReorder(from, to);
  };

  return (
    <Box>
      <Stack spacing={1.2}>
        {sections.map((s, i) => {
          const questions = Number(
            s?.questionCount ?? s?.questions ?? fallbackCounts.perSectionQuestions ?? 0
          );
          const marks = Number(s?.totalMarks ?? fallbackCounts.perSectionMarks ?? 0);
        

          return (
            <Row
              key={s.id || s.name || i}
              index={i}
              name={s.name || `Section ${i + 1}`}
              questions={questions}
              marks={marks}            
              onMoveUp={() => move(i, i - 1)}
              onMoveDown={() => move(i, i + 1)}
              onMore={() => {}}
              onClick={() => onOpenSection && onOpenSection(i)}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
