
// // ---- imports must be first ----
//   import React, { useContext } from "react";
//   import { useNavigate, useParams } from "react-router-dom";
//   import { AuthContext } from "../../context/AuthContext";
//   import TrackedVideo from "./LMS_Pages/TrackedVideo";

 

//   // === Duration helpers (same logic, just placed after imports) ===
//   export const parseIso8601 = (str) => {
//     const m = /^P(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)$/i.exec(str || "");
//     if (!m) return null;
//     const h = parseInt(m[2] || "0", 10);
//     const mm = parseInt(m[3] || "0", 10);
//     const ss = parseInt(m[4] || "0", 10);
//     return h * 3600 + mm * 60 + ss;
//   };

//   export const coerceToSeconds = (v) => {
//     if (v == null) return null;
//     if (typeof v === "number" && !isNaN(v)) return v > 10000 ? Math.round(v / 1000) : Math.round(v);
//     if (typeof v === "string") {
//       const s = v.trim();
//       if (/^\d+(\.\d+)?$/.test(s)) {
//         const n = parseFloat(s);
//         return n > 10000 ? Math.round(n / 1000) : Math.round(n);
//       }
//       const t = s.match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/);
//       if (t) {
//         const a = parseInt(t[1] || "0", 10);
//         const b = parseInt(t[2] || "0", 10);
//         const c = parseInt(t[3] || "0", 10);
//         return t[3] ? a * 3600 + b * 60 + c : a * 60 + b;
//       }
//       const iso = parseIso8601(s);
//       if (iso != null) return iso;
//     }
//     return null;
//   };

//   export const formatDuration = (seconds) => {
//     if (seconds == null || isNaN(seconds)) return null;
//     const secs = Math.max(0, Math.floor(seconds));
//     const mins = Math.floor(secs / 60);
//     const rem = secs % 60;
//     return `${mins}m ${rem}s`;
//   };

//   // === LessonPreview (unchanged logic) ===
//   function LessonPreview({ type, fileUrl, testId, onVideoEnded }) {
//     const navigate = useNavigate();
//     const { user } = useContext(AuthContext);
//     const { courseSlug, sectionId, lessonId } = useParams();

    

//     const normType = (type ?? "").toString().toLowerCase().trim();
//      const QUIZ_TYPES = new Set([
//     "section quiz", "section-quiz", "section_quiz", "sectionquiz",
//     "quiz", "test", "mocktest", "mock test", "mock-test"
//   ]);

//     const title = new URLSearchParams(window.location.search).get("title") || "Quiz";
//     const isStaff = ["admin", "teacher"].includes(
//       String(
//         user?.role ?? (JSON.parse(localStorage.getItem("user") || "{}")?.role ?? "")
//       ).toLowerCase()
//     );

//     const handleVideoEnded = () => {
//       if (onVideoEnded) onVideoEnded();
//     };


//     // Resolve testId from props → ?testId → path-ish fallback
//   const resolveTestId = () => {
//     const qs = new URLSearchParams(window.location.search);
//     const qsTestId = qs.get("testId");
//     const raw = String(testId ?? qsTestId ?? fileUrl ?? "");
//     if (!raw) return "";
//     const rawPath = raw.replace(/^https?:\/\/[^/]+/i, "").replace(/^\/*/, "");
//     const id = rawPath
//       .replace(/^mocktest\//i, "")
//       .split("?")[0]
//       .split("#")[0]
//       .split("/")
//       .filter(Boolean)
//       .pop();
//     return id || "";
//   };

//     const renderVideo = () => (
//       <div style={{ width: "100%", height: "100%" }}>
//         <TrackedVideo
//           src={fileUrl}
//           courseSlug={courseSlug}
//           sectionId={sectionId}
//           lessonId={lessonId}
//           autoPlay={false}
//           style={{ width: "100%", height: "100%", display: "block", background: "#000" }}
//           controlsList="nodownload noplaybackrate noremoteplayback"
//           disablePictureInPicture
//           playsInline
//           onEnded={handleVideoEnded}
//         />
//       </div>
//     );

