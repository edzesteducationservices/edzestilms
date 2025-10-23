// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   List,
//   ListSubheader,
//   ListItemButton,
//   Typography,
//   Tooltip,
//   Button,
//   Card,
//   CardHeader,
//   CardContent,
// } from "@mui/material";
// import {
//   FaPlayCircle,
//   FaHeadphones,
//   FaFileAlt,
//   FaQuestionCircle,
//   FaBroadcastTower,
// } from "react-icons/fa";

// /* === Udemy-like circular progress (UI only) === */
// function UdemyProgress({ percent = 0, size = 72, strokeWidth = 8 }) {
//   const pct = Math.max(0, Math.min(100, Number(percent) || 0));
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const dashOffset = circumference * (1 - pct / 100);

//   return (
//     <div className="mb-3">
//       <div
//         className="d-flex justify-content-between align-items-center"
//         style={{ fontSize: 13 }}
//       >
//         <span className="text-muted">Your progress</span>
//         <span className="fw-semibold">{pct}% complete</span>
//       </div>

//       <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
//         <svg width={size} height={size} role="img" aria-label={`Course progress ${pct}%`}>
//           {/* Track */}
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             fill="none"
//             stroke="#d1d7dc"
//             strokeWidth={strokeWidth}
//           />
//           {/* Progress */}
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             fill="none"
//             stroke="#a435f0"
//             strokeWidth={strokeWidth}
//             strokeDasharray={circumference}
//             strokeDashoffset={dashOffset}
//             strokeLinecap="round"
//             transform={`rotate(-90 ${size / 2} ${size / 2})`}
//             style={{ transition: "stroke-dashoffset .35s ease" }}
//           />
//           {/* Center label (optional) */}
//           <text
//             x="50%"
//             y="50%"
//             dominantBaseline="middle"
//             textAnchor="middle"
//             style={{ fontSize: size * 0.28, fontWeight: 700, fill: "#111827" }}
//           >
//             {pct}%
//           </text>
//         </svg>
//       </div>
//     </div>
//   );
// }

// /* Icons per lesson type */
// const TYPE_ICON = {
//   video: <FaPlayCircle size={16} color="#6366f1" />,
//   audio: <FaHeadphones size={16} color="#10b981" />,
//   article: <FaFileAlt size={16} color="#64748b" />,
//   quiz: <FaQuestionCircle size={16} color="#eab308" />,
//   live: <FaBroadcastTower size={16} color="#ef4444" />,
// };
// const iconFor = (t) =>
//   TYPE_ICON[String(t || "").toLowerCase()] || <FaFileAlt size={16} color="#64748b" />;

// /* Duration helpers */
// const secsOf = (lesson) => {
//   const cands = [
//     lesson?.duration,
//     lesson?.durationSeconds,
//     lesson?.durationMs,
//     lesson?.videoDuration,
//     lesson?.lengthSeconds,
//     lesson?.durationStr,
//     lesson?.isoDuration,
//     lesson?.metrics?.duration,
//     lesson?.meta?.duration,
//     lesson?.meta?.durationSeconds,
//     lesson?.meta?.durationStr,
//     lesson?.video?.duration,
//     lesson?.video?.durationSeconds,
//     lesson?.video?.durationMs,
//     lesson?.content?.duration,
//     lesson?.vp?.duration,
//   ];
//   for (const c of cands) {
//     const n = Number(c);
//     if (Number.isFinite(n) && n > 0) return Math.round(n > 10000 ? n / 1000 : n);
//     if (typeof c === "string") {
//       const s = c.trim();
//       const t = s.match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/);
//       if (t) {
//         const a = parseInt(t[1] || "0", 10);
//         const b = parseInt(t[2] || "0", 10);
//         const d = parseInt(t[3] || "0", 10);
//         return t[3] ? a * 3600 + b * 60 + d : a * 60 + b;
//       }
//       const m = /^P(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)$/i.exec(s);
//       if (m) {
//         const h = parseInt(m[2] || "0", 10);
//         const mm = parseInt(m[3] || "0", 10);
//         const ss = parseInt(m[4] || "0", 10);
//         const total = h * 3600 + mm * 60 + ss;
//         if (total > 0) return total;
//       }
//       if (/^\d+(\.\d+)?$/.test(s)) {
//         const num = parseFloat(s);
//         if (num > 0) return Math.round(num > 10000 ? num / 1000 : num);
//       }
//     }
//   }
//   return null;
// };
// const fmt = (secs) => {
//   if (secs == null) return null;
//   const s = Math.max(0, Math.floor(secs));
//   const m = Math.floor(s / 60);
//   const r = s % 60;
//   return `${m}m ${r}s`;
// };

