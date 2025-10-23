// import React, { useRef, useEffect, useCallback, useContext, useState } from "react";
// import axios from "axios";
// import { AuthContext } from "../../../context/AuthContext";
// import { getLessonProgress, putLessonProgress } from "../../../../utils/ProgressApi";


// // ✅ Use centralized API wrapper
// import API from "../../../../api/axios";

// export default function TrackedVideo({
//   src,
//   courseSlug = "",
//   sectionId = "",
//   lessonId = "",
//   autoPlay = false,
//   onEnded, // <- will be invoked from our DOM 'ended' listener
//   persistDurationIfKnown = true,
//   ...rest
// }) {
//   const { user } = useContext(AuthContext) || {};
//   const userId =
//     user?.id || user?._id || JSON.parse(localStorage.getItem("user") || "{}")?.id;
//   const roleRaw = user?.role || JSON.parse(localStorage.getItem("user") || "{}")?.role;
//   const role = String(roleRaw || "").toLowerCase();
//   const isAdminOrTeacher = role === "admin" || role === "teacher";
//   const isStudent = !isAdminOrTeacher;

//   const videoRef = useRef(null);
//   const lastSavedMsRef = useRef(0);
//   const [ready, setReady] = useState(false);
//   const didPatchDurationRef = useRef(false);

//   // reset per-lesson
//   useEffect(() => {
//     setReady(false);
//     lastSavedMsRef.current = 0;
//     didPatchDurationRef.current = false;
//   }, [src, lessonId]);

//   const seekSafely = useCallback((el, targetSec) => {
//     if (!el || targetSec == null) return;

//     const applySeek = () => {
//       const dur = Number(el.duration);
//       const hasDur = Number.isFinite(dur) && dur > 0;
//       const maxSafe = hasDur ? Math.max(0, dur - 0.5) : Number.MAX_SAFE_INTEGER;
//       const clamped = Math.max(0, Math.min(Number(targetSec) || 0, maxSafe));

//       let attempts = 0;
//       const maxAttempts = 5;
//       const trySeek = () => {
//         attempts += 1;
//         try { el.currentTime = clamped; } catch {}
//         requestAnimationFrame(() => {
//           const delta = Math.abs((el.currentTime || 0) - clamped);
//           if (delta < 0.35 || attempts >= maxAttempts) return;
//           trySeek();
//         });
//       };
//       trySeek();
//     };

//     if (el.readyState >= 1 /* HAVE_METADATA */) {
//       applySeek();
//     } else {
//       const onMeta = () => {
//         el.removeEventListener("loadedmetadata", onMeta);
//         el.removeEventListener("loadeddata", onMeta);
//         applySeek();
//       };
//       el.addEventListener("loadedmetadata", onMeta);
//       el.addEventListener("loadeddata", onMeta);
//     }
//   }, []);

//   const fetchProgressAndSeek = useCallback(async () => {
//     if (!lessonId || !userId) return;
//     try {
//       const savedRaw = await getLessonProgress(lessonId);
//       const saved = savedRaw && savedRaw.progress ? savedRaw.progress : savedRaw;

//       const v = videoRef.current;
//       if (!v || !saved) return;

//       const serverCompleted = Boolean(saved?.completed);
//       const serverTime = Number(saved?.currentTime || 0);

//       if (serverCompleted) {
//         seekSafely(v, 0);
//         return;
//       }
//       if (!Number.isNaN(serverTime) && serverTime > 0) {
//         seekSafely(v, serverTime);
//       }
//     } catch {
//       // ignore; start at 0
//     }
//   }, [lessonId, userId, seekSafely]);

//   const lastSentSecRef = useRef(-1);
//   const lastSentCompletedRef = useRef(false);

//   const saveProgress = useCallback(
//     async (force = false, reason = "tick") => {
//       if (!isStudent) return;
//       const v = videoRef.current;
//       if (!v || !lessonId || !userId) return;
//       if (v.readyState < 1 /* HAVE_METADATA */) return;

//       const now = Date.now();
//       if (!force && now - lastSavedMsRef.current < 4000) return; // 4s throttle
//       lastSavedMsRef.current = now;

//       const current = Math.floor(v.currentTime || 0);
//       const dur = Math.floor(v.duration || 0);
//       if (dur === 0) return;

//       const completed = reason === "ended";

//       if (!completed && current === lastSentSecRef.current) return;
//       if (!force && current <= 0) return;

//       const payload = {
//         courseSlug,
//         sectionId,
//         lessonId,
//         currentTime: current,
//         duration: dur,
//         completed,
//         lastSource: reason.startsWith("ended") ? "video:end" : "video",
//       };

