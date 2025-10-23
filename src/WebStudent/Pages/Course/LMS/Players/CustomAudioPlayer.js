import React, { useEffect, useRef, useState } from "react";
import "./player.css";

export default function CustomAudioPlayer({ src, autoPlay=true, onEnded, lessonId, courseSlug }) {
  const API = process.env.REACT_APP_API_URL || "";
  const aRef = useRef(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const a = aRef.current;
    if (!a) return;
    const onMeta = () => setDuration(Number.isFinite(a.duration) ? a.duration : 0);
    const onTime = () => setTime(a.currentTime||0);
    const onEnd  = () => { setPlaying(false); onEnded && onEnded(); };

    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    if (autoPlay) a.play().catch(() => setPlaying(false));
    return () => {
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
    };
  }, [autoPlay, onEnded]);

  // save progress (fire & forget; mirrors video)
  useEffect(() => {
    if (!lessonId) return;
    const id = setTimeout(() => {
      fetch(`${API}/api/video-progress`, {
        method: "POST",
        headers: hdr(),
        body: JSON.stringify({ lessonId, courseSlug, seconds: Math.floor(time) }),
      }).catch(() => {});
    }, 700);
    return () => clearTimeout(id);
  }, [time, lessonId, courseSlug]);

  const toggle = () => {
    const a = aRef.current; if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)); else { a.pause(); setPlaying(false); }
  };

  return (
    <div className="custom-player" style={{ padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button className="cp-btn" onClick={toggle}>{playing ? "⏸" : "▶"}</button>
        <input
          type="range"
          min={0}
          max={Math.max(1, duration)}
          step="0.1"
          value={Math.min(time, duration||0)}
          onChange={(e) => { const t = Number(e.target.value); aRef.current.currentTime = t; setTime(t); }}
          style={{ flex: 1 }}
        />
        <span className="cp-time">{fmt(time)} / {fmt(duration)}</span>
      </div>
      <audio ref={aRef} src={src} preload="metadata" />
    </div>
  );

  function fmt(s){const m=Math.floor(s/60),r=Math.floor(s%60);return `${m}:${String(r).padStart(2,"0")}`;}
  function hdr(){const t=localStorage.getItem("token");return {"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})};}
}
