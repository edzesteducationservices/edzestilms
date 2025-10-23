// // LMS/LessonRenderer/types/AudioLesson.jsx
// import React, { useState } from "react";
// import { coerceToSeconds, formatDuration } from "../LessonPreview";

// export default function AudioLesson({ lesson }) {
//   const [domSecs, setDomSecs] = useState(null);

//   const url = lesson?.fileUrl || lesson?.videoUrl;
//   const secs =
//     coerceToSeconds(lesson?.duration) ??
//     coerceToSeconds(lesson?.meta?.duration) ??
//     coerceToSeconds(lesson?.meta?.durationStr) ??
//     coerceToSeconds(lesson?.durationSeconds) ??
//     coerceToSeconds(lesson?.lengthSeconds) ??
//     coerceToSeconds(lesson?.durationMs) ??
//     coerceToSeconds(lesson?.isoDuration);

//   const effectiveSecs = secs || (Number.isFinite(domSecs) ? Math.round(domSecs) : null);
//   const display = formatDuration(effectiveSecs);

//   return (
//     <div>
//       <h5 className="mb-3">{lesson?.title || "Audio"}</h5>
//       {url ? (
//         <audio
//           controls
//           src={url}
//           style={{ width: "100%" }}
//           onLoadedMetadata={(e) => {
//             const d = e?.currentTarget?.duration;
//             if (Number.isFinite(d) && d > 0) setDomSecs(d);
//           }}
//         />
//       ) : (
//         <div className="alert alert-warning">Audio URL not available.</div>
//       )}
//       {display ? <div className="text-muted small mt-2">Duration: {display}</div> : null}
//     </div>
//   );
// }



// LMS/LessonRenderer/types/AudioLesson.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { coerceToSeconds, formatDuration } from "../LessonPreview";
// import { getLessonProgress, putLessonProgress, markLessonComplete } from "../../../../utils/ProgressApi";

// export default function AudioLesson({ lesson }) {
//   const [domSecs, setDomSecs] = useState(null);
//   const [completed, setCompleted] = useState(false);
//   const audioRef = useRef(null);
//   const lastSavedRef = useRef(0);

//   const url = lesson?.fileUrl || lesson?.videoUrl;
//   const secs =
//     coerceToSeconds(lesson?.duration) ??
//     coerceToSeconds(lesson?.meta?.duration) ??
//     coerceToSeconds(lesson?.meta?.durationStr) ??
//     coerceToSeconds(lesson?.durationSeconds) ??
//     coerceToSeconds(lesson?.lengthSeconds) ??
//     coerceToSeconds(lesson?.durationMs) ??
//     coerceToSeconds(lesson?.isoDuration);

//   const effectiveSecs = secs || (Number.isFinite(domSecs) ? Math.round(domSecs) : null);
//   const display = formatDuration(effectiveSecs);

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         if (!lesson?._id) return;
//         const saved = await getLessonProgress(lesson._id);
//         if (!alive || !audioRef.current || !saved) return;
//         if (saved.completed) { setCompleted(true); return; }
//         const t = Number(saved.currentTime || 0);
//         if (t > 0) { try { audioRef.current.currentTime = Math.max(0, t); } catch {} }
//       } catch {}
//     })();
//     return () => { alive = false; };
//   }, [lesson?._id]);

//   useEffect(() => {
//     const el = audioRef.current; if (!el || !lesson?._id) return;

//     const onTime = async () => {
//       const now = Date.now();
//       if (now - lastSavedRef.current < 4000) return;
//       lastSavedRef.current = now;
//       const current = Math.floor(el.currentTime || 0);
//       const dur = Math.floor(el.duration || 0);
//       if (dur <= 0 || current <= 0) return;
//       try { await putLessonProgress({ lessonId: lesson._id, currentTime: current, duration: dur, completed: false, lastSource: "audio" }); } catch {}
//     };

//     const onEnded = async () => {
//       try {
//         await putLessonProgress({
//           lessonId: lesson._id,
//           currentTime: Math.floor(el.duration || 0),
//           duration: Math.floor(el.duration || 0),
//           completed: true,
//           lastSource: "audio:end"
//         });
//         setCompleted(true);
//       } catch {
//         try { await markLessonComplete(lesson._id, true); setCompleted(true); } catch {}
//       }
//     };

//     el.addEventListener("timeupdate", onTime);
//     el.addEventListener("ended", onEnded);
//     return () => {
//       el.removeEventListener("timeupdate", onTime);
//       el.removeEventListener("ended", onEnded);
//     };
//   }, [lesson?._id]);

//   return (
//     <div>
//       <h5 className="mb-3">{lesson?.title || "Audio"}</h5>
//       {url ? (
//         <audio
//           ref={audioRef}
//           controls
//           src={url}
//           style={{ width: "100%" }}
//           onLoadedMetadata={(e) => {
//             const d = e?.currentTarget?.duration;
//             if (Number.isFinite(d) && d > 0) setDomSecs(d);
//           }}
//         />
//       ) : (
//         <div className="alert alert-warning">Audio URL not available.</div>
//       )}
//       {display ? <div className="text-muted small mt-2">Duration: {display}</div> : null}
//     </div>
//   );
// }