//       try {
//         await putLessonProgress(payload);
//         lastSentSecRef.current = current;
//         if (completed) lastSentCompletedRef.current = true;
//       } catch {
//         // best-effort
//       }
//     },
//     [courseSlug, sectionId, lessonId, userId, isStudent]
//   );

//   // Persist media duration once we know it
//   useEffect(() => {
//     const v = videoRef.current;
//     if (!v || !lessonId || !persistDurationIfKnown) return;

//     const patchIfPossible = async () => {
//       if (didPatchDurationRef.current) return;
//       const d = Number.isFinite(v.duration) ? Math.round(v.duration) : 0;
//       if (d > 0) {
//         didPatchDurationRef.current = true;
//         try {
//           await API.patch(`/api/courses/lessons/${lessonId}/duration`, { duration: d });
//         } 
//         catch (e) {
//           // non-blocking
//           console.warn("Could not persist duration:", e?.response?.data || e.message);
//         }
//       }
//     };

//     if (v.readyState >= 1 /* HAVE_METADATA */) {
//       patchIfPossible();
//     } else {
//       const onMeta = () => {
//         v.removeEventListener("loadedmetadata", onMeta);
//         patchIfPossible();
//       };
//       v.addEventListener("loadedmetadata", onMeta);
//       return () => v.removeEventListener("loadedmetadata", onMeta);
//     }
//   }, [lessonId, persistDurationIfKnown, src]);

//   // Wire listeners (including 'ended' which calls your onEnded prop)
//   useEffect(() => {
//     const v = videoRef.current;
//     if (!v) return;

//     const onLoadedMeta = async () => {
//       if (!ready) {
//         await fetchProgressAndSeek();
//         setReady(true);
//       }
//     };
//     const onLoadedData = async () => {
//       if (!ready) {
//         await fetchProgressAndSeek();
//         setReady(true);
//       }
//     };

//     const onTimeUpdate = () => saveProgress(false, "tick");
//     const onPause = () => saveProgress(true, "pause");
//     const onEndedNative = () => {
//       saveProgress(true, "ended");
//       try { onEnded && onEnded(); } catch {}
//     };
//     const onVisibility = () => { if (document.hidden) saveProgress(true, "hidden"); };
//     const onBeforeUnload = () => saveProgress(true, "beforeunload");
//     const onPageHide = () => saveProgress(true, "pagehide");

//     if (v.readyState >= 1 /* HAVE_METADATA */) {
//       onLoadedMeta();
//     } else {
//       v.addEventListener("loadedmetadata", onLoadedMeta);
//       v.addEventListener("loadeddata", onLoadedData);
//     }

//     v.addEventListener("timeupdate", onTimeUpdate);
//     v.addEventListener("pause", onPause);
//     v.addEventListener("ended", onEndedNative);
//     document.addEventListener("visibilitychange", onVisibility);
//     window.addEventListener("beforeunload", onBeforeUnload);
//     window.addEventListener("pagehide", onPageHide);

//     return () => {
//       saveProgress(true, "unmount");

//       v.removeEventListener("loadedmetadata", onLoadedMeta);
//       v.removeEventListener("loadeddata", onLoadedData);
//       v.removeEventListener("timeupdate", onTimeUpdate);
//       v.removeEventListener("pause", onPause);
//       v.removeEventListener("ended", onEndedNative);
//       document.removeEventListener("visibilitychange", onVisibility);
//       window.removeEventListener("beforeunload", onBeforeUnload);
//       window.removeEventListener("pagehide", onPageHide);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [fetchProgressAndSeek, saveProgress, ready, onEnded, src, lessonId]);

//   if (!src) return <p className="text-danger">Video source missing.</p>;

//   return (
//     <video
//       ref={videoRef}
//       src={src}
//       controls
//       playsInline
//       controlsList="nofullscreen"
//       autoPlay={autoPlay}
//       style={{ width: "100%", maxHeight: 480, background: "#000" }}
//       // Do NOT pass onEnded here to avoid double-calling; we already invoke it in the DOM 'ended' listener.
//       {...rest}
//     />
//   );
// }





// import React, { useRef, useEffect, useCallback, useContext, useState } from "react";
// import { AuthContext } from "../../../context/AuthContext";

// // ✅ Centralized axios wrapper
// import API from "../../../../api/axios";
// import { getLessonProgress, putLessonProgress } from "../../../../utils/ProgressApi";