//     const renderAudio = () => (
//       <audio controls style={{ width: "100%" }} src={fileUrl} />
//     );

//     const renderDoc = () => (
//       <iframe
//         src={fileUrl}
//         width="100%"
//         height="520"
//         title="Document Viewer"
//         frameBorder="0"
//         style={{ borderRadius: 8 }}
//       />
//     );

//     const renderQuiz = () => {
//     const id = resolveTestId();
//     if (!id) return <div className="alert alert-warning">Quiz is not configured yet.</div>;
//     const url = isStaff ? `/exam/${id}` : `/test-overview/${id}`;
//     return (
//       <div style={{ textAlign: "center", padding: "16px 8px" }}>
//         <h4 style={{ margin: "0 0 10px", fontWeight: 700 }}>{title}</h4>
//         <button
//           onClick={() => navigate(url)}
//           style={{
//             display: "inline-block",
//             padding: "10px 16px",
//             borderRadius: 12,
//             fontWeight: 700,
//             border: "1px solid rgba(37,99,235,.2)",
//             background: "linear-gradient(180deg, #3b82f6, #2563eb)",
//             color: "white",
//             boxShadow: "0 6px 20px rgba(37,99,235,.25)",
//           }}
//         >
//           {isStaff ? "✏️ Edit the Quiz" : "➤ Take Section Quiz"}
//         </button>
//       </div>
//     );
//   };

//     let body;
//     if (normType === "video") body = renderVideo();
//     else if (normType === "audio") body = renderAudio();
//     else if (["pdf", "slides", "article"].includes(normType)) body = renderDoc();
//       else if (QUIZ_TYPES.has(normType)) body = renderQuiz();
//     else body = <p className="text-muted">Nothing to preview.</p>;

//     // IMPORTANT: no card container around the media
//     return <div style={{ width: "100%", height: "100%" }}>{body}</div>;
//   }

//   export default LessonPreview;






///JAvid 


// ============================================================================
// LessonPreview.jsx (Final Merged + Duration Display)
// ----------------------------------------------------------------------------
// - Full merge of your 1st + 2nd codes
// - Adds duration display for Video & Audio using formatDuration()
// - Keeps robust quiz resolver, QUIZ_TYPES, staff/student navigation
// - Preserves fallbacks (no fileUrl, nothing to preview, quiz not configured)
// ============================================================================

// import React, { useContext, useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import TrackedVideo from "./LMS_Pages/TrackedVideo";

// // ----------------------------------------------------------------------------
// // Duration helpers
// // ----------------------------------------------------------------------------
// export const parseIso8601 = (str) => {
//   const m = /^P(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)$/i.exec(str || "");
//   if (!m) return null;
//   const h = parseInt(m[2] || "0", 10);
//   const mm = parseInt(m[3] || "0", 10);
//   const ss = parseInt(m[4] || "0", 10);
//   return h * 3600 + mm * 60 + ss;
// };

// export const coerceToSeconds = (v) => {
//   if (v == null) return null;
//   if (typeof v === "number" && !isNaN(v))
//     return v > 10000 ? Math.round(v / 1000) : Math.round(v);
//   if (typeof v === "string") {
//     const s = v.trim();
//     if (/^\d+(\.\d+)?$/.test(s)) {
//       const n = parseFloat(s);
//       return n > 10000 ? Math.round(n / 1000) : Math.round(n);
//     }
//     const t = s.match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/);
//     if (t) {
//       const a = parseInt(t[1] || "0", 10);
//       const b = parseInt(t[2] || "0", 10);
//       const c = parseInt(t[3] || "0", 10);
//       return t[3] ? a * 3600 + b * 60 + c : a * 60 + b;
//     }
//     const iso = parseIso8601(s);
//     if (iso != null) return iso;
//   }
//   return null;
// };

// export const formatDuration = (seconds) => {
//   if (seconds == null || isNaN(seconds)) return null;
//   const secs = Math.max(0, Math.floor(seconds));
//   const mins = Math.floor(secs / 60);
//   const rem = secs % 60;
//   return `${mins}m ${rem}s`;
// };

