// // LMS/LessonRenderer/types/LiveLesson.jsx  (replace content)
// import React, { useEffect, useState, useRef } from "react";
// import { getLessonProgress, markLessonComplete } from "../../../../utils/ProgressApi";

// export default function LiveLesson({ lesson }) {
//   const meetUrl = lesson?.meta?.meetingUrl || lesson?.fileUrl || lesson?.videoUrl;
//   const start = lesson?.meta?.startsAtISO ? new Date(lesson.meta.startsAtISO) : null;
//   const end = lesson?.meta?.endsAtISO ? new Date(lesson.meta.endsAtISO) : null;

//   const [completed, setCompleted] = useState(false);
//   const timerRef = useRef(null);

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         if (!lesson?._id) return;
//         const saved = await getLessonProgress(lesson._id);
//         if (alive) setCompleted(Boolean(saved?.completed));
//       } catch {}
//     })();
//     return () => { alive = false; };
//   }, [lesson?._id]);

//   const onJoin = async () => {
//     if (meetUrl) window.open(meetUrl, "_blank", "noopener,noreferrer");
//     // mark join immediately; you can switch to delayed complete if you prefer
//     try { await markLessonComplete(lesson._id, true); setCompleted(true); } catch {}

//     // optional: mark again at end as safety (no-op if already true)
//     if (end) {
//       const ms = end.getTime() - Date.now();
//       if (ms > 0) {
//         clearTimeout(timerRef.current);
//         timerRef.current = setTimeout(async () => {
//           try { await markLessonComplete(lesson._id, true); setCompleted(true); } catch {}
//         }, Math.min(ms, 1000 * 60 * 60 * 6));
//       }
//     }
//   };

//   useEffect(() => () => clearTimeout(timerRef.current), []);

//   return (
//     <div>
//       <h5 className="mb-2">{lesson?.title || "Live Session"}</h5>
//       <div className="text-muted small mb-3">
//         {start ? `Starts: ${start.toLocaleString()}` : "Schedule: TBA"}
//         {end ? ` • Ends: ${end.toLocaleString()}` : null}
//       </div>
//       {meetUrl ? (
//         <button className="btn btn-primary" onClick={onJoin} disabled={completed}>
//           {completed ? "Joined (Completed)" : "Join Live Session"}
//         </button>
//       ) : (
//         <div className="alert alert-warning">Meeting link not available yet.</div>
//       )}
//     </div>
//   );
// }





// LMS/LessonRenderer/types/LiveLesson.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { getLessonProgress, markLessonComplete } from "../../../../utils/ProgressApi";

// export default function LiveLesson({ lesson, onLiveComplete }) {
//   const meetUrl = lesson?.meta?.meetingUrl || lesson?.fileUrl || lesson?.videoUrl;
//   const start = lesson?.meta?.startsAtISO ? new Date(lesson.meta.startsAtISO) : null;
//   const end = lesson?.meta?.endsAtISO ? new Date(lesson.meta.endsAtISO) : null;

//   const [completed, setCompleted] = useState(false);
//   const timerRef = useRef(null);

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         if (!lesson?._id) return;
//         const saved = await getLessonProgress(lesson._id);
//         if (alive) setCompleted(Boolean(saved?.completed));
//       } catch {}
//     })();
//     return () => { alive = false; };
//   }, [lesson?._id]);

//   const onJoin = async () => {
//     if (meetUrl) window.open(meetUrl, "_blank", "noopener,noreferrer");

//     // mark join immediately (same behavior as your comment)
//     try {
//       await markLessonComplete(lesson._id, true);
//       setCompleted(true);
//       // 🔔 New: bubble completion upward without changing your logic
//       if (typeof onLiveComplete === "function") onLiveComplete();
//     } catch {}

//     // optional safety: mark again at end (no-op if already complete)
//     if (end) {
//       const ms = end.getTime() - Date.now();
//       if (ms > 0) {
//         clearTimeout(timerRef.current);
//         timerRef.current = setTimeout(async () => {
//           try {
//             await markLessonComplete(lesson._id, true);
//             setCompleted(true);
//             if (typeof onLiveComplete === "function") onLiveComplete();
//           } catch {}
//         }, Math.min(ms, 1000 * 60 * 60 * 6));
//       }
//     }
//   };

//   useEffect(() => () => clearTimeout(timerRef.current), []);

//   return (
//     <div>
//       <h5 className="mb-2">{lesson?.title || "Live Session"}</h5>
//       <div className="text-muted small mb-3">
//         {start ? `Starts: ${start.toLocaleString()}` : "Schedule: TBA"}
//         {end ? ` • Ends: ${end.toLocaleString()}` : null}
//       </div>
//       {meetUrl ? (
//         <button className="btn btn-primary" onClick={onJoin} disabled={completed}>
//           {completed ? "Joined (Completed)" : "Join Live Session"}
//         </button>
//       ) : (
//         <div className="alert alert-warning">Meeting link not available yet.</div>
//       )}
//     </div>
//   );






import React, { useEffect, useRef, useState } from "react";
import "./liveLesson.css";
import { getLessonProgress, markLessonComplete } from '../../../../../utils/ProgressApi';