// export default function SyllabusSidebar({
//   course,
//   currentLessonId,
//   onOpenChange,
//   progressPercent = 0,
//   renderMobile = false, // NEW (for Drawer)
// }) {
//   const [hoveredLesson, setHoveredLesson] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const navigate = useNavigate();

//   // responsive watcher
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const mq = window.matchMedia("(max-width: 991.98px)");
//     const apply = () => setIsMobile(mq.matches);
//     apply();
//     mq.addEventListener?.("change", apply);
//     return () => mq.removeEventListener?.("change", apply);
//   }, []);

//   // notify parent so it can resize the grid (desktop only)
//   useEffect(() => {
//     if (typeof onOpenChange === "function") onOpenChange(!isMobile && sidebarOpen);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [sidebarOpen, isMobile]);

//   if (!course) return null;

//   const ContentList = (
//     <List dense disablePadding>
//       {course.sections.map((section) => (
//         <Box component="div" key={section._id}>
//           <ListSubheader
//             disableSticky
//             sx={{
//               bgcolor: "transparent",
//               px: 1.5,
//               py: 1.1,
//               lineHeight: 1.15,
//               color: "#334155",
//               fontSize: 13.5,
//               fontWeight: 900,
//               textTransform: "uppercase",
//               letterSpacing: ".08em",
//             }}
//           >
//             {section.title}
//           </ListSubheader>

//           {section.lessons.map((lesson) => {
//             const isActive = String(lesson._id) === String(currentLessonId);
//             const duration = secsOf(lesson);

//             return (
//               <Box key={lesson._id} sx={{ position: "relative" }}>
//                 <ListItemButton
//                   selected={isActive}
//                   onMouseEnter={() => setHoveredLesson(lesson._id)}
//                   onMouseLeave={() => setHoveredLesson(null)}
//                   onClick={() =>
//                     navigate(`/learn/${course.slug}/${section._id}/${lesson._id}`)
//                   }
//                   sx={{
//                     py: 1.15,
//                     px: 1.5,
//                     borderBottom: "1px solid #eef2f7",
//                     alignItems: "center",
//                     transition:
//                       "background-color .15s ease, padding-left .15s ease, border-left .15s ease",
//                     "&.Mui-selected": {
//                       bgcolor: "#eef2ff",
//                       borderLeft: "4px solid #6d28d9",
//                       pl: "12px",
//                     },
//                     "&:hover": { bgcolor: "#f8fafc" },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       width: "100%",
//                     }}
//                   >
//                     {/* LEFT: icon + title */}
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
//                       <Box sx={{ lineHeight: 0, flexShrink: 0 }}>{iconFor(lesson.type)}</Box>
//                       <Typography
//                         noWrap
//                         title={lesson.title}
//                         sx={{
//                           fontSize: 15,
//                           fontWeight: isActive ? 800 : 650,
//                           color: isActive ? "#1f2937" : "#0f172a",
//                           lineHeight: 1.35,
//                           minWidth: 0,
//                         }}
//                       >
//                         {lesson.title}
//                       </Typography>
//                     </Box>

//                     {/* RIGHT: duration */}
//                     {duration != null && (
//                       <Typography component="span" sx={{ fontSize: 12.5, color: "#475569" }}>
//                         {fmt(duration)}
//                       </Typography>
//                     )}
//                   </Box>
//                 </ListItemButton>