// // ----------------------------------------------------------------------------
// // LessonPreview component
// // ----------------------------------------------------------------------------
// function LessonPreview({ type, fileUrl, testId, onVideoEnded }) {
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
//   const { courseSlug, sectionId, lessonId } = useParams();

//   // Duration state (for video/audio)
//   const [mediaDuration, setMediaDuration] = useState(null);

//   // Safety: require fileUrl
//   if (!fileUrl) return <p className="text-danger">File not available.</p>;

//   // Normalize type
//   const normType = (type ?? "").toString().toLowerCase().trim();

//   // Title fallback
//   const title =
//     new URLSearchParams(window.location.search).get("title") || "Quiz";

//   // Staff check
//   const isStaff = ["admin", "teacher"].includes(
//     String(
//       user?.role ??
//         (JSON.parse(localStorage.getItem("user") || "{}")?.role ?? "")
//     ).toLowerCase()
//   );

//   // Handler for tracked video
//   const handleVideoEnded = () => {
//     if (onVideoEnded) onVideoEnded();
//   };

//   // ----------------------------------------------------------------------------
//   // Robust testId resolver
//   // ----------------------------------------------------------------------------
//   const resolveTestId = () => {
//     const qs = new URLSearchParams(window.location.search);
//     const qsTestId = qs.get("testId");
//     const raw = String(testId ?? qsTestId ?? fileUrl ?? "");
//     if (!raw) return "";
//     const rawPath = raw
//       .replace(/^https?:\/\/[^/]+/i, "")
//       .replace(/^\/*/, "");
//     const id = rawPath
//       .replace(/^mocktest\//i, "")
//       .split("?")[0]
//       .split("#")[0]
//       .split("/")
//       .filter(Boolean)
//       .pop();
//     return id || "";
//   };

//   // ----------------------------------------------------------------------------
//   // Renderers
//   // ----------------------------------------------------------------------------
//   const renderVideo = () => (
//     <div style={{ width: "100%", height: "100%" }}>
//       <TrackedVideo
//         src={fileUrl}
//         courseSlug={courseSlug}
//         sectionId={sectionId}
//         lessonId={lessonId}
//         autoPlay={false}
//         style={{
//           width: "100%",
//           height: "100%",
//           display: "block",
//           background: "#000",
//         }}
//         controlsList="nodownload noplaybackrate noremoteplayback"
//         disablePictureInPicture
//         playsInline
//         onEnded={handleVideoEnded}
//         // Capture duration once metadata is loaded
//         onLoadedMetadata={(e) =>
//           setMediaDuration(Math.round(e.target.duration || 0))
//         }
//       />
//       {mediaDuration != null && (
//         <div style={{ marginTop: 8, fontSize: "0.9em", color: "#555" }}>
//           Duration: {formatDuration(mediaDuration)}
//         </div>
//       )}
//     </div>
//   );

//   const renderAudio = () => (
//     <div>
//       <audio
//         controls
//         style={{ width: "100%" }}
//         src={fileUrl}
//         onLoadedMetadata={(e) =>
//           setMediaDuration(Math.round(e.target.duration || 0))
//         }
//       />
//       {mediaDuration != null && (
//         <div style={{ marginTop: 4, fontSize: "0.9em", color: "#555" }}>
//           Duration: {formatDuration(mediaDuration)}
//         </div>
//       )}
//     </div>
//   );

//   const renderDoc = () => (
//     <iframe
//       src={fileUrl}
//       width="100%"
//       height="520"
//       title="Document Viewer"
//       frameBorder="0"
//       style={{ borderRadius: 8 }}
//     />
//   );

