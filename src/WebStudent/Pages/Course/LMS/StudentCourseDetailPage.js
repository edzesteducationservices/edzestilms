
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaChevronDown, FaChevronRight, FaPlayCircle,
  FaHeadphones, FaFileAlt, FaQuestionCircle, FaBroadcastTower
} from "react-icons/fa";
import { coerceToSeconds, formatDuration } from "./LessonPreview";
// ✅ Progress helper (keep the path you’re already using)
import { getCourseProgress } from '../../../../utils/ProgressApi';

// ✅ use centralized API wrapper
import API from '../../../../LoginSystem/axios';

const TYPE_ICON = {
  video: <FaPlayCircle className="text-primary" />,
  audio: <FaHeadphones className="text-primary" />,
  article: <FaFileAlt className="text-secondary" />,
  quiz: <FaQuestionCircle className="text-warning" />,
  live: <FaBroadcastTower className="text-danger" />,
};
const iconFor = (t) => TYPE_ICON[String(t || "").toLowerCase()] || <FaFileAlt className="text-muted" />;


// consider video/audio “timed”
const isTimed = (lesson) => ["video", "audio"].includes(String(lesson?.type || "").toLowerCase());

// Probe a lot of fields to find a duration (unchanged)
const getSecs = (lesson) => {
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
    const s = coerceToSeconds(c);
    if (s != null && s > 0) return s;
  }
  return null;
};

/** Lightweight duration probe (unchanged) */
function DurationBadge({ lesson }) {
  const initial = useMemo(() => getSecs(lesson), [lesson]);
  const [secs, setSecs] = useState(initial);

  useEffect(() => {
    if (secs || !lesson) return;

    const t = String(lesson?.type || "").toLowerCase();
    if (!["video", "audio"].includes(t)) return;

    const url = lesson?.videoUrl || lesson?.fileUrl;
    if (!url) return;

    const el = document.createElement(t === "audio" ? "audio" : "video");
    el.preload = "metadata";
    el.src = url;

    const onMeta = async () => {
      const d = Number.isFinite(el.duration) ? Math.round(el.duration) : 0;
      if (d > 0) {
        setSecs(d);
        try {
          await API.patch(`/api/courses/lessons/${lesson._id}/duration`, {
            duration: d,
          });
        } catch {/* best-effort only */}
      }
      el.remove();
    };
    const onError = () => el.remove();

    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("error", onError);
    document.body.appendChild(el);

    return () => {
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("error", onError);
      el.remove();
    };
  }, [lesson, secs]);

  if (!secs) return null;
  return <div className="text-muted small">{formatDuration(secs)}</div>;
}