//                 {/* Hover video preview (unchanged) */}
//                 {hoveredLesson === lesson._id && lesson.previewUrl && (
//                   <Tooltip
//                     open
//                     title=""
//                     arrow
//                     componentsProps={{
//                       tooltip: { sx: { bgcolor: "transparent", p: 0 } },
//                       arrow: { sx: { display: "none" } },
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         position: "absolute",
//                         left: "100%",
//                         top: 0,
//                         ml: 1,
//                         width: 260,
//                         borderRadius: 1.25,
//                         overflow: "hidden",
//                         boxShadow: "0 14px 28px rgba(2,6,23,.25)",
//                         bgcolor: "#0b1020",
//                         zIndex: 10,
//                       }}
//                     >
//                       <Box
//                         component="video"
//                         src={lesson.previewUrl}
//                         controls
//                         muted
//                         autoPlay
//                         loop
//                         sx={{
//                           width: "100%",
//                           height: 150,
//                           display: "block",
//                           objectFit: "cover",
//                           background: "#000",
//                         }}
//                       />
//                       <Box sx={{ p: 1.1, borderTop: "1px solid rgba(255,255,255,.08)" }}>
//                         <Typography
//                           sx={{
//                             fontSize: 12.5,
//                             fontWeight: 800,
//                             color: "#f1f5f9",
//                             whiteSpace: "nowrap",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                           }}
//                           title={lesson.title}
//                         >
//                           {lesson.title}
//                         </Typography>
//                         {duration != null && (
//                           <Typography sx={{ fontSize: 11, color: "#cbd5e1", mt: 0.25 }}>
//                             {fmt(duration)}
//                           </Typography>
//                         )}
//                       </Box>
//                     </Box>
//                   </Tooltip>
//                 )}
//               </Box>
//             );
//           })}
//         </Box>
//       ))}
//     </List>
//   );

//   return (
//     <>
//       {/* Desktop card */}
//       {!isMobile && (
//         <Card>
//           <CardHeader
//             title={<strong>Course content</strong>}
//             action={
//               <Button
//                 size="small"
//                 variant="outlined"
//                 onClick={() => setSidebarOpen((v) => !v)}
//                 title={sidebarOpen ? "Collapse" : "Expand"}
//               >
//                 {sidebarOpen ? "◂" : "▸"}
//               </Button>
//             }
//           />
//           {sidebarOpen && (
//             <CardContent sx={{ pt: 0 }}>
//               {/* progress UI at the top (desktop) */}
//               <UdemyProgress percent={progressPercent || 0} />
//               {ContentList}
//             </CardContent>
//           )}

//           {!sidebarOpen && (
//             <button
//               className="btn btn-light border position-fixed end-0 top-50 translate-middle-y d-none d-lg-inline-flex"
//               style={{ zIndex: 1030, borderRadius: "8px 0 0 8px" }}
//               onClick={() => setSidebarOpen(true)}
//               title="Show course content"
//             >
//               ◂
//             </button>
//           )}
//         </Card>
//       )}

//       {/* Mobile rendering when used inside Drawer */}
//       {renderMobile && isMobile && <div className="p-2">{ContentList}</div>}
//     </>
//   );
// }



// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   List,
//   ListSubheader,
//   ListItemButton,
//   Typography,
//   Tooltip,
//   Button,
//   Card,
//   CardHeader,
//   CardContent,
// } from "@mui/material";
// import {
//   FaPlayCircle,
//   FaHeadphones,
//   FaFileAlt,
//   FaQuestionCircle,
//   FaBroadcastTower,
// } from "react-icons/fa";

// /* === Udemy-like circular progress (UI only) === */
// function UdemyProgress({ percent = 0, size = 72, strokeWidth = 8 }) {
//   const pct = Math.max(0, Math.min(100, Number(percent) || 0));
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const dashOffset = circumference * (1 - pct / 100);

//   return (
//     <div className="mb-3">
//       <div className="d-flex justify-content-between align-items-center" style={{ fontSize: 13, gap: "5px" }}>
//         <span className="text-muted">Your progress</span>
//         <span className="fw-semibold">{pct}% complete</span>
//       </div>

//       <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
//         <svg width={size} height={size} role="img" aria-label={`Course progress ${pct}%`}>
//           <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#d1d7dc" strokeWidth={strokeWidth} />
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             fill="none"
//             stroke="#a435f0"
//             strokeWidth={strokeWidth}
//             strokeDasharray={circumference}
//             strokeDashoffset={dashOffset}
//             strokeLinecap="round"
//             transform={`rotate(-90 ${size / 2} ${size / 2})`}
//             style={{ transition: "stroke-dashoffset .35s ease" }}
//           />
//           <text
//             x="50%"
//             y="50%"
//             dominantBaseline="middle"
//             textAnchor="middle"
//             style={{ fontSize: size * 0.28, fontWeight: 700, fill: "#111827" }}
//           >
//             {pct}%
//           </text>
//         </svg>
//       </div>
//     </div>
//   );
// }