//   const renderQuiz = () => {
//     const id = resolveTestId();
//     if (!id)
//       return (
//         <div className="alert alert-warning">Quiz is not configured yet.</div>
//       );
//     const url = isStaff ? `/exam/${id}` : `/test-overview/${id}`;
//     return (
//       <div style={{ textAlign: "center", padding: "16px 8px" }}>
//         <h4 style={{ margin: "0 0 10px", fontWeight: 700 }}>{title}</h4>
//         <button
//           onClick={() => navigate(url)}
//           style={{
//             display: "inline-block",
//             padding: "10px 16px",
//             borderRadius: 12,
//             fontWeight: 700,
//             border: "1px solid rgba(37,99,235,.2)",
//             background: "linear-gradient(180deg, #3b82f6, #2563eb)",
//             color: "white",
//             boxShadow: "0 6px 20px rgba(37,99,235,.25)",
//           }}
//         >
//           {isStaff ? "✏️ Edit the Quiz" : "➤ Take Section Quiz"}
//         </button>
//       </div>
//     );
//   };

//   // ----------------------------------------------------------------------------
//   // Expanded QUIZ_TYPES
//   // ----------------------------------------------------------------------------
//   const QUIZ_TYPES = new Set([
//     "section quiz",
//     "section-quiz",
//     "section_quiz",
//     "sectionquiz",
//     "quiz",
//     "test",
//     "mocktest",
//     "mock test",
//     "mock-test",
//   ]);

//   // ----------------------------------------------------------------------------
//   // Final body
//   // ----------------------------------------------------------------------------
//   let body;
//   if (normType === "video") body = renderVideo();
//   else if (normType === "audio") body = renderAudio();
//   else if (["pdf", "slides", "article"].includes(normType)) body = renderDoc();
//   else if (QUIZ_TYPES.has(normType)) body = renderQuiz();
//   else body = <p className="text-muted">Nothing to preview.</p>;

//   return <div style={{ width: "100%", height: "100%" }}>{body}</div>;
// }

// export default LessonPreview;






// import React, { useContext, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import TrackedVideo from "./LMS_Pages/TrackedVideo";

// // ----------------------------------------------------------------------------
// // Duration helpers
// // ----------------------------------------------------------------------------

// // Parse ISO-8601 duration like "PT1H2M3S" → seconds
// export const parseIso8601 = (str) => {
//   const m = /^P(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)$/i.exec(str || "");
//   if (!m) return null;
//   const h = parseInt(m[2] || "0", 10);
//   const mm = parseInt(m[3] || "0", 10);
//   const ss = parseInt(m[4] || "0", 10);
//   return h * 3600 + mm * 60 + ss;
// };

// // Coerce many duration shapes to seconds (number|string)
// export const coerceToSeconds = (v) => {
//   if (v == null) return null;
//   if (typeof v === "number" && !isNaN(v)) {
//     return v > 10000 ? Math.round(v / 1000) : Math.round(v); // ms → s
//   }
//   if (typeof v === "string") {
//     const s = v.trim();

//     // plain number ("123" or "123.4")
//     if (/^\d+(\.\d+)?$/.test(s)) {
//       const n = parseFloat(s);
//       return n > 10000 ? Math.round(n / 1000) : Math.round(n);
//     }

//     // "mm:ss" or "hh:mm:ss"
//     const t = s.match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/);
//     if (t) {
//       const a = parseInt(t[1] || "0", 10);
//       const b = parseInt(t[2] || "0", 10);
//       const c = parseInt(t[3] || "0", 10);
//       return t[3] ? a * 3600 + b * 60 + c : a * 60 + b;
//     }

//     // ISO-8601 "PT#H#M#S"
//     const iso = parseIso8601(s);
//     if (iso != null) return iso;
//   }
//   return null;
// };

// export const formatDuration = (seconds) => {
//   if (seconds == null || isNaN(seconds)) return null;
//   const secs = Math.max(0, Math.floor(seconds));
//   const mins = Math.floor(secs / 60);
//   const rem = secs % 60;
//   return `${mins}m ${rem}s`;
// };



// // ----------------------------------------------------------------------------
// // LessonPreview component
// // ----------------------------------------------------------------------------
// function LessonPreview({ type, fileUrl, testId, mockTestId, onVideoEnded }) {
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
//   const { courseSlug, sectionId, lessonId } = useParams();

