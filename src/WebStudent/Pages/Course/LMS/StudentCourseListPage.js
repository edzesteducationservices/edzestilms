// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// const StudentCourseListPage = () => {
//   const [courses, setCourses] = useState([]);


//     // Helper: prefer createdAt; fallback to ObjectId timestamp
//   const getCreatedDate = (course) => {
//     if (course?.createdAt) return new Date(course.createdAt);
//     if (course?._id && typeof course._id === "string" && course._id.length >= 8) {
//       const ts = parseInt(course._id.substring(0, 8), 16) * 1000;
//       return new Date(ts);
//     }
//     return new Date(0);
//   };

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${REACT_APP_API_URL}/api/courses/student-visible-courses`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const list = res.data.courses || [];

//         // ✅ Sort: published first, then newest first
//         const sorted = list.slice().sort((a, b) => {
//           const aPub = String(a.status || "").toLowerCase() === "published" ? 1 : 0;
//           const bPub = String(b.status || "").toLowerCase() === "published" ? 1 : 0;
//           if (aPub !== bPub) return bPub - aPub; // published first
//           return getCreatedDate(b) - getCreatedDate(a); // newest first
//         });

//         setCourses(sorted);
//       } catch (err) {
//         console.error("❌ Error fetching courses:", err);
//       }
//     };

//     fetchCourses();
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4 fw-bold">Available Courses</h2>
//       <div className="row">
//         {courses.length === 0 ? (
//           <p>No courses found.</p>
//         ) : (
//           courses.map((course) => (
//             <div className="col-md-4 mb-4" key={course._id}>
//               <Link
//                 to={`/student/course/${course._id}`}
//                 className="text-decoration-none text-dark"
//               >
//                 <div className="card h-100 shadow-sm rounded-4">
//                   <img
//                     src={
//                       course.thumbnail ||
//                       "https://via.placeholder.com/400x200.png?text=Course+Image"
//                     }
//                     className="card-img-top rounded-top-4"
//                     alt={course.title}
//                     style={{ height: "200px", objectFit: "cover" }}
//                   />
//                   <div className="card-body d-flex flex-column">
//                     <h5 className="card-title fw-semibold">{course.title}</h5>
//                     <p className="card-text text-muted">
//                       {course.sections?.reduce(
//                         (acc, sec) => acc + (sec.lessons?.length || 0),
//                         0
//                       )}{" "}
//                       Lessons
//                     </p>
//                     <p className="card-text fw-bold">
//                       {course.isFree ? (
//                         <span className="text-success">FREE</span>
//                       ) : (
//                         `₹ ${course.price}`
//                       )}
//                     </p>
//                     <div className="mt-auto">
//                       <span className="btn btn-outline-primary w-100">
//                         View Course
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentCourseListPage;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;


// // 🔧 Robust resolver: tries multiple fields and normalizes to a valid src
// function resolveCourseImage(course) {
//   const candidates = [
//     course?.image,
//     course?.thumbnail,
//     course?.wallpaperUrl,
//     course?.wallpaper,
//   ].filter((s) => typeof s === "string" && s.trim() !== "");

//   if (candidates.length === 0) {
//     return "https://via.placeholder.com/400x200.png?text=Course+Image";
//   }

//   const raw = candidates[0].trim();

//   // http(s)
//   if (/^https?:\/\//i.test(raw)) return raw;

//   // already a data URL
//   if (/^data:/i.test(raw)) return raw;

//   // backend static path (e.g., /uploads/xyz.jpg or uploads/xyz.jpg)
//   if (/^(\/)?uploads\//i.test(raw)) {
//     const path = raw.startsWith("/") ? raw : `/${raw}`;
//     return `${REACT_APP_API_URL}${path}`;
//   }

//   // looks like raw base64 (no spaces, long-ish)
//   if (/^[A-Za-z0-9+/=]+$/.test(raw) && raw.length > 100) {
//     return `data:image/*;base64,${raw}`;
//   }

//   // fallback (return as-is)
//   return raw || "https://via.placeholder.com/400x200.png?text=Course+Image";
// }

// const StudentCourseListPage = () => {
//   const [courses, setCourses] = useState([]);

//   // Helper: prefer createdAt; fallback to ObjectId timestamp
//   const getCreatedDate = (course) => {
//     if (course?.createdAt) return new Date(course.createdAt);
//     if (course?._id && typeof course._id === "string" && course._id.length >= 8) {
//       const ts = parseInt(course._id.substring(0, 8), 16) * 1000;
//       return new Date(ts);
//     }
//     return new Date(0);
//   };

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${REACT_APP_API_URL}/api/courses/student-visible-courses`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const list = res.data.courses || [];

//         // ✅ Sort: published first, then newest first
//         const sorted = list.slice().sort((a, b) => {
//           const aPub = String(a.status || "").toLowerCase() === "published" ? 1 : 0;
//           const bPub = String(b.status || "").toLowerCase() === "published" ? 1 : 0;
//           if (aPub !== bPub) return bPub - aPub; // published first
//           return getCreatedDate(b) - getCreatedDate(a); // newest first
//         });

//         setCourses(sorted);
//       } catch (err) {
//         console.error("❌ Error fetching courses:", err);
//       }
//     };

//     fetchCourses();
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4 fw-bold">Available Courses</h2>
//       <div className="row">
//         {courses.length === 0 ? (
//           <p>No courses found.</p>
//         ) : (
//           courses.map((course) => (
//             <div className="col-md-4 mb-4" key={course._id}>
//               <Link
//                 to={`/student/course/${course._id}`}
//                 className="text-decoration-none text-dark"
//               >
//                 <div className="card h-100 shadow-sm rounded-4">
//                   <img
//                     src={resolveCourseImage(course)}
//                     className="card-img-top rounded-top-4"
//                     alt={course.title}
//                     style={{ height: "200px", objectFit: "cover" }}
//                   />
//                   <div className="card-body d-flex flex-column">
//                     <h5 className="card-title fw-semibold">{course.title}</h5>
//                     <p className="card-text text-muted">
//                       {course.sections?.reduce(
//                         (acc, sec) => acc + (sec.lessons?.length || 0),
//                         0
//                       )}{" "}
//                       Lessons
//                     </p>
//                     <p className="card-text fw-bold">
//                       {course.isFree ? (
//                         <span className="text-success">FREE</span>
//                       ) : (
//                         `₹ ${course.price}`
//                       )}
//                     </p>
//                     <div className="mt-auto">
//                       <span className="btn btn-outline-primary w-100">
//                         View Course
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentCourseListPage;






































// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// // ✅ use centralized API wrapper
// import API from "../../../api/axios";

// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;


// // 🔧 Robust resolver: tries multiple fields and normalizes to a valid src
// function resolveCourseImage(course) {
//   const candidates = [
//     course?.image,
//     course?.thumbnail,
//     course?.wallpaperUrl,
//     course?.wallpaper,
//   ].filter((s) => typeof s === "string" && s.trim() !== "");

//   if (candidates.length === 0) {
//     return "https://via.placeholder.com/400x200.png?text=Course+Image";
//   }

//   const raw = candidates[0].trim();

//   // http(s)
//   if (/^https?:\/\//i.test(raw)) return raw;

//   // already a data URL
//   if (/^data:/i.test(raw)) return raw;

//   // backend static path (e.g., /uploads/xyz.jpg or uploads/xyz.jpg)
//   if (/^(\/)?uploads\//i.test(raw)) {
//     const path = raw.startsWith("/") ? raw : `/${raw}`;
//     return `${REACT_APP_API_URL}${path}`;
//   }

//   // looks like raw base64 (no spaces, long-ish)
//   if (/^[A-Za-z0-9+/=]+$/.test(raw) && raw.length > 100) {
//     return `data:image/*;base64,${raw}`;
//   }

//   // fallback (return as-is)
//   return raw || "https://via.placeholder.com/400x200.png?text=Course+Image";
// }

// // 🔧 Same normalizer used above
// const normalizeImageField = (course) => {
//   const img = course?.image;

//   if (img && typeof img === "object" && img.type === "Buffer" && Array.isArray(img.data)) {
//     try {
//       const bytes = new Uint8Array(img.data);

//       // Try decode as text first (maybe it's "data:image/...;base64,...")
//       let asText = "";
//       try {
//         asText = new TextDecoder().decode(bytes);
//       } catch (_) {}
//       if (asText && /^data:[^;]+;base64,/.test(asText)) {
//         return { ...course, image: asText };
//       }

//       // Otherwise, build a data URL from raw bytes
//       let binary = "";
//       for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
//       const b64 = window.btoa(binary);
//       const ct = course?.imageContentType || "image/*";
//       return { ...course, image: `data:${ct};base64,${b64}` };
//     } catch {
//       return course;
//     }
//   }

//   return course;
// };

// const StudentCourseListPage = () => {
//   const [courses, setCourses] = useState([]);

//   // Helper: prefer createdAt; fallback to ObjectId timestamp
//   const getCreatedDate = (course) => {
//     if (course?.createdAt) return new Date(course.createdAt);
//     if (course?._id && typeof course._id === "string" && course._id.length >= 8) {
//       const ts = parseInt(course._id.substring(0, 8), 16) * 1000;
//       return new Date(ts);
//     }
//     return new Date(0);
//   };

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//        const res = await API.get("/api/courses/student-visible-courses");

//         const raw = res.data.courses || [];

//         // 🔧 Normalize images first
//         const list = raw.map(normalizeImageField);

//         // ✅ Sort: published first, then newest first
//         const sorted = list.slice().sort((a, b) => {
//           const aPub = String(a.status || "").toLowerCase() === "published" ? 1 : 0;
//           const bPub = String(b.status || "").toLowerCase() === "published" ? 1 : 0;
//           if (aPub !== bPub) return bPub - aPub; // published first
//           return getCreatedDate(b) - getCreatedDate(a); // newest first
//         });

//         setCourses(sorted);
//       } catch (err) {
//         console.error("❌ Error fetching courses:", err);
//       }
//     };

//     fetchCourses();
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4 fw-bold">Available Courses</h2>
//       <div className="row">
//         {courses.length === 0 ? (
//           <p>No courses found.</p>
//         ) : (
//           courses.map((course) => (
//             <div className="col-md-4 mb-4" key={course._id}>
              
//               <Link
//                 to={`/student/course/${course._id}`}
//                 className="text-decoration-none text-dark"
//               >
//                 <div className="card h-100 shadow-sm rounded-4">
//                   <img
//                     src={resolveCourseImage(course)}
//                     className="card-img-top rounded-top-4"
//                     alt={course.title}
//                     style={{ height: "200px", objectFit: "cover" }}
//                   />
//                   <div className="card-body d-flex flex-column">
//                     <h5 className="card-title fw-semibold">{course.title}</h5>
//                     <p className="card-text text-muted">
//                       {course.sections?.reduce(
//                         (acc, sec) => acc + (sec.lessons?.length || 0),
//                         0
//                       )}{" "}
//                       Lessons
//                     </p>
//                     <p className="card-text fw-bold">
//                       {course.isFree ? (
//                         <span className="text-success">FREE</span>
//                       ) : (
//                         `₹ ${course.price}`
//                       )}
//                     </p>
//                     <div className="mt-auto">
//                       <span className="btn btn-outline-primary w-100">
//                         View Course
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentCourseListPage;









// src/MockTest/page/LMS/LMS_Pages/StudentCourseListPage.js
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
// ✅ centralized axios wrapper
import API from '../../../../LoginSystem/axios';


/* -------------------------------------------------------
   Config
------------------------------------------------------- */
const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