// const TYPE_ICON = {
//   video: <FaPlayCircle size={16} color="#6366f1" />,
//   audio: <FaHeadphones size={16} color="#10b981" />,
//   article: <FaFileAlt size={16} color="#64748b" />,
//   quiz: <FaQuestionCircle size={16} color="#eab308" />,
//   live: <FaBroadcastTower size={16} color="#ef4444" />,
// };
// const iconFor = (t) => TYPE_ICON[String(t || "").toLowerCase()] || <FaFileAlt size={16} color="#64748b" />;

// /* Duration helpers (unchanged) */
// const secsOf = (lesson) => {
//   const cands = [
//     lesson?.duration,
//     lesson?.durationSeconds,
//     lesson?.durationMs,
//     lesson?.videoDuration,
//     lesson?.lengthSeconds,
//     lesson?.durationStr,
//     lesson?.isoDuration,
//     lesson?.metrics?.duration,
//     lesson?.meta?.duration,
//     lesson?.meta?.durationSeconds,
//     lesson?.meta?.durationStr,
//     lesson?.video?.duration,
//     lesson?.video?.durationSeconds,
//     lesson?.video?.durationMs,
//     lesson?.content?.duration,
//     lesson?.vp?.duration,
//   ];
//   for (const c of cands) {
//     const n = Number(c);
//     if (Number.isFinite(n) && n > 0) return Math.round(n > 10000 ? n / 1000 : n);
//     if (typeof c === "string") {
//       const s = c.trim();
//       const t = s.match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/);
//       if (t) {
//         const a = parseInt(t[1] || "0", 10);
//         const b = parseInt(t[2] || "0", 10);
//         const d = parseInt(t[3] || "0", 10);
//         return t[3] ? a * 3600 + b * 60 + d : a * 60 + b;
//       }
//       const m = /^P(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)$/i.exec(s);
//       if (m) {
//         const h = parseInt(m[2] || "0", 10);
//         const mm = parseInt(m[3] || "0", 10);
//         const ss = parseInt(m[4] || "0", 10);
//         const total = h * 3600 + mm * 60 + ss;
//         if (total > 0) return total;
//       }
//       if (/^\d+(\.\d+)?$/.test(s)) {
//         const num = parseFloat(s);
//         if (num > 0) return Math.round(num > 10000 ? num / 1000 : num);
//       }
//     }
//   }
//   return null;
// };
// const fmt = (secs) => {
//   if (secs == null) return null;
//   const s = Math.max(0, Math.floor(secs));
//   const m = Math.floor(s / 60);
//   const r = s % 60;
//   return `${m}m ${r}s`;
// };

// export default function SyllabusSidebar({
//   course,
//   currentLessonId,
//   onOpenChange,
//   progressPercent = 0,
//   renderMobile = false, // when true, we’re inside the Drawer on phones
//   completedLessonIds = [], // NEW: presentational only
// }) {
//   const [hoveredLesson, setHoveredLesson] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const navigate = useNavigate();
  
// const activeItemRef = useRef(null);

// useEffect(() => {
//   // Center the active lesson whenever it changes
//   activeItemRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
// }, [currentLessonId]);

//   // responsive watcher (matches the page breakpoint)
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const mq = window.matchMedia("(max-width: 991.98px)");
//     const apply = () => setIsMobile(mq.matches);
//     apply();
//     mq.addEventListener?.("change", apply);
//     return () => mq.removeEventListener?.("change", apply);
//   }, []);

//   // Notify parent only for DESKTOP usage (prevents Drawer auto-close on mobile)
//   useEffect(() => {
//     if (typeof onOpenChange === "function" && !renderMobile) {
//       onOpenChange(!isMobile && sidebarOpen);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [sidebarOpen, isMobile, renderMobile]);

//   if (!course) return null;

//   // quick lookup for completion
//   const completedSet = new Set((completedLessonIds || []).map(String));

