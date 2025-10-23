// src/MockTest/page/LMS/LMS_Pages/LessonRenderer/index.jsx
import React, { useEffect, useState, useMemo } from "react";

import VideoLesson   from "./VideoLesson";
import AudioLesson   from "./AudioLesson";
import QuizLesson    from "./QuizLesson";
import LiveLesson    from "./LiveLesson";
import ArticleLesson    from "./ArticleLesson";
// ✅ IMPORTANT: Article component from types/


/* ---------- S3/CloudFront PDF को inline compel करने का helper ---------- */
function forceInlineForS3Pdf(u = "") {
  try {
    const url = new URL(u);
    const isSigned =
      /X-Amz-Algorithm/i.test(url.search) || /X-Amz-Credential/i.test(url.search);
    if (isSigned) {
      if (!/response-content-disposition=/i.test(url.search)) {
        url.searchParams.append("response-content-disposition", "inline");
      }
      if (!/response-content-type=/i.test(url.search)) {
        url.searchParams.append("response-content-type", "application/pdf");
      }
      return url.toString();
    }
    return u;
  } catch {
    return u;
  }
}

/* ============ PdfLesson (Slides/PPT/PDF safely) ============ */
function PdfLesson({ lesson }) {
  const pick = (v) => (typeof v === "string" ? v : v?.url || "");
  const startRaw = pick(lesson?.fileUrl) || pick(lesson?.url) || pick(lesson?.videoUrl);
  const [href, setHref] = useState(startRaw);

  useEffect(() => {
    let alive = true;
    const raw = pick(lesson?.fileUrl) || pick(lesson?.url) || pick(lesson?.videoUrl);
    setHref(raw);

    // sign endpoint हो तो real URL उठा लें
    if (typeof raw === "string" && raw.includes("/api/media/sign?")) {
      fetch(raw)
        .then((r) => r.json())
        .then((d) => { if (alive && d?.url) setHref(d.url); })
        .catch(() => {});
    }
    return () => { alive = false; };
  }, [lesson]);

  const isGoogleUrl = useMemo(
    () => /(^|\/\/)docs\.google\.com|drive\.google\.com/i.test(href || ""),
    [href]
  );
  const isPdf = useMemo(() => /\.pdf(?:$|\?)/i.test(href || ""), [href]);
  const isOffice = useMemo(
    () => /\.(pptx?|potx?|ppsx?)((\?|#).*)?$/i.test((href || "").split("?")[0]),
    [href]
  );

  if (!href) return <div className="alert alert-warning">File URL missing.</div>;

  // Google Docs/Drive/Slides embed नहीं होंगे → new tab
  if (isGoogleUrl) {
    return (
      <div className="p-3">
        <div className="alert alert-info mb-2">
          This file is hosted on Google Drive/Docs and can’t be embedded here.
        </div>
        <a className="btn btn-primary" href={href} target="_blank" rel="noreferrer">
          Open in new tab
        </a>
      </div>
    );
  }

  // PPT/PPTX → Microsoft Office viewer
  if (isOffice) {
    const officeViewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(href)}`;
    return (
      <iframe
        title={lesson?.title || "Slides"}
        src={officeViewer}
        style={{ width: "100%", height: "80vh", border: 0 }}
        allow="fullscreen"
      />
    );
  }

  // PDF → inline iframe (S3 inline forced)
  if (isPdf) {
    const inlineHref = forceInlineForS3Pdf(href);
    return (
      <iframe
        title={lesson?.title || "PDF"}
        src={`${inlineHref}#view=FitH`}
        style={{ width: "100%", height: "80vh", border: 0 }}
        allow="fullscreen"
      />
    );
  }

  // Unknown doc → open as link
  return (
    <div className="p-3">
      <div className="alert alert-secondary mb-2">Unsupported document type for inline view.</div>
      <a className="btn btn-outline-primary" href={href} target="_blank" rel="noreferrer">
        Open file
      </a>
    </div>
  );
}

/* ---------------- smart mapping ---------------- */
const norm = (t) => String(t || "").trim().toLowerCase();

/** Smart resolver:
 *  - 'article' शब्द आता है → ArticleLesson
 *  - pdf/slide/ppt/doc/file/scorm → PdfLesson
 *  - quiz/mock/test aliases → QuizLesson
 *  - url से .pdf मिले तो भी PdfLesson
 */
function pickRendererKey(lesson) {
  const t = norm(lesson?.type);
  const url = String(lesson?.fileUrl || lesson?.url || "");

  if (/article/.test(t)) return "article";
  if (/(pdf|slide|slides|pptx?|docx?|doc|file|scorm\/tincan|scorm|tincan)/.test(t)) return "pdf";
  if (/\.pdf(?:$|\?)/i.test(url)) return "pdf";

  if (/(quiz|mock[- _]?test|section[- _]?quiz|test)/.test(t)) return "quiz";
  if (/audio/.test(t)) return "audio";
  if (/video/.test(t)) return "video";
  if (/live/.test(t))  return "live";

  return t; // fallback
}

const RENDERERS = {
  video:   VideoLesson,
  audio:   AudioLesson,
  article: ArticleLesson,
  live:    LiveLesson,

  // docs
  pdf:     PdfLesson,
  slides:  PdfLesson,
  ppt:     PdfLesson,
  pptx:    PdfLesson,
  doc:     PdfLesson,
  file:    PdfLesson,
  "scorm/tincan": PdfLesson,

  // quiz / mock
  quiz: QuizLesson,
  test: QuizLesson,
  mocktest: QuizLesson,
  "mock-test": QuizLesson,
  "mock test": QuizLesson,
  "section quiz": QuizLesson,
  "section-quiz": QuizLesson,
  "section_quiz": QuizLesson,
  sectionquiz: QuizLesson,
};

const Fallback = ({ lesson }) => (
  <div className="alert alert-secondary">
    <div className="text-muted small">Type: {lesson?.type || "unknown"}</div>
    <p className="mb-0">No renderer registered yet for this type.</p>
  </div>
);

export default function LessonRenderer({ lesson, course, ...rest }) {
  const key = pickRendererKey(lesson);
  const Comp = RENDERERS[key] || Fallback;
  return <Comp lesson={lesson} course={course} {...rest} />;
}
