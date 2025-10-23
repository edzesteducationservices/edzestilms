import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import API from '../../../../../LoginSystem/axios';
import { putLessonProgress } from '../../../../../utils/ProgressApi';
export default function CustomVideoPlayer({
  src,
  autoPlay = true,
  poster,
  lessonId,
  courseSlug,
  fullscreenTargetRef,
  onEnded,       // parent ko call karna ho to
  onProgress,    // NEW: parent ko live percent dena (UI ring refresh)
}) {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [localPct, setLocalPct] = useState(0);

  // unique watched seconds (seek/rewind safe)
  const watched = useRef(new Set());
  const lastSentPct = useRef(0); // 0, 50, 95, 100 checkpoints

  // mount: HLS attach / normal src
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls;
    const attach = () => {
      if (src && Hls.isSupported() && /\.m3u8($|\?)/i.test(src)) {
        hls = new Hls({ autoStartLoad: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (src) {
        video.src = src;
      }
      if (autoPlay) {
        video.play().catch(() => {});
      }
    };

    attach();
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, autoPlay]);

  const onLoaded = useCallback(() => {
    const d = Math.floor(videoRef.current?.duration || 0);
    setDuration(d);
  }, []);

  // compute & maybe send progress
  const handleTimeUpdate = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    const d = Math.floor(v.duration || duration || 0);
    const t = Math.floor(v.currentTime || 0);
    if (!d) return;

    // mark watched second
    watched.current.add(Math.max(0, Math.min(t, d)));

    // compute unique % watched
    const pct = Math.round((watched.current.size / Math.max(d, 1)) * 100);
    setLocalPct(pct);
    onProgress?.(pct); // parent UI ko live % do

    // server checkpoints: 50%, 95%, ended (100)
    const shouldSend50 = pct >= 50 && lastSentPct.current < 50;
    const shouldSend95 = pct >= 95 && lastSentPct.current < 95;

    if (shouldSend50 || shouldSend95) {
      try {
        await putLessonProgress({
          lessonId,
          courseSlug,
          watchedSeconds: watched.current.size,
          duration: d,
          percent: pct,
        });
        lastSentPct.current = shouldSend95 ? 95 : 50;
      } catch (e) {
        // ignore network blips
      }
    }
  }, [courseSlug, lessonId, duration, onProgress]);

  const handleEnded = useCallback(async () => {
    const v = videoRef.current;
    const d = Math.floor(v?.duration || duration || 0);
    // force 100
    watched.current = new Set(Array.from({ length: d }, (_, i) => i + 1));
    setLocalPct(100);
    onProgress?.(100);

    try {
      await putLessonProgress({
        lessonId,
        courseSlug,
        watchedSeconds: d,
        duration: d,
        percent: 100,
        completed: true,
      });
      lastSentPct.current = 100;
    } catch (e) {}
    onEnded?.();
  }, [courseSlug, lessonId, duration, onEnded, onProgress]);

  return (
    <div>
      <video
        ref={videoRef}
        poster={poster}
        controls
        playsInline
        onLoadedMetadata={onLoaded}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        style={{ width: "100%", borderRadius: "10px" }}
      />
      <div style={{ fontSize: 12, color: "#777", marginTop: 6 }}>
        ⏱ Duration: {Math.floor(duration / 60)}m {Math.round(duration % 60)}s • Watched: {localPct}%
      </div>
    </div>
  );
}