//   const completionDot = (done) => (
//     <span
//       aria-hidden
//       style={{
//         width: 15,
//         height: 15,
//         borderRadius: "50%",
//         marginLeft: 10,
//         flexShrink: 0,
//         background: done ? "#47ac58ff" : "transparent",
//         border: done ? "none" : "1.5px solid #cbd5e1",
//         display: "inline-block",
//       }}
//     />
//   );

//   const ContentList = (
//     <List dense disablePadding>
//       {course.sections.map((section) => (
//         <Box component="div" key={section._id}>
//           <ListSubheader
//             disableSticky
//             sx={{
//               bgcolor: "transparent",
//               px: 1.5,
//               py: 1.1,
//               lineHeight: 1.15,
//               color: "#334155",
//               fontSize: 13.5,
//               fontWeight: 900,
//               textTransform: "uppercase",
//               letterSpacing: ".08em",
//             }}
//           >
//             {section.title}
//           </ListSubheader>

//           {section.lessons.map((lesson) => {
//             const isActive = String(lesson._id) === String(currentLessonId);
//             const duration = secsOf(lesson);
//             const isDone = completedSet.has(String(lesson._id));

//             return (
//               <Box key={lesson._id} sx={{ position: "relative" }}>
//                 <ListItemButton
//                 ref={isActive ? activeItemRef : null}
//                   selected={isActive}
//                   onMouseEnter={() => setHoveredLesson(lesson._id)}
//                   onMouseLeave={() => setHoveredLesson(null)}
//                   onClick={() =>
//                     navigate(`/learn/${course.slug}/${section._id}/${lesson._id}`)
//                   }
//                   sx={{
//                     py: 1.15,
//                     px: 1.5,
//                     borderBottom: "1px solid #eef2f7",
//                     alignItems: "center",
//                     transition:
//                       "background-color .15s ease, padding-left .15s ease, border-left .15s ease",
//                     "&.Mui-selected": {
//                       bgcolor: "#eef2ff",
//                       borderLeft: "4px solid #6d28d9",
//                       pl: "12px",
//                     },
//                     "&:hover": { bgcolor: "#f8fafc" },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       width: "100%",
//                       gap: 1,
//                     }}
//                   >
//                     {/* LEFT: icon + title */}
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, minHeight:50 }}>
//                       <Box sx={{ lineHeight: 0, flexShrink: 0 }}>{iconFor(lesson.type)}</Box>
//                       <Typography
//                         noWrap
//                         title={lesson.title}
//                         sx={{
//                           fontSize: 16,
//                           fontWeight: isActive ? 800 : 650,
//                           color: isActive ? "#1f2937" : "#0f172a",
//                           lineHeight: 1.35,
//                           minWidth: 0,
//                         }}
//                       >
//                         {lesson.title}
//                       </Typography>
//                     </Box>