const StudentCourseDetailPage = () => {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [expandedSectionId, setExpandedSectionId] = useState(null);

  // ✅ Progress state (percent + completed ids)
  const [progress, setProgress] = useState({ percent: 0, completedLessonIds: [] });

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/api/courses/${courseSlug}`);
        setCourse(res.data.course);
      } catch (e) {
        console.error("Error fetching course:", e?.response?.data || e.message);
      }
    })();
  }, [courseSlug]);

  // ✅ Fetch course progress once course is known
 const refreshCourseProgress = useCallback(async () => {
  try {
    if (!course?.slug) return;

    const p = await getCourseProgress(course.slug);

    // UI total from sections
    const uiTotal = Array.isArray(course?.sections)
      ? course.sections.reduce(
          (sum, s) => sum + (Array.isArray(s?.lessons) ? s.lessons.length : 0),
          0
        )
      : 0;

    if (p) {
      const completed =
        Number(p?.completedLessons) ||
        (Array.isArray(p?.completedLessonIds) ? p.completedLessonIds.length : 0);

      const total = Math.max(
        Number(uiTotal) || 0,          // ✅ UI का सही total
        Number(p?.totalLessons) || 0,  // ✅ backend वाला (अगर मिला)
        1
      );

      const computedPercent = Math.round((completed / total) * 100);

      setProgress({
        percent: computedPercent,
        completedLessonIds: p.completedLessonIds || [],
      });

      console.log(`[Progress] ${completed}/${total} lessons → ${computedPercent}%`);
    }
  } catch (e) {
    console.warn("progress fetch failed:", e?.response?.data || e.message);
  }
}, [course?.slug, course?.sections]);

  useEffect(() => {
    refreshCourseProgress();
  }, [refreshCourseProgress]);

  const toggleSection = (sid) => setExpandedSectionId((p) => (p === sid ? null : sid));

  if (!course) return <p className="text-center mt-5">Loading…</p>;

  // per-lesson right-side meta (unchanged)
 const renderRightMeta = (lesson) => {
  const t = String(lesson?.type || "").toLowerCase();

  // ✅ Only show duration if it's more than 2 seconds
  if (isTimed(lesson)) {
    const savedSecs = getSecs(lesson);
    if (!savedSecs || savedSecs <= 2) return null; // 🟢 hide 0m 1s and similar
    return <div className="text-muted small">{formatDuration(savedSecs)}</div>;
  }

  if (t === "article") {
    const reading = lesson?.meta?.readingTimeMinutes;
    return reading ? <div className="text-muted small">~{reading} min</div> : null;
  }

  if (t === "live") {
    const starts = lesson?.meta?.startsAtISO ? new Date(lesson.meta.startsAtISO) : null;
    return starts ? <div className="text-muted small">{starts.toLocaleString()}</div> : null;
  }

  return null;
};


  // ✅ quick helper to know if lesson is completed for the current user
  const isCompleted = (lessonId) =>
    progress?.completedLessonIds?.includes(String(lessonId));

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-1">{course.title}</h2>
      <div className="text-muted mb-3">
        {course.subtitle ? <span>{course.subtitle} • </span> : null}
        {course.level ? <span>{String(course.level).toUpperCase()}</span> : null}
        {Array.isArray(course.tags) && course.tags.length ? (
          <span> • {course.tags.slice(0, 5).join(", ")}</span>
        ) : null}
      </div>

      {/* ✅ Tiny rounded course progress bar (visual only; logic unchanged) */}
    <div className="mb-4">
  <div className="d-flex justify-content-between align-items-center mb-1">
    <span className="text-muted">Your progress</span>
    <span className="fw-semibold">{progress.percent || 0}%</span>
  </div>

  {/* long, full-width progress bar */}
  <div className="progress" style={{ height: 12 }}>
    <div
      className="progress-bar"
      role="progressbar"
      style={{
        width: `${progress.percent || 0}%`,
        transition: "width .35s ease",
      }}
      aria-valuenow={progress.percent || 0}
      aria-valuemin="0"
      aria-valuemax="100"
    />
  </div>
</div>

      {course.sections?.map((section, idx) => (
        <div key={section._id} className="mb-3 border rounded">
          <div
            className="d-flex justify-content-between align-items-center bg-light px-3 py-2"
            onClick={() => toggleSection(section._id)}
            style={{ cursor: "pointer" }}
          >
            <h6 className="mb-0 fw-bold">
              {String(idx + 1).padStart(2, "0")} {section.title}
            </h6>
            <div className="text-muted small d-flex align-items-center gap-2">
              <span>{section.lessons?.length || 0} Lessons</span>
              {expandedSectionId === section._id ? <FaChevronDown /> : <FaChevronRight />}
            </div>
          </div>

          {expandedSectionId === section._id && (
            <div className="list-group list-group-flush">
              {section.lessons?.map((lesson) => {
                const completed = isCompleted(lesson._id);
                return (
                  <div
                    key={lesson._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    onClick={() => navigate(`/learn/${course.slug}/${section._id}/${lesson._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {/* ✅ small completed dot (visual only) */}
                      <span
                        title={completed ? "Completed" : "Not completed"}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: completed ? "#10B981" : "#E5E7EB",
                          display: "inline-block",
                        }}
                      />
                      {iconFor(lesson.type)}
                      <div>
                        <div className="fw-medium">{lesson.title}</div>
                      </div>
                    </div>
                    {renderRightMeta(lesson)}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentCourseDetailPage;