//   const [mediaDuration, setMediaDuration] = useState(null);

//   if (!fileUrl && !mockTestId) {
//     return <p className="text-danger">File not available.</p>;
//   }

//   const normType = (type ?? "").toString().toLowerCase().trim();

//   const title =
//     new URLSearchParams(window.location.search).get("title") || "Lesson";

//   const isStaff = ["admin", "teacher"].includes(
//     String(
//       user?.role ??
//         (JSON.parse(localStorage.getItem("user") || "{}")?.role ?? "")
//     ).toLowerCase()
//   );

//   const handleVideoEnded = () => {
//     if (onVideoEnded) onVideoEnded();
//   };

//   // ----------------------------------------------------------------------------
//   // Renderers
//   // ----------------------------------------------------------------------------
//   const renderVideo = () => (
//     <div style={{ width: "100%", height: "100%" }}>
//       <TrackedVideo
//         src={fileUrl}
//         courseSlug={courseSlug}
//         sectionId={sectionId}
//         lessonId={lessonId}
//         autoPlay={false}
//         style={{
//           width: "100%",
//           height: "100%",
//           display: "block",
//           background: "#000",
//         }}
//         controlsList="nodownload noplaybackrate noremoteplayback"
//         disablePictureInPicture
//         playsInline
//         onEnded={handleVideoEnded}
//         onLoadedMetadata={(e) =>
//           setMediaDuration(Math.round(e.target.duration || 0))
//         }
//       />
//       {mediaDuration != null && (
//         <div style={{ marginTop: 8, fontSize: "0.9em", color: "#555" }}>
//           Duration: {formatDuration(mediaDuration)}
//         </div>
//       )}
//     </div>
//   );

//   const renderAudio = () => (
//     <div>
//       <audio
//         controls
//         style={{ width: "100%" }}
//         src={fileUrl}
//         onLoadedMetadata={(e) =>
//           setMediaDuration(Math.round(e.target.duration || 0))
//         }
//       />
//       {mediaDuration != null && (
//         <div style={{ marginTop: 4, fontSize: "0.9em", color: "#555" }}>
//           Duration: {formatDuration(mediaDuration)}
//         </div>
//       )}
//     </div>
//   );

//   const renderDoc = () => (
//     <iframe
//       src={fileUrl}
//       width="100%"
//       height="520"
//       title="Document Viewer"
//       frameBorder="0"
//       style={{ borderRadius: 8 }}
//     />
//   );

//   const renderQuiz = () => {
//     const id = mockTestId || testId;
//     if (!id)
//       return (
//         <div className="alert alert-warning">Quiz is not configured yet.</div>
//       );
//     const url = isStaff ? `/exam/${id}` : `/test-overview/${id}`;
//     return (
//       <div style={{ textAlign: "center", padding: "16px 8px" }}>
//         <h4 style={{ margin: "0 0 10px", fontWeight: 700 }}>{title}</h4>
//         <button
//           onClick={() => navigate(url)}
//           style={{
//             display: "inline-block",
//             padding: "10px 16px",
//             borderRadius: 12,
//             fontWeight: 700,
//             border: "1px solid rgba(37,99,235,.2)",
//             background: "linear-gradient(180deg, #3b82f6, #2563eb)",
//             color: "white",
//             boxShadow: "0 6px 20px rgba(37,99,235,.25)",
//           }}
//         >
//           {isStaff ? "✏️ Edit the Quiz" : "➤ Take Section Quiz"}
//         </button>
//       </div>
//     );
//   };

//   // ----------------------------------------------------------------------------
//   // Expanded QUIZ_TYPES
//   // ----------------------------------------------------------------------------
//   const QUIZ_TYPES = new Set([
//     "section quiz",
//     "quiz",
//     "test",
//     "mocktest",
//     "mock test",
//     "mock-test",
//   ]);