// export default function TrackedVideo({
//   src,
//   courseSlug = "",
//   sectionId = "",
//   lessonId = "",
//   autoPlay = false,
//   onEnded, // invoked from our DOM 'ended' listener
//   persistDurationIfKnown = true,
//   ...rest
// }) {
//   const { user } = useContext(AuthContext) || {};
//   const userId =
//     user?.id || user?._id || JSON.parse(localStorage.getItem("user") || "{}")?.id;
//   const roleRaw = user?.role || JSON.parse(localStorage.getItem("user") || "{}")?.role;
//   const role = String(roleRaw || "").toLowerCase();
//   const isAdminOrTeacher = role === "admin" || role === "teacher";
//   const isStudent = !isAdminOrTeacher;

//   const videoRef = useRef(null);
//   const lastSavedMsRef = useRef(0);
//   const lastSentSecRef = useRef(-1);
//   const lastSentCompletedRef = useRef(false);
//   const didPatchDurationRef = useRef(false);

//   const [ready, setReady] = useState(false);

//   // Reset state when video source or lesson changes
//   useEffect(() => {
//     setReady(false);
//     lastSavedMsRef.current = 0;
//     didPatchDurationRef.current = false;
//     lastSentSecRef.current = -1;
//     lastSentCompletedRef.current = false;
//   }, [src, lessonId]);

//   // ---------------------------------------------------------------------------
//   // Helpers
//   // ---------------------------------------------------------------------------
//   const seekSafely = useCallback((el, targetSec) => {
//     if (!el || targetSec == null) return;

//     const applySeek = () => {
//       const dur = Number(el.duration);
//       const hasDur = Number.isFinite(dur) && dur > 0;
//       const maxSafe = hasDur ? Math.max(0, dur - 0.5) : Number.MAX_SAFE_INTEGER;
//       const clamped = Math.max(0, Math.min(Number(targetSec) || 0, maxSafe));

//       let attempts = 0;
//       const maxAttempts = 5;
//       const trySeek = () => {
//         attempts += 1;
//         try {
//           el.currentTime = clamped;
//         } catch {}
//         requestAnimationFrame(() => {
//           const delta = Math.abs((el.currentTime || 0) - clamped);
//           if (delta < 0.35 || attempts >= maxAttempts) return;
//           trySeek();
//         });
//       };
//       trySeek();
//     };

//     if (el.readyState >= 1 /* HAVE_METADATA */) {
//       applySeek();
//     } else {
//       const onMeta = () => {
//         el.removeEventListener("loadedmetadata", onMeta);
//         el.removeEventListener("loadeddata", onMeta);
//         applySeek();
//       };
//       el.addEventListener("loadedmetadata", onMeta);
//       el.addEventListener("loadeddata", onMeta);
//     }
//   }, []);

//   const fetchProgressAndSeek = useCallback(async () => {
//     if (!lessonId || !userId) return;
//     try {
//       const saved = await getLessonProgress(lessonId);
//       if (!saved) return;

//       const v = videoRef.current;
//       if (!v) return;

//       const serverCompleted = Boolean(saved?.completed);
//       const serverTime = Number(saved?.currentTime || 0);

//       if (serverCompleted) {
//         seekSafely(v, 0);
//         return;
//       }
//       if (!Number.isNaN(serverTime) && serverTime > 0) {
//         seekSafely(v, serverTime);
//       }
//     } catch {
//       // ignore; default to 0
//     }
//   }, [lessonId, userId, seekSafely]);

//   const saveProgress = useCallback(
//     async (force = false, reason = "tick") => {
//       if (!isStudent) return;
//       const v = videoRef.current;
//       if (!v || !lessonId || !userId) return;
//       if (v.readyState < 1 /* HAVE_METADATA */) return;

//       const now = Date.now();
//       if (!force && now - lastSavedMsRef.current < 4000) return; // throttle to 4s
//       lastSavedMsRef.current = now;

//       const current = Math.floor(v.currentTime || 0);
//       const dur = Math.floor(v.duration || 0);
//       if (dur === 0) return;

//       const completed = reason === "ended";

//       if (!completed && current === lastSentSecRef.current) return;
//       if (!force && current <= 0) return;

//       const payload = {
//         courseSlug,
//         sectionId,
//         lessonId,
//         currentTime: current,
//         duration: dur,
//         completed,
//         lastSource: reason.startsWith("ended") ? "video:end" : "video",
//       };

//       try {
//         await putLessonProgress(payload);
//         lastSentSecRef.current = current;
//         if (completed) lastSentCompletedRef.current = true;
//       } catch {
//         // non-blocking
//       }
//     },
//     [courseSlug, sectionId, lessonId, userId, isStudent]
//   );