export default function LiveLesson({ lesson, fullscreenTargetRef }) {
  const meta = lesson?.meta || {};
  const liveUrl =
    meta.liveUrl || meta.meetingUrl || lesson?.fileUrl || lesson?.videoUrl || "";

  const startsAt = meta.startsAtISO ? new Date(meta.startsAtISO) : null;
  const endsAt = meta.endsAtISO ? new Date(meta.endsAtISO) : null;

  const totalMs = (() => {
    if (startsAt && endsAt && endsAt > startsAt) return endsAt - startsAt;
    const mins = Number(meta.plannedMinutes) > 0 ? Number(meta.plannedMinutes) : 60;
    return mins * 60 * 1000;
  })();

  const targetMs = Math.max(5 * 60 * 1000, Math.floor(totalMs * 0.8)); // ≥5 min or 80%

  const [joined, setJoined] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [watchedMs, setWatchedMs] = useState(0);
  const timerRef = useRef(null);
  const completedOnceRef = useRef(false);

  // ---------- Fullscreen (mirrors CustomVideoPlayer) ----------
  const wrapRef = useRef(null);
  const [isFs, setIsFs] = useState(false);

  const fsEnabled = () =>
    Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled);

  // Prefer external host if provided; else documentElement (stable); else local wrapper
  const chooseFsTarget = () => {
    if (fullscreenTargetRef?.current) return fullscreenTargetRef.current;
    if (fsEnabled()) return document.documentElement;
    return wrapRef.current;
  };

  const requestFs = async (el) => {
    try {
      if (!el) return false;
      if (!fsEnabled() && el === document.documentElement) return false;
      if (document.fullscreenElement === el || document.webkitFullscreenElement === el) return true;
      if (el.requestFullscreen) { await el.requestFullscreen(); return true; }
      if (el.webkitRequestFullscreen) { await el.webkitRequestFullscreen(); return true; }
    } catch {
      // swallow permission errors; report false
    }
    return false;
  };

  const exitFs = async () => {
    try {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
    } catch {}
  };

  const toggleFs = async () => {
    const target = chooseFsTarget();
    const activeEl = document.fullscreenElement || document.webkitFullscreenElement;

    // If our target (or anything inside it) is already fullscreen → exit
    if (activeEl && (activeEl === target || target?.contains?.(activeEl))) {
      await exitFs();
      return;
    }

    // Try preferred target; if denied, fall back to wrapper
    const ok = await requestFs(target);
    if (!ok && target !== wrapRef.current) {
      await requestFs(wrapRef.current);
    }
  };

  useEffect(() => {
    const onFs = () => {
      const activeEl = document.fullscreenElement || document.webkitFullscreenElement;
      const target = chooseFsTarget();
      setIsFs(Boolean(activeEl && (activeEl === target || target?.contains?.(activeEl))));
    };
    // initialize on mount
    onFs();
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("webkitfullscreenchange", onFs);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("webkitfullscreenchange", onFs);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreenTargetRef]);
  // -----------------------------------------------------------

  // Seed completion (reflect server state)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!lesson?._id) return;
        const saved = await getLessonProgress(lesson._id);
        if (alive) setCompleted(Boolean(saved?.completed));
      } catch {}
    })();
    return () => { alive = false; };
  }, [lesson?._id]);

  // Clean up timer
  useEffect(() => () => clearInterval(timerRef.current), []);

  // Attendance ticker after Join
  useEffect(() => {
    if (!joined || completed) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setWatchedMs((ms) => {
        const next = ms + 1000;
        if (!completedOnceRef.current && next >= targetMs) {
          completedOnceRef.current = true;
          (async () => {
            try {
              if (lesson?._id) {
                await markLessonComplete(lesson._id, true);
                setCompleted(true);
              }
            } catch {}
          })();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [joined, completed, targetMs, lesson?._id]);

  // Open-in-new-tab (robust, absolute URL)
  const toAbsoluteUrl = (u = "") => {
    if (!u) return "";
    if (/^https?:\/\//i.test(u)) return u;
    return `https://${u.replace(/^\/+/, "")}`;
  };

  const openInNewTab = (url) => {
    const abs = toAbsoluteUrl(url);
    if (!abs) return false;
    let w = null;
    try { w = window.open(abs, "_blank", "noopener,noreferrer"); } catch {}
    if (!w || w.closed || typeof w.closed === "undefined") {
      const a = document.createElement("a");
      a.href = abs; a.target = "_blank"; a.rel = "noopener noreferrer";
      document.body.appendChild(a); a.click(); a.remove();
    }
    return true;
  };

  const handleJoin = (e) => {
    e?.preventDefault?.();
    if (liveUrl) openInNewTab(liveUrl); // open first (trusted gesture)
    setJoined(true);                     // then start attendance timer
  };

  const pct = Math.min(100, Math.floor((watchedMs / targetMs) * 100));
  const wrapClass = `live-lesson-wrap${isFs ? " is-fs" : ""}`;

  return (
    <div ref={wrapRef} className={wrapClass}>
      <h5 className="mb-2">{lesson?.title || "Live Session"}</h5>
      <div className="text-muted small mb-2">
        {startsAt ? `Starts: ${startsAt.toLocaleString()}` : "Schedule: TBA"}
        {endsAt ? ` • Ends: ${endsAt.toLocaleString()}` : null}
      </div>

      {/* Black frame — double-click to toggle fullscreen */}
      <div
        className="live-frame"
        role="region"
        aria-label="Live player"
        onDoubleClickCapture={toggleFs}
      >
        {!joined ? (
          <button
            type="button"
            className="live-join-btn"
            onClick={handleJoin}
            disabled={!liveUrl}
            title={liveUrl ? "Open live session in a new tab" : "No meeting link available"}
          >
            Join live session
          </button>
        ) : (
          <div className="live-in-progress">
            <div className="dot" />
            <span>Live session joined… tracking attendance</span>
          </div>
        )}
      </div>

      <div className="d-flex align-items-center gap-2 mt-2">
        <span className="badge bg-secondary">Watched: {pct}%</span>
        {completed ? (
          <span className="text-success small">Completed (80% reached)</span>
        ) : (
          <span className="text-muted small">Auto-completes at 80% attendance</span>
        )}
      </div>

      {!liveUrl && (
        <div className="alert alert-warning mt-2">Meeting link not available.</div>
      )}
    </div>
  );
}
