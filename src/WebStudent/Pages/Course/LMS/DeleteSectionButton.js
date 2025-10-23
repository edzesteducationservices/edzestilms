// // components/DeleteSectionButton.js
// import React from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// const DeleteSectionButton = ({ courseId, sectionId, onDeleted, className = "", children }) => {
//   const navigate = useNavigate();

//   const handleDelete = async () => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this section and all its lessons?");
//     if (!confirmDelete) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${REACT_APP_API_URL}/api/courses/${courseId}/section/${sectionId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert("✅ Section deleted successfully.");
//       if (onDeleted) {
//         onDeleted(); // parent can handle UI updates
//       } else {
//         navigate(`/course/${courseId}`);
//       }
//     } catch (err) {
//       console.error("❌ Failed to delete section:", err);
//       alert("Failed to delete section.");
//     }
//   };

//   return (
//     <button className={`btn btn-outline-danger ${className}`} onClick={handleDelete}>
//       {children || "Delete Section"}
//     </button>
//   );
// };

// export default DeleteSectionButton;




// components/DeleteEntityButton.js
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ use centralized API wrapper
// ✅ correct
import API from "../../../../LoginSystem/axios";


/**
 * Generic delete button for course/section/lesson.
 *
 * Props:
 * - deleteType: "course" | "section" | "lesson"   (default: "section")
 * - courseId:   required for all three
 * - sectionId:  required for section and lesson
 * - lessonId:   required for lesson
 * - onDeleted:  optional callback after success
 * - className, children: UI overrides
 */
export default function DeleteEntityButton({
  deleteType = "section",
  courseId,
  sectionId,
  lessonId,
  onDeleted,
  className = "btn btn-outline-danger",
  children,
}) {
  const navigate = useNavigate();

  
  // Try a list of endpoints in order until one succeeds (2xx/204)
  const tryDeleteInOrder = async (urls) => {
    let lastErr;
    for (const url of urls) {
       try {
        await API.delete(url);
        return true;
      } catch (err) {
        lastErr = err;
      }
    }
    if (lastErr) throw lastErr;
    return false;
  };

  // ----- Verify helpers (best-effort) -----

  const verifyCourseGone = async (cid) => {
    try {
      await API.get(`/api/courses/${cid}`);
      // GET worked => still exists
      return false;
    } catch (err) {
      return err?.response?.status === 404; // 404 => gone
    }
  };

  const verifySectionGoneFromCourse = async (cid, sid) => {
    try {
       const res = await API.get(`/api/courses/${cid}`);
      const course = res?.data?.course || res?.data;
      const stillThere =
        Array.isArray(course?.sections) &&
        course.sections.some((s) => String(s?._id) === String(sid));
      return !stillThere;
    } catch (err) {
      // 404 => course gone; treat section as gone
      return err?.response?.status === 404;
    }
  };

  const verifyLessonGoneFromCourse = async (cid, sid, lid) => {
    try {
      const res = await API.get(`/api/courses/${cid}`);
      const course = res?.data?.course || res?.data;
      const sec = (course?.sections || []).find(
        (s) => String(s?._id) === String(sid)
      );
      if (!sec) return true; // section gone => lesson effectively gone
      const stillThere =
        (sec.lessons || []).some((l) => String(l?._id) === String(lid));
      return !stillThere;
    } catch (err) {
      // 404 => course gone; treat lesson as gone
      return err?.response?.status === 404;
    }
  };

  // ----- Delete flows -----

  const deleteCourse = async () => {
    if (!courseId) {
      alert("Course ID is missing.");
      return;
    }
    const ok = window.confirm(
      "This will permanently delete the entire course and all its sections/lessons. Continue?"
    );
    if (!ok) return;

    await tryDeleteInOrder([
      `/api/courses/${courseId}?hard=true`,
      `/api/courses/${courseId}`,
    ]);

    const gone = await verifyCourseGone(courseId);
    if (!gone) {
      alert(
        "The course was removed from the UI, but it still appears to exist in the database. Please check server deletion."
      );
    } else {
      alert("✅ Course deleted successfully.");
    }

    if (typeof onDeleted === "function") onDeleted();
    else navigate(`/courses`);
  };

  const deleteSection = async () => {
    if (!courseId || !sectionId) {
      alert("Course ID or Section ID is missing.");
      return;
    }
    const ok = window.confirm(
      "Are you sure you want to delete this section and all its lessons?"
    );
    if (!ok) return;

    await tryDeleteInOrder([
      `/api/courses/${courseId}/section/${sectionId}?hard=true`,
      `/api/courses/sections/${sectionId}?hard=true`,
      `/api/courses/${courseId}/section/${sectionId}`,
    ]);

    const gone = await verifySectionGoneFromCourse(courseId, sectionId);
    if (!gone) {
      alert(
        "The section was removed from the UI, but it still appears to exist in the database. Please check server deletion."
      );
    } else {
      alert("✅ Section deleted successfully.");
    }

    if (typeof onDeleted === "function") onDeleted();
    else navigate(`/course/${courseId}`);
  };

  const deleteLesson = async () => {
    if (!courseId || !sectionId || !lessonId) {
      alert("Course/Section/Lesson ID is missing.");
      return;
    }
    const ok = window.confirm("Delete this lesson permanently?");
    if (!ok) return;

   await tryDeleteInOrder([
      `/api/courses/lessons/${lessonId}`,
      `/api/lessons/${lessonId}`,
    ]);

    const gone = await verifyLessonGoneFromCourse(courseId, sectionId, lessonId);
    if (!gone) {
      alert(
        "The lesson was removed from the UI, but it still appears to exist in the database. Please check server deletion."
      );
    } else {
      alert("✅ Lesson deleted.");
    }

    if (typeof onDeleted === "function") onDeleted();
    else navigate(0); // safe default refresh
  };

  const handleDelete = async () => {
    try {
      if (deleteType === "course") return await deleteCourse();
      if (deleteType === "lesson") return await deleteLesson();
      return await deleteSection();
    } catch (err) {
      console.error("❌ Delete failed:", err?.response?.data || err);
      const msg =
        err?.response?.data?.message || err?.message || "Delete failed.";
      alert(msg);
    }
  };

  const label =
    children ||
    (deleteType === "course"
      ? "Delete Course"
      : deleteType === "lesson"
      ? "Delete Lesson"
      : "Delete Section");

  return (
    <button className={className} onClick={handleDelete} title={label}>
      {label}
    </button>
  );
}