/* -------------------------------------------------------
   Image helpers
------------------------------------------------------- */
function resolveCourseImage(course) {
  const candidates = [
    course?.image,
    course?.thumbnail,
    course?.wallpaperUrl,
    course?.wallpaper,
  ].filter((s) => typeof s === "string" && s.trim() !== "");

  if (candidates.length === 0) {
    return "https://via.placeholder.com/400x200.png?text=Course+Image";
  }

  const raw = candidates[0].trim();

  // absolute http(s)
  if (/^https?:\/\//i.test(raw)) return raw;

  // data URL
  if (/^data:/i.test(raw)) return raw;

  // backend static path (e.g., /uploads/a.jpg or uploads/a.jpg)
  if (/^(\/)?uploads\//i.test(raw)) {
    const path = raw.startsWith("/") ? raw : `/${raw}`;
    return `${API_BASE}${path}`;
  }

  // looks like base64-only string
  if (/^[A-Za-z0-9+/=]+$/.test(raw) && raw.length > 100) {
    return `data:image/*;base64,${raw}`;
  }

  // anything else: try to join as relative
  if (raw.startsWith("/")) return `${API_BASE}${raw}`;
  return raw || "https://via.placeholder.com/400x200.png?text=Course+Image";
}

const normalizeImageField = (course) => {
  const img = course?.image;

  if (img && typeof img === "object" && img.type === "Buffer" && Array.isArray(img.data)) {
    try {
      const bytes = new Uint8Array(img.data);

      // Maybe it's actually a data URL string serialized as bytes
      let asText = "";
      try {
        asText = new TextDecoder().decode(bytes);
      } catch (_) {}
      if (asText && /^data:[^;]+;base64,/.test(asText)) {
        return { ...course, image: asText };
      }

      // Otherwise, convert raw bytes to base64 data URL
      let binary = "";
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const b64 = window.btoa(binary);
      const ct = course?.imageContentType || "image/*";
      return { ...course, image: `data:${ct};base64,${b64}` };
    } catch {
      return course;
    }
  }

  return course;
};

/* -------------------------------------------------------
   Data helpers
------------------------------------------------------- */
const objectIdDate = (id) => {
  if (!id || typeof id !== "string" || id.length < 8) return new Date(0);
  const ts = parseInt(id.substring(0, 8), 16) * 1000;
  return new Date(ts);
};

const getCreatedDate = (course) => {
  if (course?.createdAt) return new Date(course.createdAt);
  return objectIdDate(course?._id);
};

// Normalize whatever shape the backend returns into [{...course}]
function normalizeCourseList(payload) {
  if (!payload) return [];

  if (Array.isArray(payload)) return payload;

  // common shapes
  if (Array.isArray(payload.courses)) return payload.courses;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;

  // single course?
  if (payload.course) return [payload.course];

  return [];
}

/* -------------------------------------------------------
   Smart fetcher: tries several endpoints in order until one works
------------------------------------------------------- */
async function fetchCoursesSmart() {
  const endpoints = [
    "/api/courses/student-visible-courses", // your intended endpoint
    "/api/courses/public",
    "/api/courses/list",
    "/api/courses",              // some backends list on the base path
    "/api/courses/all",
  ];

  let lastErr = null;

  for (const path of endpoints) {
    try {
      const res = await API.get(path);
      const list = normalizeCourseList(res?.data);
      if (list.length) return list;
      // If response is 200 but empty, keep trying next
    } catch (e) {
      lastErr = e;
      // 404 or 500 — try next candidate
    }
  }

  // If nothing worked, throw the last error (so the UI can show it)
  if (lastErr) throw lastErr;
  // Or return empty array if you prefer silent failure
  return [];
}

/* -------------------------------------------------------
   Component
------------------------------------------------------- */
export default function StudentCourseListPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const rawList = await fetchCoursesSmart();

        // image normalization
        const list = rawList.map(normalizeImageField);

        // sort: published first, then newest
        const sorted = list.slice().sort((a, b) => {
          const aPub = String(a.status || "").toLowerCase() === "published" ? 1 : 0;
          const bPub = String(b.status || "").toLowerCase() === "published" ? 1 : 0;
          if (aPub !== bPub) return bPub - aPub;
          return getCreatedDate(b) - getCreatedDate(a);
        });

        if (alive) {
          setCourses(sorted);
          setErrorMsg("");
        }
      } catch (err) {
        console.error("❌ Error fetching courses:", err);
        const detail =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Internal Server Error";
        if (alive) setErrorMsg(`Failed to load courses (${detail}).`);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const totalCourses = useMemo(() => courses.length, [courses]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 fw-bold">Available Courses</h2>

      {loading && <p>Loading courses…</p>}

      {!loading && errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && totalCourses === 0 && <p>No courses found.</p>}

      {!loading && !errorMsg && totalCourses > 0 && (
        <div className="row">
          {courses.map((course) => {
            const sectionCount = Array.isArray(course.sections)
              ? course.sections.reduce((acc, s) => acc + ((s.lessons && s.lessons.length) || 0), 0)
              : 0;

            return (
              <div className="col-md-4 mb-4" key={course._id || course.slug}>
                <Link
                  to={`/student/course/${course._id || course.slug}`}
                  className="text-decoration-none text-dark"
                >
                  <div className="card h-100 shadow-sm rounded-4">
                    <img
                      src={resolveCourseImage(course)}
                      className="card-img-top rounded-top-4"
                      alt={course.title || "Course"}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-semibold">{course.title || "Untitled course"}</h5>
                      <p className="card-text text-muted">
                        {sectionCount} Lesson{sectionCount === 1 ? "" : "s"}
                      </p>
                      <p className="card-text fw-bold">
                        {course.isFree ? (
                          <span className="text-success">FREE</span>
                        ) : (
                          (course.price != null ? `₹ ${course.price}` : "Paid")
                        )}
                      </p>
                      <div className="mt-auto">
                        <span className="btn btn-outline-primary w-100">
                          View Course
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