//   // ----------------------------------------------------------------------------
//   // Final body
//   // ----------------------------------------------------------------------------
//   let body;
//   if (normType === "video") body = renderVideo();
//   else if (normType === "audio") body = renderAudio();
//   else if (["pdf", "slides", "article"].includes(normType)) body = renderDoc();
//   else if (QUIZ_TYPES.has(normType)) body = renderQuiz();
//   else if (normType === "external link" && fileUrl)
//     body = (
//       <a href={fileUrl} target="_blank" rel="noopener noreferrer">
//         Open External Resource
//       </a>
//     );
//   else if (normType === "live" && fileUrl)
//     body = (
//       <a href={fileUrl} target="_blank" rel="noopener noreferrer">
//         Join Live Session
//       </a>
//     );
//   else body = <p className="text-muted">Nothing to preview.</p>;

//   return <div style={{ width: "100%", height: "100%" }}>{body}</div>;
// }

// export default LessonPreview;





import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// LessonDrawer.js
import { useAuth } from "../../../../LoginSystem/context/AuthContext";

 
import TrackedVideo from "./LMS_Pages/TrackedVideo";

// ----------------------------------------------------------------------------
// Duration helpers
// ----------------------------------------------------------------------------
export const parseIso8601 = (str) => {
  const m = /^P(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)$/i.exec(str || "");
  if (!m) return null;
  const h = parseInt(m[2] || "0", 10);
  const mm = parseInt(m[3] || "0", 10);
  const ss = parseInt(m[4] || "0", 10);
  return h * 3600 + mm * 60 + ss;
};

export const coerceToSeconds = (v) => {
  if (v == null) return null;
  if (typeof v === "number" && !isNaN(v)) {
    return v > 10000 ? Math.round(v / 1000) : Math.round(v);
  }
  if (typeof v === "string") {
    const s = v.trim();
    if (/^\d+(\.\d+)?$/.test(s)) {
      const n = parseFloat(s);
      return n > 10000 ? Math.round(n / 1000) : Math.round(n);
    }
    const t = s.match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/);
    if (t) {
      const a = parseInt(t[1] || "0", 10);
      const b = parseInt(t[2] || "0", 10);
      const c = parseInt(t[3] || "0", 10);
      return t[3] ? a * 3600 + b * 60 + c : a * 60 + b;
    }
    const iso = parseIso8601(s);
    if (iso != null) return iso;
  }
  return null;
};

export const formatDuration = (seconds) => {
  if (seconds == null || isNaN(seconds)) return null;
  const secs = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(secs / 60);
  const rem = secs % 60;
  return `${mins}m ${rem}s`;
};

