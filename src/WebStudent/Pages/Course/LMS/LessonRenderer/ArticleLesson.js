// src/MockTest/page/LMS/LessonRenderer/ArticleLesson.jsx
import React, { useMemo, useEffect, useRef, useState } from "react";
import { getLessonProgress, markLessonComplete } from '../../../../../utils/ProgressApi';
import "../article-editor.css";

/* ---------------- helpers ---------------- */
const isHtmlDataUrl = (u = "") => /^data:text\/html[,;]/i.test(u);
const isUrl         = (s = "") => /^https?:\/\//i.test(s);
const isHtmlString  = (s = "") => /<\/?[a-z][\s\S]*>/i.test(s);
const isGoogleUrl   = (u = "") => /(^|\/\/)docs\.google\.com|drive\.google\.com/i.test(u);
const isPdfLike     = (u = "") => /\.pdf(?:$|\?)/i.test(u);
const isOfficeLike  = (u = "") => /\.(pptx?|potx?|ppsx?|docx?)((\?|#).*)?$/i.test((u || "").split("?")[0]);
const isHtmlPage    = (u = "") => /\.html?(?:$|\?)/i.test(u);
const isS3Url       = (u = "") => /amazonaws\.com/i.test(u);
const isCrossOrigin = (u = "") => {
  try { return new URL(u).origin !== window.location.origin; } catch { return false; }
};

export default function ArticleLesson({ lesson, fullscreenTargetRef }) {
  // html fields from DB (any of these may exist)
  const html     = lesson?.meta?.html || lesson?.html || lesson?.content || lesson?.body || "";
  const reading  = lesson?.meta?.readingTimeMinutes;

  // raw URL from lesson
  const rawUrl   = lesson?.fileUrl || lesson?.url || "";

  // ---------- resolve /api/media/sign? → real S3 URL ----------
  const [resolvedUrl, setResolvedUrl] = useState(rawUrl);

  useEffect(() => {
    let alive = true;
    const start = lesson?.fileUrl || lesson?.url || "";
    setResolvedUrl(start);

    if (typeof start === "string" && start.includes("/api/media/sign?")) {
      fetch(start)
        .then(r => r.json())
        .then(d => { if (alive && d?.url) setResolvedUrl(d.url); })
        .catch(() => {});
    }
    return () => { alive = false; };
  }, [lesson?.fileUrl, lesson?.url]);

  // ---------- fullscreen plumbing ----------
  const scrollerRef = useRef(null);
  const wrapRef     = useRef(null);

  const [isFs, setIsFs] = useState(
    !!(document.fullscreenElement || document.webkitFullscreenElement)
  );

  const fsEnabled = () =>
    Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled);

  const chooseFsTarget = () => {
    if (fullscreenTargetRef?.current) return fullscreenTargetRef.current;
    if (fsEnabled()) return document.documentElement;
    return wrapRef.current || document.documentElement;
  };

  const requestFs = async (el) => {
    try {
      if (!el) return false;
      if (!fsEnabled() && el === document.documentElement) return false;
      if (el.requestFullscreen) { await el.requestFullscreen(); return true; }
      if (el.webkitRequestFullscreen) { await el.webkitRequestFullscreen(); return true; }
    } catch {}
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
    if (activeEl && (activeEl === target || target?.contains?.(activeEl))) {
      await exitFs();
      return;
    }
    const ok = await requestFs(target);
    if (!ok && target !== wrapRef.current) await requestFs(wrapRef.current);
  };

  useEffect(() => {
    const sync = () => {
      const activeEl = document.fullscreenElement || document.webkitFullscreenElement;
      const target = chooseFsTarget();
      setIsFs(Boolean(activeEl && (activeEl === target || target?.contains?.(activeEl))));
    };
    sync();
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, [fullscreenTargetRef]);

  // ---------- progress: seed ----------
  const [completed, setCompleted] = useState(false);

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

  // ---------- progress: mark when scrolled ----------
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || completed) return;
    const onScroll = async () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight * 0.95;
      if (atBottom && !completed) {
        try { await markLessonComplete(lesson._id, true); setCompleted(true); } catch {}
      }
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [completed, lesson?._id]);

  // ---------- progress: fallback timer ----------
  useEffect(() => {
    if (completed) return;
    const mins = Number(reading) > 0 ? Number(reading) : 2;
    const ms = Math.min(Math.max(mins * 60 * 1000 * 0.5, 20000), 90000);
    const t = setTimeout(async () => {
      if (!completed) {
        try { await markLessonComplete(lesson._id, true); setCompleted(true); } catch {}
      }
    }, ms);
    return () => clearTimeout(t);
  }, [completed, reading, lesson?._id]);

  // ---------- decide how to render ----------
  const content = useMemo(() => {
    // 1) HTML string from DB
    if (html && isHtmlString(html)) return { mode: "html", value: html };

    // 2) data:text/html
    if (isHtmlDataUrl(resolvedUrl)) {
      try {
        const encoded = resolvedUrl.split(",")[1] || "";
        const decoded = decodeURIComponent(atob(encoded));
        return { mode: "html", value: decoded };
      } catch { return { mode: "frame", value: resolvedUrl }; }
    }

    // 3) URL based logic
    if (isUrl(resolvedUrl)) {
      // S3 की .html फाइलें: allow iframe (cross-origin होने पर भी)
      if (isHtmlPage(resolvedUrl) && isS3Url(resolvedUrl)) {
        return { mode: "frame", value: resolvedUrl };
      }

      // Google / other cross-origin: block iframe → links
      if (isGoogleUrl(resolvedUrl) || isCrossOrigin(resolvedUrl)) {
        if (isPdfLike(resolvedUrl) || isOfficeLike(resolvedUrl)) {
          return { mode: "doc", value: resolvedUrl };
        }
        return { mode: "link", value: resolvedUrl };
      }

      // Same-origin .html
      if (isHtmlPage(resolvedUrl)) return { mode: "frame", value: resolvedUrl };

      // Anything else → link
      return { mode: "link", value: resolvedUrl };
    }

    return { mode: "none", value: "" };
  }, [html, resolvedUrl]);

  // ---------- UI ----------
  const scrollerStyle = isFs
    ? { height: "100vh", overflow: "auto", borderRadius: 0 }
    : { maxHeight: 600, overflow: "auto", borderRadius: 6 };

  return (
    <div
      ref={wrapRef}
      className="lesson-overlay-wrap"
      onDoubleClickCapture={toggleFs}
      style={{ cursor: "zoom-in" }}
    >
      <h5 className="mb-2">{lesson?.title || "Article"}</h5>
      {reading ? <div className="text-muted small mb-2">~{reading} min read</div> : null}

      <div ref={scrollerRef} className="article-scroller" style={scrollerStyle}>
        {content.mode === "html" && (
          <div
            className="p-2"
            style={{ minHeight: isFs ? "100%" : undefined }}
            dangerouslySetInnerHTML={{ __html: content.value }}
          />
        )}

        {content.mode === "frame" && (
          <iframe
            title="article"
            src={content.value}
            style={{
              width: "100%",
              height: isFs ? "100%" : 600,
              border: "1px solid #e5e7eb",
              borderRadius: isFs ? 0 : 6,
              display: "block",
            }}
            allow="fullscreen"
            allowFullScreen
          />
        )}

        {content.mode === "doc" && (
          <div className="p-3">
            <div className="alert alert-secondary mb-2">
              This article points to a document (PDF/Office). Open it in a new tab.
            </div>
            <a className="btn btn-outline-primary" href={content.value} target="_blank" rel="noreferrer">
              Open document
            </a>
          </div>
        )}

        {content.mode === "link" && (
          <div className="p-3">
            <div className="alert alert-info mb-2">
              This article is hosted externally and can’t be embedded here.
            </div>
            <a className="btn btn-primary" href={content.value} target="_blank" rel="noreferrer">
              Open article in new tab
            </a>
          </div>
        )}

        {content.mode === "none" && (
          <div className="alert alert-info m-0">Article content not available.</div>
        )}
      </div>
    </div>
  );
}