//   // ---------------------------------------------------------------------------
//   // Persist duration to backend (PATCH once)
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     const v = videoRef.current;
//     if (!v || !lessonId || !persistDurationIfKnown) return;

//     const patchIfPossible = async () => {
//       if (didPatchDurationRef.current) return;
//       const d = Number.isFinite(v.duration) ? Math.round(v.duration) : 0;
//       if (d > 0) {
//         didPatchDurationRef.current = true;
//         try {
//           await API.patch(`/api/courses/lessons/${lessonId}/duration`, { duration: d });
//         } catch (e) {
//           console.warn("❌ Could not persist duration:", e?.response?.data || e.message);
//         }
//       }
//     };

//     if (v.readyState >= 1 /* HAVE_METADATA */) {
//       patchIfPossible();
//     } else {
//       const onMeta = () => {
//         v.removeEventListener("loadedmetadata", onMeta);
//         patchIfPossible();
//       };
//       v.addEventListener("loadedmetadata", onMeta);
//       return () => v.removeEventListener("loadedmetadata", onMeta);
//     }
//   }, [lessonId, persistDurationIfKnown, src]);

//   // ---------------------------------------------------------------------------
//   // Wire DOM event listeners
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     const v = videoRef.current;
//     if (!v) return;

//     const onLoadedMeta = async () => {
//       if (!ready) {
//         await fetchProgressAndSeek();
//         setReady(true);
//       }
//     };
//     const onLoadedData = async () => {
//       if (!ready) {
//         await fetchProgressAndSeek();
//         setReady(true);
//       }
//     };

//     const onTimeUpdate = () => saveProgress(false, "tick");
//     const onPause = () => saveProgress(true, "pause");
//     const onEndedNative = () => {
//       saveProgress(true, "ended");
//       try {
//         onEnded && onEnded();
//       } catch {}
//     };
//     const onVisibility = () => {
//       if (document.hidden) saveProgress(true, "hidden");
//     };
//     const onBeforeUnload = () => saveProgress(true, "beforeunload");
//     const onPageHide = () => saveProgress(true, "pagehide");

//     if (v.readyState >= 1 /* HAVE_METADATA */) {
//       onLoadedMeta();
//     } else {
//       v.addEventListener("loadedmetadata", onLoadedMeta);
//       v.addEventListener("loadeddata", onLoadedData);
//     }

//     v.addEventListener("timeupdate", onTimeUpdate);
//     v.addEventListener("pause", onPause);
//     v.addEventListener("ended", onEndedNative);
//     document.addEventListener("visibilitychange", onVisibility);
//     window.addEventListener("beforeunload", onBeforeUnload);
//     window.addEventListener("pagehide", onPageHide);

//     return () => {
//       saveProgress(true, "unmount");

//       v.removeEventListener("loadedmetadata", onLoadedMeta);
//       v.removeEventListener("loadeddata", onLoadedData);
//       v.removeEventListener("timeupdate", onTimeUpdate);
//       v.removeEventListener("pause", onPause);
//       v.removeEventListener("ended", onEndedNative);
//       document.removeEventListener("visibilitychange", onVisibility);
//       window.removeEventListener("beforeunload", onBeforeUnload);
//       window.removeEventListener("pagehide", onPageHide);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [fetchProgressAndSeek, saveProgress, ready, onEnded, src, lessonId]);

//   // ---------------------------------------------------------------------------
//   // Render
//   // ---------------------------------------------------------------------------
//   if (!src) return <p className="text-danger">Video source missing.</p>;

//   return (
//     <video
//       ref={videoRef}
//       src={src}
//       controls
//       playsInline
//       controlsList="nofullscreen"
//       autoPlay={autoPlay}
//       style={{ width: "100%", maxHeight: 480, background: "#000" }}
//       {...rest}
//     />
//   );
// }