//                     {/* RIGHT: duration + completion dot */}
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                       {duration != null && (
//                         <Typography component="span" sx={{ fontSize: 12.5, color: "#475569" }}>
//                           {fmt(duration)}
//                         </Typography>
//                       )}
//                       {completionDot(isDone)}
//                     </Box>
//                   </Box>
//                 </ListItemButton>

//                 {/* Hover video preview (unchanged) */}
//                 {hoveredLesson === lesson._id && lesson.previewUrl && (
//                   <Tooltip
//                     open
//                     title=""
//                     arrow
//                     componentsProps={{
//                       tooltip: { sx: { bgcolor: "transparent", p: 0 } },
//                       arrow: { sx: { display: "none" } },
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         position: "absolute",
//                         left: "100%",
//                         top: 0,
//                         ml: 1,
//                         width: 260,
//                         borderRadius: 1.25,
//                         overflow: "hidden",
//                         boxShadow: "0 14px 28px rgba(2,6,23,.25)",
//                         bgcolor: "#0b1020",
//                         zIndex: 10,
//                       }}
//                     >
//                       <Box
//                         component="video"
//                         src={lesson.previewUrl}
//                         controls
//                         muted
//                         autoPlay
//                         loop
//                         sx={{
//                           width: "100%",
//                           height: 150,
//                           display: "block",
//                           objectFit: "cover",
//                           background: "#000",
//                         }}
//                       />
//                       <Box sx={{ p: 1.1, borderTop: "1px solid rgba(255,255,255,.08)" }}>
//                         <Typography
//                           sx={{
//                             fontSize: 12.5,
//                             fontWeight: 800,
//                             color: "#f1f5f9",
//                             whiteSpace: "nowrap",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                           }}
//                           title={lesson.title}
//                         >
//                           {lesson.title}
//                         </Typography>
//                         {duration != null && (
//                           <Typography sx={{ fontSize: 11, color: "#cbd5e1", mt: 0.25 }}>
//                             {fmt(duration)}
//                           </Typography>
//                         )}
//                       </Box>
//                     </Box>
//                   </Tooltip>
//                 )}
//               </Box>
//             );
//           })}
//         </Box>
//       ))}
//     </List>
//   );

//   return (
//     <>
//       {/* Desktop card */}
//       {!isMobile && (
//         <Card>
//           <CardHeader
//             title={<strong>Course content</strong>}
//             action={
//               <Button
//                 size="small"
//                 variant="outlined"
//                 onClick={() => setSidebarOpen((v) => !v)}
//                 title={sidebarOpen ? "Collapse" : "Expand"}
//               >
//                 {sidebarOpen ? "◂" : "▸"}
//               </Button>
//             }
//           />
//           {sidebarOpen && (
//             <CardContent sx={{ pt: 0 }}>
//               <UdemyProgress percent={progressPercent || 0} />
//               {ContentList}
//             </CardContent>
//           )}

//           {!sidebarOpen && (
//             <button
//               className="btn btn-light border position-fixed end-0 top-50 translate-middle-y d-none d-lg-inline-flex"
//               style={{ zIndex: 1030, borderRadius: "8px 0 0 8px" }}
//               onClick={() => setSidebarOpen(true)}
//               title="Show course content"
//             >
//               ◂
//             </button>
//           )}
//         </Card>
//       )}

//       {/* Mobile rendering when used inside Drawer */}
//       {renderMobile && isMobile && (
//         <div className="p-2">
//           {/* progress + close row */}
//           <div className="d-flex align-items-center justify-content-between mb-2">
//             <UdemyProgress percent={progressPercent || 0} size={60} strokeWidth={8} />
           
//           </div>

//           {ContentList}
//         </div>
//       )}
//     </>
//   );
// }






// src/MockTest/page/LMS/LMS_Pages/SyllabusSidebar.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  List,
  ListSubheader,
  ListItemButton,
  Typography,
  Tooltip,
  Button,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import {
  FaPlayCircle,
  FaHeadphones,
  FaFileAlt,
  FaQuestionCircle,
  FaBroadcastTower,
} from "react-icons/fa";

/* === Udemy-like circular progress (UI only) === */
function UdemyProgress({ percent = 0, size = 72, strokeWidth = 8 }) {
  const pct = Math.max(0, Math.min(100, Number(percent) || 0));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center" style={{ fontSize: 13, gap: "5px" }}>
        <span className="text-muted">Your progress</span>
        <span className="fw-semibold">{pct}% complete</span>
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
        <svg width={size} height={size} role="img" aria-label={`Course progress ${pct}%`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#d1d7dc" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#a435f0"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset .35s ease" }}
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            style={{ fontSize: size * 0.28, fontWeight: 700, fill: "#111827" }}
          >
            {pct}%
          </text>
        </svg>
      </div>
    </div>
  );
}

const TYPE_ICON = {
  video: <FaPlayCircle size={16} color="#6366f1" />,
  audio: <FaHeadphones size={16} color="#10b981" />,
  article: <FaFileAlt size={16} color="#64748b" />,
  quiz: <FaQuestionCircle size={16} color="#eab308" />,
  live: <FaBroadcastTower size={16} color="#ef4444" />,
};
const iconFor = (t) => TYPE_ICON[String(t || "").toLowerCase()] || <FaFileAlt size={16} color="#64748b" />;

/* Duration helpers */
const secsOf = (lesson) => {
  const cands = [
    lesson?.duration,
    lesson?.durationSeconds,
    lesson?.durationMs,
    lesson?.videoDuration,
    lesson?.lengthSeconds,
    lesson?.durationStr,
    lesson?.isoDuration,
    lesson?.metrics?.duration,
    lesson?.meta?.duration,
    lesson?.meta?.durationSeconds,
    lesson?.meta?.durationStr,
    lesson?.video?.duration,
    lesson?.video?.durationSeconds,
    lesson?.video?.durationMs,
    lesson?.content?.duration,
    lesson?.vp?.duration,
  ];
  for (const c of cands) {
    const n = Number(c);
    if (Number.isFinite(n) && n > 0) return Math.round(n > 10000 ? n / 1000 : n);
    if (typeof c === "string") {
      const s = c.trim();
      const t = s.match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/);
      if (t) {
        const a = parseInt(t[1] || "0", 10);
        const b = parseInt(t[2] || "0", 10);
        const d = parseInt(t[3] || "0", 10);
        return t[3] ? a * 3600 + b * 60 + d : a * 60 + b;
      }
      const m = /^P(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)$/i.exec(s);
      if (m) {
        const h = parseInt(m[2] || "0", 10);
        const mm = parseInt(m[3] || "0", 10);
        const ss = parseInt(m[4] || "0", 10);
        const total = h * 3600 + mm * 60 + ss;
        if (total > 0) return total;
      }
      if (/^\d+(\.\d+)?$/.test(s)) {
        const num = parseFloat(s);
        if (num > 0) return Math.round(num > 10000 ? num / 1000 : num);
      }
    }
  }
  return null;
};
const fmt = (secs) => {
  if (secs == null) return null;
  const s = Math.max(0, Math.floor(secs));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
};

/* ---------- SAFE path builder (prevents /lesson/undefined) ---------- */
const getCourseKey = (course) => (course?.slug || course?._id || "").toString();
const getLessonPath = (course, section, lesson) => {
  const key = getCourseKey(course);
  const sid = String(section?._id || "");
  const lid = String(lesson?._id || "");
  if (!key || !sid || !lid) return null;
  // Player route in your app:
  return `/learn/${key}/${sid}/${lid}`;
};

export default function SyllabusSidebar({
  course,
  currentLessonId,
  onOpenChange,
  progressPercent = 0,
  renderMobile = false,
  completedLessonIds = [],
}) {
  const [hoveredLesson, setHoveredLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const activeItemRef = useRef(null);
  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [currentLessonId]);

  // responsive watcher (matches the page breakpoint)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 991.98px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Notify parent only for DESKTOP usage (prevents Drawer auto-close on mobile)
  useEffect(() => {
    if (typeof onOpenChange === "function" && !renderMobile) {
      onOpenChange(!isMobile && sidebarOpen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarOpen, isMobile, renderMobile]);

  if (!course || !Array.isArray(course.sections)) return null;

  const completedSet = new Set((completedLessonIds || []).map(String));

  const completionDot = (done) => (
    <span
      aria-hidden
      style={{
        width: 15,
        height: 15,
        borderRadius: "50%",
        marginLeft: 10,
        flexShrink: 0,
        background: done ? "#47ac58ff" : "transparent",
        border: done ? "none" : "1.5px solid #cbd5e1",
        display: "inline-block",
      }}
    />
  );

  const ContentList = (
    <List dense disablePadding>
      {course.sections.map((section) => (
        <Box component="div" key={section._id}>
          <ListSubheader
            disableSticky
            sx={{
              bgcolor: "transparent",
              px: 1.5,
              py: 1.1,
              lineHeight: 1.15,
              color: "#334155",
              fontSize: 13.5,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            {section.title}
          </ListSubheader>

          {(section.lessons || []).map((lesson) => {
            const lid = String(lesson?._id || "");
            const isActive = lid && String(lid) === String(currentLessonId || "");
            const duration = secsOf(lesson);
            const isDone = completedSet.has(lid);
            const safePath = getLessonPath(course, section, lesson);

            return (
              <Box key={lid || lesson.title || Math.random()} sx={{ position: "relative" }}>
                <ListItemButton
                  ref={isActive ? activeItemRef : null}
                  selected={isActive}
                  onMouseEnter={() => setHoveredLesson(lid)}
                  onMouseLeave={() => setHoveredLesson(null)}
                  onClick={() => {
                    if (safePath) navigate(safePath);
                    // If not safe, do nothing (prevents /lesson/undefined)
                  }}
                  disabled={!safePath}
                  sx={{
                    py: 1.15,
                    px: 1.5,
                    borderBottom: "1px solid #eef2f7",
                    alignItems: "center",
                    opacity: safePath ? 1 : 0.5,
                    cursor: safePath ? "pointer" : "not-allowed",
                    transition:
                      "background-color .15s ease, padding-left .15s ease, border-left .15s ease, opacity .15s ease",
                    "&.Mui-selected": {
                      bgcolor: "#eef2ff",
                      borderLeft: "4px solid #6d28d9",
                      pl: "12px",
                    },
                    "&:hover": { bgcolor: safePath ? "#f8fafc" : "inherit" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      gap: 1,
                    }}
                  >
                    {/* LEFT: icon + title */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, minHeight: 50 }}>
                      <Box sx={{ lineHeight: 0, flexShrink: 0 }}>{iconFor(lesson.type)}</Box>
                      <Typography
                        noWrap
                        title={lesson.title}
                        sx={{
                          fontSize: 16,
                          fontWeight: isActive ? 800 : 650,
                          color: isActive ? "#1f2937" : "#0f172a",
                          lineHeight: 1.35,
                          minWidth: 0,
                        }}
                      >
                        {lesson.title || "Untitled lesson"}
                      </Typography>
                    </Box>

                    {/* RIGHT: duration + completion dot */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {/* {duration != null && (
                        <Typography component="span" sx={{ fontSize: 12.5, color: "#475569" }}>
                          {fmt(duration)}
                        </Typography>
                      )} */}
                      {completionDot(isDone)}
                    </Box>
                  </Box>
                </ListItemButton>

                {/* Hover video preview */}
                {hoveredLesson === lid && lesson.previewUrl && (
                  <Tooltip
                    open
                    title=""
                    arrow
                    componentsProps={{
                      tooltip: { sx: { bgcolor: "transparent", p: 0 } },
                      arrow: { sx: { display: "none" } },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        left: "100%",
                        top: 0,
                        ml: 1,
                        width: 260,
                        borderRadius: 1.25,
                        overflow: "hidden",
                        boxShadow: "0 14px 28px rgba(2,6,23,.25)",
                        bgcolor: "#0b1020",
                        zIndex: 10,
                      }}
                    >
                      <Box
                        component="video"
                        src={lesson.previewUrl}
                        controls
                        muted
                        autoPlay
                        loop
                        sx={{
                          width: "100%",
                          height: 150,
                          display: "block",
                          objectFit: "cover",
                          background: "#000",
                        }}
                      />
                      <Box sx={{ p: 1.1, borderTop: "1px solid rgba(255,255,255,.08)" }}>
                        <Typography
                          sx={{
                            fontSize: 12.5,
                            fontWeight: 800,
                            color: "#f1f5f9",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={lesson.title}
                        >
                          {lesson.title || "Untitled lesson"}
                        </Typography>
                        {/* {duration != null && (
                          <Typography sx={{ fontSize: 11, color: "#cbd5e1", mt: 0.25 }}>
                            {fmt(duration)}
                          </Typography>
                        )} */}
                      </Box>
                    </Box>
                  </Tooltip>
                )}
              </Box>
            );
          })}
        </Box>
      ))}
    </List>
  );

  return (
    <>
      {/* Desktop card */}
      {!isMobile && (
        <Card>
          <CardHeader
            title={<strong>Course content</strong>}
            action={
              <Button
                size="small"
                variant="outlined"
                onClick={() => setSidebarOpen((v) => !v)}
                title={sidebarOpen ? "Collapse" : "Expand"}
              >
                {sidebarOpen ? "◂" : "▸"}
              </Button>
            }
          />
          {sidebarOpen && (
            <CardContent sx={{ pt: 0 }}>
             <UdemyProgress key={progressPercent} percent={Number(progressPercent) || 0} />

              {ContentList}
            </CardContent>
          )}

          {!sidebarOpen && (
            <button
              className="btn btn-light border position-fixed end-0 top-50 translate-middle-y d-none d-lg-inline-flex"
              style={{ zIndex: 1030, borderRadius: "8px 0 0 8px" }}
              onClick={() => setSidebarOpen(true)}
              title="Show course content"
            >
              ◂
            </button>
          )}
        </Card>
      )}

      {/* Mobile rendering when used inside Drawer */}
      {renderMobile && isMobile && (
        <div className="p-2">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <UdemyProgress percent={progressPercent || 0} size={60} strokeWidth={8} />
          </div>
          {ContentList}
        </div>
      )}
    </>
  );
}