import React, { useEffect, useState, useRef } from "react";
import { coerceToSeconds, formatDuration } from "../LessonPreview";
import { getLessonProgress, putLessonProgress, markLessonComplete } from '../../../../../utils/ProgressApi';

export default function AudioLesson({ lesson }) {
  const [domSecs, setDomSecs] = useState(null);
  const [completed, setCompleted] = useState(false);

  // UI state (custom controls), DOES NOT alter your save/restore logic
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [durationUI, setDurationUI] = useState(0);

  const audioRef = useRef(null);
  const lastSavedRef = useRef(0);

  const url = lesson?.fileUrl || lesson?.videoUrl;

  // Keep your original duration computation and label
  const secs =
    coerceToSeconds(lesson?.duration) ??
    coerceToSeconds(lesson?.meta?.duration) ??
    coerceToSeconds(lesson?.meta?.durationStr) ??
    coerceToSeconds(lesson?.durationSeconds) ??
    coerceToSeconds(lesson?.lengthSeconds) ??
    coerceToSeconds(lesson?.durationMs) ??
    coerceToSeconds(lesson?.isoDuration);

  const effectiveSecs = secs || (Number.isFinite(domSecs) ? Math.round(domSecs) : null);
  const display = formatDuration(effectiveSecs);

  // Restore progress (UNCHANGED LOGIC)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!lesson?._id) return;
        const saved = await getLessonProgress(lesson._id);
        if (!alive || !audioRef.current || !saved) return;
        if (saved.completed) { setCompleted(true); return; }
        const t = Number(saved.currentTime || 0);
        if (t > 0) {
          try {
            audioRef.current.currentTime = Math.max(0, t);
            setTime(Math.max(0, t));
          } catch {}
        }
      } catch {}
    })();
    return () => { alive = false; };
  }, [lesson?._id]);

  // Save progress + mark complete (UNCHANGED ENDPOINTS/SHAPE)
  useEffect(() => {
    const el = audioRef.current; if (!el || !lesson?._id) return;

    const onTime = async () => {
      // keep the UI in sync
      setTime(el.currentTime || 0);
      setDurationUI(el.duration || 0);

      const now = Date.now();
      if (now - lastSavedRef.current < 4000) return; // same throttle
      lastSavedRef.current = now;

      const current = Math.floor(el.currentTime || 0);
      const dur = Math.floor(el.duration || 0);
      if (dur <= 0 || current <= 0) return;

      try {
        await putLessonProgress({
          lessonId: lesson._id,
          currentTime: current,
          duration: dur,
          completed: false,
          lastSource: "audio"
        });
      } catch {}
    };

    const onEnded = async () => {
      setPlaying(false); // keep UI consistent
      try {
        await putLessonProgress({
          lessonId: lesson._id,
          currentTime: Math.floor(el.duration || 0),
          duration: Math.floor(el.duration || 0),
          completed: true,
          lastSource: "audio:end"
        });
        setCompleted(true);
      } catch {
        try { await markLessonComplete(lesson._id, true); setCompleted(true); } catch {}
      }
    };

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
    };
  }, [lesson?._id]);

  // Custom controls (UI only; does NOT change your persistence logic)
  const toggle = () => {
    const a = audioRef.current; if (!a) return;
    if (a.paused) {
      a.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const onSeek = (e) => {
    const a = audioRef.current; if (!a) return;
    const t = Number(e.target.value);
    try {
      a.currentTime = t;
      setTime(t);
    } catch {}
  };

  const fmt = (s) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${String(r).padStart(2, "0")}`;
  };

  return (
    <div>
      <h5 className="mb-3">{lesson?.title || "Audio"}</h5>

      {url ? (
        <>
          {/* Custom control bar (no native controls) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: 12,
              border: "1px solid #eee",
              borderRadius: 8,
              marginBottom: 8
            }}
          >
            <button
              onClick={toggle}
              className="cp-btn"
              aria-label="Play/Pause"
              style={{
                border: 0,
                background: "rgba(0,0,0,.06)",
                borderRadius: 8,
                padding: "6px 10px",
                cursor: "pointer"
              }}
            >
              {playing ? "⏸" : "▶"}
            </button>

            <input
              type="range"
              min={0}
              max={Math.max(1, durationUI || 0)}
              step="0.1"
              value={Math.min(time || 0, durationUI || 0)}
              onChange={onSeek}
              style={{ flex: 1 }}
            />

            <span className="cp-time" style={{ fontFamily: "monospace" }}>
              {fmt(time || 0)} / {fmt(durationUI || 0)}
            </span>
          </div>

          {/* Hidden native controls; audio element still drives your existing logic */}
          <audio
            ref={audioRef}
            controls={false}
            src={url}
            preload="metadata"
            style={{ width: "100%" }}
            onLoadedMetadata={(e) => {
              const d = e?.currentTarget?.duration;
              if (Number.isFinite(d) && d > 0) {
                setDomSecs(d);
                setDurationUI(d);
              }
            }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        </>
      ) : (
        <div className="alert alert-warning">Audio URL not available.</div>
      )}

      {display ? <div className="text-muted small mt-2">Duration: {display}</div> : null}
    </div>
  );
}