import React, { useRef, useEffect, useCallback, useState } from "react";
 import { useAuth } from '../../../../../LoginSystem/context/AuthContext';
 import API from "../../../../../LoginSystem/axios";
 import {
  markLessonComplete,
  putLessonProgress,
  getLessonProgress,
} from "../../../../../utils/ProgressApi.js";
export default function TrackedVideo({
  src,
  courseSlug = "",
  sectionId = "",
  lessonId = "",
  autoPlay = false,
  onEnded,
  persistDurationIfKnown = true,
  ...rest
}) {
  const { user } = useAuth() || {};
  const userId = user?.id || user?._id || JSON.parse(localStorage.getItem("user") || "{}")?.id;
  const role = String(user?.role || JSON.parse(localStorage.getItem("user") || "{}")?.role || "").toLowerCase();
  const isStudent = !(role === "admin" || role === "teacher");

  const videoRef = useRef(null);
  const lastSavedMsRef = useRef(0);
  const lastSentSecRef = useRef(-1);
  const didPatchDurationRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    lastSavedMsRef.current = 0;
    didPatchDurationRef.current = false;
    lastSentSecRef.current = -1;
  }, [src, lessonId]);

  // Seek safely
  const seekSafely = useCallback((el, targetSec) => {
    if (!el || targetSec == null) return;
    const applySeek = () => {
      const dur = Number(el.duration);
      const hasDur = Number.isFinite(dur) && dur > 0;
      const maxSafe = hasDur ? Math.max(0, dur - 0.5) : Number.MAX_SAFE_INTEGER;
      const clamped = Math.max(0, Math.min(Number(targetSec) || 0, maxSafe));
      let attempts = 0;
      const trySeek = () => {
        attempts++; try { el.currentTime = clamped; } catch {}
        requestAnimationFrame(() => {
          const delta = Math.abs((el.currentTime || 0) - clamped);
          if (delta < 0.35 || attempts >= 5) return;
          trySeek();
        });
      };
      trySeek();
    };
    if (el.readyState >= 1) applySeek();
    else {
      const onMeta = () => { el.removeEventListener("loadedmetadata", onMeta); applySeek(); };
      el.addEventListener("loadedmetadata", onMeta);
    }
  }, []);

  // Restore progress
  const fetchProgressAndSeek = useCallback(async () => {
    if (!lessonId || !userId) return;
    try {
      const saved = await getLessonProgress(lessonId);
      const v = videoRef.current;
      if (!v || !saved) return;
      if (saved?.completed) { seekSafely(v, 0); return; }
      const sec = Number(saved?.currentTime || 0);
      if (!isNaN(sec) && sec > 0) seekSafely(v, sec);
    } catch {}
  }, [lessonId, userId, seekSafely]);

  // Save progress
  const saveProgress = useCallback(async (force = false, reason = "tick") => {
    if (!isStudent) return;
    const v = videoRef.current;
    if (!v || !lessonId || !userId || v.readyState < 1) return;

    const now = Date.now();
    if (!force && now - lastSavedMsRef.current < 4000) return;
    lastSavedMsRef.current = now;

    const current = Math.floor(v.currentTime || 0);
    const dur = Math.floor(v.duration || 0);
    if (dur === 0) return;

    const completed = reason === "ended";
    if (!completed && current === lastSentSecRef.current) return;

    try {
      await putLessonProgress({ courseSlug, sectionId, lessonId, currentTime: current, duration: dur, completed, lastSource: reason });
      lastSentSecRef.current = current;
    } catch {}
  }, [courseSlug, sectionId, lessonId, userId, isStudent]);

  // Persist duration once
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !lessonId || !persistDurationIfKnown) return;
    const patchIfPossible = async () => {
      if (didPatchDurationRef.current) return;
      const d = Number.isFinite(v.duration) ? Math.round(v.duration) : 0;
      if (d > 0) {
        didPatchDurationRef.current = true;
        try { await API.patch(`/api/courses/lessons/${lessonId}/duration`, { duration: d }); } catch {}
      }
    };
    if (v.readyState >= 1) patchIfPossible();
    else { v.addEventListener("loadedmetadata", patchIfPossible, { once: true }); }
  }, [lessonId, persistDurationIfKnown, src]);

  // Attach events
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = async () => { if (!ready) { await fetchProgressAndSeek(); setReady(true); } };
    const onTime = () => saveProgress(false, "tick");
    const onPause = () => saveProgress(true, "pause");
    const onEnd = () => { saveProgress(true, "ended"); onEnded?.(); };
    const onVisibility = () => { if (document.hidden) saveProgress(true, "hidden"); };
    const onUnload = () => saveProgress(true, "unload");

    if (v.readyState >= 1) onLoaded(); else v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnd);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onUnload);
    window.addEventListener("pagehide", onUnload);

    return () => {
      saveProgress(true, "unmount");
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnd);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onUnload);
      window.removeEventListener("pagehide", onUnload);
    };
  }, [fetchProgressAndSeek, saveProgress, onEnded, src, lessonId, ready]);

  if (!src) return <p className="text-danger">Video source missing.</p>;

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      playsInline
      controlsList="nofullscreen"
      autoPlay={autoPlay}
      style={{ width: "100%", maxHeight: 480, background: "#000" }}
      {...rest}
    />
  );
}