// ----------------------------------------------------------------------------
// LessonPreview component
// ----------------------------------------------------------------------------
function LessonPreview({ type, fileUrl, testId, mockTestId, onVideoEnded }) {
  const navigate = useNavigate();
   const { user } = useAuth() || {};
  const { courseSlug, sectionId, lessonId } = useParams();

  const [mediaDuration, setMediaDuration] = useState(null);

  if (!fileUrl && !mockTestId) {
    return <p className="text-danger">File not available.</p>;
  }

  const normType = (type ?? "").toString().toLowerCase().trim();

  // ---- NEW: smart doc preview helpers (non-breaking) ------------------------
  const stripQuery = (u) => (u || "").split("?")[0];
  const isPdfUrl = (u) => /\.pdf(\?|#|$)/i.test(stripQuery(u));
  const isPptUrl = (u) => /\.(ppt|pptx)(\?|#|$)/i.test(stripQuery(u));
  const isDocUrl = (u) => /\.(doc|docx)(\?|#|$)/i.test(stripQuery(u));
  const isXlsUrl = (u) => /\.(xls|xlsx)(\?|#|$)/i.test(stripQuery(u));

  const buildDocSrc = () => {
    const src = fileUrl || "";
    const wantsOfficeViewer =
      isPptUrl(src) || isDocUrl(src) || isXlsUrl(src) || (normType === "slides" && !isPdfUrl(src));

    if (wantsOfficeViewer) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(src)}`;
    }
    // If you want Google viewer fallback, uncomment below:
    // if (!isPdfUrl(src) && normType !== "article") {
    //   return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(src)}`;
    // }
    return src; // PDFs, HTML, or anything natively supported
  };
  // --------------------------------------------------------------------------

  const title =
    new URLSearchParams(window.location.search).get("title") || "Lesson";

  const isStaff = ["admin", "teacher"].includes(
    String(
      user?.role ??
        (JSON.parse(localStorage.getItem("user") || "{}")?.role ?? "")
    ).toLowerCase()
  );

  const handleVideoEnded = () => {
    if (onVideoEnded) onVideoEnded();
  };

  // ----------------------------------------------------------------------------
  // Renderers
  // ----------------------------------------------------------------------------
  const renderVideo = () => (
    <div style={{ width: "100%", height: "100%" }}>
      <TrackedVideo
        src={fileUrl}
        courseSlug={courseSlug}
        sectionId={sectionId}
        lessonId={lessonId}
        autoPlay={false}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: "#000",
        }}
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        playsInline
        onEnded={handleVideoEnded}
        onLoadedMetadata={(e) =>
          setMediaDuration(Math.round(e.target.duration || 0))
        }
      />
      {mediaDuration != null && (
        <div style={{ marginTop: 8, fontSize: "0.9em", color: "#555" }}>
          Duration: {formatDuration(mediaDuration)}
        </div>
      )}
    </div>
  );

  const renderAudio = () => (
    <div>
      <audio
        controls
        style={{ width: "100%" }}
        src={fileUrl}
        onLoadedMetadata={(e) =>
          setMediaDuration(Math.round(e.target.duration || 0))
        }
      />
      {mediaDuration != null && (
        <div style={{ marginTop: 4, fontSize: "0.9em", color: "#555" }}>
          Duration: {formatDuration(mediaDuration)}
        </div>
      )}
    </div>
  );

  const renderDoc = () => (
    <iframe
      src={buildDocSrc()}           
      width="100%"
      height="520"
      title="Document Viewer"
      frameBorder="0"
      style={{ borderRadius: 8 }}
      allowFullScreen
    />
  );

  const renderQuiz = () => {
    const id = mockTestId || testId;
    if (!id)
      return (
        <div className="alert alert-warning">Quiz is not configured yet.</div>
      );
    const url = isStaff ? `/exam/${id}` : `/test-overview/${id}`;
    return (
      <div style={{ textAlign: "center", padding: "16px 8px" }}>
        <h4 style={{ margin: "0 0 10px", fontWeight: 700 }}>{title}</h4>
        <button
          onClick={() => navigate(url)}
          style={{
            display: "inline-block",
            padding: "10px 16px",
            borderRadius: 12,
            fontWeight: 700,
            border: "1px solid rgba(37,99,235,.2)",
            background: "linear-gradient(180deg, #3b82f6, #2563eb)",
            color: "white",
            boxShadow: "0 6px 20px rgba(37,99,235,.25)",
          }}
        >
          {isStaff ? "✏️ Edit the Quiz" : "➤ Take Section Quiz"}
        </button>
      </div>
    );
  };

  // ----------------------------------------------------------------------------
  // Expanded QUIZ_TYPES
  // ----------------------------------------------------------------------------
  const QUIZ_TYPES = new Set([
    "section quiz",
    "quiz",
    "test",
    "mocktest",
    "mock test",
    "mock-test",
  ]);

  // ----------------------------------------------------------------------------
  // Final body
  // ----------------------------------------------------------------------------
  let body;
  if (normType === "video") body = renderVideo();
  else if (normType === "audio") body = renderAudio();
  else if (["pdf", "slides", "article"].includes(normType)) body = renderDoc();
  else if (QUIZ_TYPES.has(normType)) body = renderQuiz();
  else if (normType === "external link" && fileUrl)
    body = (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        Open External Resource
      </a>
    );
  else if (normType === "live" && fileUrl)
    body = (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        Join Live Session
      </a>
    );
  else body = <p className="text-muted">Nothing to preview.</p>;

  return <div style={{ width: "100%", height: "100%" }}>{body}</div>;
}

export default LessonPreview;
