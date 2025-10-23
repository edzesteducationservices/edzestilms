// src/utils/ProgressApi.js
import API from "../LoginSystem/axios";

/* -------------------------------------------------------------------------- */
/*                            CONFIG & UTIL HELPERS                            */
/* -------------------------------------------------------------------------- */

export const PROG_ENABLED =
  String(process.env.REACT_APP_PROGRESS_ENABLED ?? "true").toLowerCase() !== "false";

// no-op helper for disabled mode
const ok = (x = {}) => Promise.resolve(x);

// Try to infer course slug from URL like /learn/course/<slug>/...
function inferCourseSlugFromURL() {
  try {
    const m = window.location.pathname.match(/\/learn\/course\/([^/]+)/i);
    return m ? m[1] : undefined;
  } catch {
    return undefined;
  }
}

/* -------------------------------------------------------------------------- */
/*                           MAIN PROGRESS ENDPOINTS                           */
/* -------------------------------------------------------------------------- */

/**
 * ✅ PUT: fractional progress for a lesson (e.g., 50%, 95%, etc.)
 * Backend: PUT /api/video-progress/:lessonId
 */
export async function putLessonProgress({
  lessonId,
  courseSlug,
  watchedSeconds,
  duration,
  percent,
  completed,
}) {
  if (!PROG_ENABLED) return ok({ percent: 0 });

  const { data } = await API.put(`/api/video-progress/${lessonId}`, {
    courseSlug,
    watchedSeconds,
    duration,
    percent,
    completed,
  });

  return data; // { ok, percent, completed, ... }
}

/**
 * ✅ GET: overall course progress (0–100) including total/completed count
 * Backend: GET /api/video-progress/course/:courseSlug?totalLessons=n
 */
export async function getCourseProgress(courseSlug, totalLessons) {
  if (!PROG_ENABLED) return ok({ percent: 0 });

  const slug = courseSlug ?? inferCourseSlugFromURL();

  const params = {};
  if (Number.isFinite(totalLessons) && totalLessons > 0) {
    params.totalLessons = totalLessons;
  }

  const { data } = await API.get(`/api/video-progress/course/${encodeURIComponent(slug)}`, {
    params,
    validateStatus: (s) => s < 500,
  });

  return data; // { ok, percent, totalLessons, completedLessons, completedLessonIds }
}

/* -------------------------------------------------------------------------- */
/*                           LEGACY COMPATIBILITY                              */
/* -------------------------------------------------------------------------- */

/**
 * Legacy alias: markLessonComplete(lessonId, completed=true, courseSlug?)
 * Uses same backend endpoint as putLessonProgress()
 */
export async function markLessonComplete(lessonId, completed = true, maybeCourseSlug) {
  if (!PROG_ENABLED) return ok({ percent: completed ? 100 : 0 });

  const courseSlug = maybeCourseSlug ?? inferCourseSlugFromURL();

  return putLessonProgress({
    lessonId,
    courseSlug,
    percent: completed ? 100 : 0,
    completed: !!completed,
  });
}

/**
 * Legacy alias: getLessonProgress(lessonId)
 * Some pages expect { currentTime, duration, completed, percent }.
 * Backend: GET /api/video-progress?lessonId=...
 */
export async function getLessonProgress(lessonId) {
  if (!PROG_ENABLED) {
    return ok({ currentTime: 0, duration: 0, completed: false, percent: 0 });
  }

  const { data } = await API.get(`/api/video-progress`, {
    params: { lessonId },
    validateStatus: (s) => s < 500,
  });

  const d = data?.data || {};
  return {
    currentTime: 0, // (future: resume playback position)
    duration: Number(d.duration || 0),
    completed: !!d.completed,
    percent: Number(d.percent || 0),
  };
}
