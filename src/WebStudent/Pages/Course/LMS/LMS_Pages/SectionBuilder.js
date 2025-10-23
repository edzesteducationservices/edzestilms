// // pages/SectionBuilder.js
// import React, { useState, useEffect, useRef, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { AuthContext } from "../../../context/AuthContext";
// import LessonDrawer from "../LessonDrawer";
// import { isAdminRole } from "../../../../utils/roleCheck";

// const SectionBuilder = () => {
//   const { user } = useContext(AuthContext);
//   const { courseId } = useParams();
//   const navigate = useNavigate();

//   const [sections, setSections] = useState([]);
//   const [showDrawer, setShowDrawer] = useState(false);
//   const [selectedSectionId, setSelectedSectionId] = useState(null);
//   const [lessonTitle, setLessonTitle] = useState("");
//   const [lessonType, setLessonType] = useState("");
//   const [uploadedUrl, setUploadedUrl] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     fetchSections();
//   }, [courseId]);

//   const fetchSections = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSections(res.data.course.sections || []);
//     } catch (err) {
//       console.error("Failed to fetch sections:", err);
//     }
//   };

//   // const handleAddSection = () => {
//   //   const newId = `${sections.length + 1}`;
//   //   const newTitle = `Section ${sections.length + 1}`;
//   //   setSections([...sections, { id: newId, title: newTitle, expanded: false, lessons: [] }]);
//   // };

//   const handleAddSection = async () => {
//   const token = localStorage.getItem("token");

//   try {
//     const newTitle = `Section ${sections.length + 1}`;
//     const res = await axios.post(
//       `http://localhost:5000/api/courses/${courseId}/add-section`,
//       { title: newTitle },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     const newSection = res.data.section;

//     // ✅ Ensure valid MongoDB _id is stored and used safely
//     if (!newSection._id) {
//       console.warn("⚠️ Section created but missing _id. Skipping append.");
//       return;
//     }

//     setSections((prev) => [
//       ...prev,
//       {
//         _id: newSection._id,       // ✅ Use real MongoDB ID
//         title: newSection.title,   // ✅ Title as returned from server
//         expanded: false,
//         lessons: [],               // ✅ Safe placeholder
//       },
//     ]);
//   } catch (err) {
//     console.error("❌ Error creating section:", err);
//     alert("Failed to create section");
//   }
// };

//   const handleToggleExpand = (index) => {
//     const updated = [...sections];
//     updated[index].expanded = !updated[index].expanded;
//     setSections(updated);
//   };

//   const handleDragEnd = (result) => {
//     if (!result.destination) return;
//     const reordered = Array.from(sections);
//     const [moved] = reordered.splice(result.source.index, 1);
//     reordered.splice(result.destination.index, 0, moved);
//     setSections(reordered);
//   };

//   const handleOpenDrawer = (sectionId) => {
//     setSelectedSectionId(sectionId);
//     setLessonTitle("");
//     setLessonType("");
//     setUploadedUrl("");
//     setShowDrawer(true);
//   };

//   if (!isAdminRole(user?.role)) {
//     return (
//       <div className="container mt-5 text-center">
//         <p className="text-danger">Access Denied</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container py-4">
//       <h4 className="mb-3">📚 Section Builder</h4>
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <Droppable droppableId="sectionList">
//           {(provided) => (
//             <ul className="list-group" {...provided.droppableProps} ref={provided.innerRef}>
//               {sections.length === 0 && (
//                 <li className="list-group-item text-muted text-center">No sections added yet.</li>
//               )}
//               {sections.map((sec, index) => (
//                 <Draggable key={sec._id || sec.id} draggableId={(sec._id || sec.id).toString()} index={index}>
//                   {(provided) => (
//                     <li
//                       className="list-group-item p-0 mb-2"
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                     >
//                       <div
//                         className="bg-white p-3 d-flex justify-content-between align-items-center border-bottom"
//                         onClick={() => handleToggleExpand(index)}
//                         style={{ cursor: "pointer" }}
//                       >
//                         <div>
//                           <span className="me-2">{sec.expanded ? "▴" : "▾"}</span>
//                           <strong>{sec.title}</strong>
//                         </div>
//                         <span className="text-muted">
//                           {sec.lessons?.length || 0} Lessons • 0 Quizzes
//                         </span>
//                       </div>

//                       {sec.expanded && (
//                         <>
//                           {sec.lessons?.length > 0 ? (
//                             <ul className="list-group list-group-flush">
//                               {sec.lessons.map((lesson, idx) => (
//                                 <li
//                                   key={lesson._id || idx}
//                                   className="list-group-item d-flex align-items-center"
//                                   style={{ cursor: "pointer" }}
//                                   onClick={() =>
//                                     navigate(
//                                       `/course/${courseId}/section/${sec._id || sec.id}/lesson/${lesson._id}`
//                                     )
//                                   }
//                                 >
//                                   <span className="me-2">{idx + 1}.</span>
//                                   <span className="me-2">▶</span>
//                                   <span>{lesson.title}</span>
//                                 </li>
//                               ))}
//                             </ul>
//                           ) : (
//                             <div className="list-group-item text-center text-muted">No lessons</div>
//                           )}
//                           <div
//                             className="text-center py-3 bg-light border-top text-success fw-bold"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => {
//                               if (!sec._id) {
//                                 alert("Cannot add lesson: section ID is invalid.");
//                                 return;
//                               }
//                               handleOpenDrawer(sec._id);
//                             }}
//                           >
//                             + Add lesson
//                           </div>
//                         </>
//                       )}
//                     </li>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </ul>
//           )}
//         </Droppable>
//       </DragDropContext>

//       <div
//         onClick={handleAddSection}
//         className="border border-2 rounded mt-3 p-4 text-center bg-light"
//         style={{ cursor: "pointer" }}
//       >
//         + Add Section
//       </div>

//       {showDrawer && (
//         <LessonDrawer
//           courseId={courseId}
//           selectedSectionId={selectedSectionId}
//           setLessonTitle={setLessonTitle}
//           setLessonType={setLessonType}
//           setUploadedUrl={setUploadedUrl}
//           lessonTitle={lessonTitle}
//           lessonType={lessonType}
//           uploadedUrl={uploadedUrl}
//           uploading={uploading}
//           setUploading={setUploading}
//           fileInputRef={fileInputRef}
//           setShowDrawer={setShowDrawer}
//           fetchSections={fetchSections}
//           navigate={navigate}
//         />
//       )}
//     </div>
//   );
// };

// export default SectionBuilder;

// pages/SectionBuilder.js
// import React, { useState, useEffect, useRef, useContext } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { AuthContext } from "../../../context/AuthContext";
// import LessonDrawer from "../LessonDrawer";
// import { isAdminRole } from "../../../../utils/roleCheck";
// import DeleteSectionButton from "../DeleteSectionButton";

// const SectionBuilder = () => {
//   const { user } = useContext(AuthContext);
//   const { courseId } = useParams();
//   const navigate = useNavigate();

//   const [sections, setSections] = useState([]);
//   const [showDrawer, setShowDrawer] = useState(false);
//   const [selectedSectionId, setSelectedSectionId] = useState(null);
//   const [lessonTitle, setLessonTitle] = useState("");
//   const [lessonType, setLessonType] = useState("");
//   const [uploadedUrl, setUploadedUrl] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   const [showAddSectionDrawer, setShowAddSectionDrawer] = useState(false);
//   const [sectionTitle, setSectionTitle] = useState("");

//   const [editingSectionId, setEditingSectionId] = useState(null);
//   const [editingTitle, setEditingTitle] = useState("");

//   const sectionRefs = useRef({});

//   useEffect(() => {
//     fetchSections();
//   }, [courseId]);

//   // const fetchSections = async () => {
//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     const res = await axios.get(
//   //       `http://localhost:5000/api/courses/${courseId}`,
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );
//   //     setSections(res.data.course.sections || []);
//   //   } catch (err) {
//   //     console.error("Failed to fetch sections:", err);
//   //   }
//   // };


//   const fetchSections = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     // 1) Try your original route (no logic change)
//     let res = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     let course = res.data?.course || {};
//     let sectionsResp = Array.isArray(course.sections) ? course.sections : [];

//     // Count lessons if present
//     const totalLessons =
//       sectionsResp.reduce((sum, s) => sum + (Array.isArray(s.lessons) ? s.lessons.length : 0), 0) || 0;

//     // 2) Fallback to the robust route if lessons appear empty
//     if (sectionsResp.length > 0 && totalLessons === 0) {
//       try {
//         const res2 = await axios.get(
//           `http://localhost:5000/api/courses/fetchCourse/by/${courseId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const course2 = res2.data?.course || {};
//         const sections2 = Array.isArray(course2.sections) ? course2.sections : [];

//         // Prefer the fallback result only if it actually improved things
//         const totalLessons2 =
//           sections2.reduce((sum, s) => sum + (Array.isArray(s.lessons) ? s.lessons.length : 0), 0) || 0;

//         if (totalLessons2 > 0) {
//           sectionsResp = sections2;
//         }
//       } catch (e) {
//         console.warn("⚠️ Fallback route fetch failed:", e?.response?.data || e?.message);
//       }
//     }

//     // Ensure every section has lessons array and an expanded flag
//     const normalized = sectionsResp.map((s) => ({
//       ...s,
//       lessons: Array.isArray(s.lessons) ? s.lessons : [],
//       expanded: Boolean(s.expanded),
//     }));

//     setSections(normalized);
//   } catch (err) {
//     console.error("Failed to fetch sections:", err?.response?.data || err);
//   }
// };


//   const handleSaveSection = async () => {
//     if (!sectionTitle.trim()) return;
//     const exists = sections.some(
//       (s) => s.title.trim().toLowerCase() === sectionTitle.trim().toLowerCase()
//     );
//     if (exists) {
//       alert("Section with this title already exists.");
//       return;
//     }

//     const token = localStorage.getItem("token");

//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/courses/${courseId}/add-section`,
//         { title: sectionTitle },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const newSection = res.data.section;
//       if (!newSection._id) return;

//       const updatedSections = [
//         ...sections,
//         { ...newSection, expanded: false, lessons: [] },
//       ];
//       setSections(updatedSections);
//       setSectionTitle("");
//       setShowAddSectionDrawer(false);

//       setTimeout(() => {
//         const element = sectionRefs.current[newSection._id];
//         if (element)
//           element.scrollIntoView({ behavior: "smooth", block: "center" });
//       }, 300);
//     } catch (err) {
//       console.error("Error creating section:", err);
//     }
//   };

//   const handleUpdateSectionTitle = async (id) => {
//     const token = localStorage.getItem("token");
//     try {
//       await axios.put(
//         `http://localhost:5000/api/courses/${courseId}/section/${id}`,
//         { title: editingTitle },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSections((prev) =>
//         prev.map((s) => (s._id === id ? { ...s, title: editingTitle } : s))
//       );
//       setEditingSectionId(null);
//     } catch (err) {
//       console.error("Failed to update title:", err);
//     }
//   };

//   const handleToggleExpand = (index) => {
//     const updated = [...sections];
//     updated[index].expanded = !updated[index].expanded;
//     setSections(updated);
//   };

//   const handleDragEnd = async (result) => {
//     if (!result.destination) return;
//     const reordered = Array.from(sections);
//     const [moved] = reordered.splice(result.source.index, 1);
//     reordered.splice(result.destination.index, 0, moved);
//     setSections(reordered);

//     // Sync drag order to backend
//     const token = localStorage.getItem("token");
//     try {
//       await axios.patch(
//         `http://localhost:5000/api/courses/${courseId}/reorder-sections`,
//         { sectionIds: reordered.map((s) => s._id) },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//     } catch (err) {
//       console.error("Failed to sync section order:", err);
//     }
//   };

//   const handleOpenDrawer = (sectionId) => {
//     setSelectedSectionId(sectionId);
//     setLessonTitle("");
//     setLessonType("");
//     setUploadedUrl("");
//     setShowDrawer(true);
//   };

//   if (!isAdminRole(user?.role)) {
//     return (
//       <div className="container mt-5 text-center">
//         <p className="text-danger">Access Denied</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container py-4">
      
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h4 className="m-0">📚 Section Builder</h4>
//           <Link to={`/course/settings/${courseId}`}>
//             <button className="btn btn-outline-primary">Settings</button>
//           </Link>
//         </div>
      

//       <DragDropContext onDragEnd={handleDragEnd}>
//         <Droppable droppableId="sectionList">
//           {(provided) => (
//             <ul
//               className="list-group"
//               {...provided.droppableProps}
//               ref={provided.innerRef}
//             >
//               {sections.length === 0 && (
//                 <li className="list-group-item text-muted text-center">
//                   No sections added yet.
//                 </li>
//               )}
//               {sections.map((sec, index) => (
//                 <Draggable key={sec._id} draggableId={sec._id} index={index}>
//                   {(provided) => (
//                     <li
//                       className="list-group-item p-0 mb-2"
//                       ref={(el) => {
//                         provided.innerRef(el);
//                         sectionRefs.current[sec._id] = el;
//                       }}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                     >
//                       <div className="bg-white p-3 d-flex justify-content-between align-items-center border-bottom">
//                         <div
//                           style={{ cursor: "pointer" }}
//                           onClick={() => handleToggleExpand(index)}
//                         >
//                           <span className="me-2">
//                             {sec.expanded ? "▴" : "▾"}
//                           </span>
//                           {editingSectionId === sec._id ? (
//                             <>
//                               <input
//                                 className="form-control d-inline w-auto"
//                                 value={editingTitle}
//                                 onChange={(e) =>
//                                   setEditingTitle(e.target.value)
//                                 }
//                               />
//                               <button
//                                 className="btn btn-sm btn-success ms-2"
//                                 onClick={() =>
//                                   handleUpdateSectionTitle(sec._id)
//                                 }
//                               >
//                                 Save
//                               </button>
//                             </>
//                           ) : (
//                             <strong>{sec.title}</strong>
//                           )}
//                         </div>
//                         <div>
//                           <span className="me-3 text-muted">
//                             {sec.lessons?.length || 0} Lessons • 0 Quizzes
//                           </span>
//                           <i
//                             className="bi bi-pencil-square me-2 text-primary"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => {
//                               setEditingSectionId(sec._id);
//                               setEditingTitle(sec.title);
//                             }}
//                           />
//                           <DeleteSectionButton
//                             courseId={courseId}
//                             sectionId={sec._id}
//                             onDeleted={() =>
//                               setSections((prev) =>
//                                 prev.filter((s) => s._id !== sec._id)
//                               )
//                             }
//                           />
//                         </div>
//                       </div>

//                       {sec.expanded && (
//                         <>
//                           {sec.lessons?.length > 0 ? (
//                             <ul className="list-group list-group-flush">
//                               {sec.lessons.map((lesson, idx) => (
//                                 <li
//                                   key={lesson._id || idx}
//                                   className="list-group-item d-flex align-items-center"
//                                   style={{ cursor: "pointer" }}
//                                   onClick={() =>
//                                     navigate(
//                                       `/course/${courseId}/section/${sec._id}/lesson/${lesson._id}`
//                                     )
//                                   }
//                                 >
//                                   <span className="me-2">{idx + 1}.</span>
//                                   <span className="me-2">▶</span>
//                                   <span>{lesson.title}</span>
//                                 </li>
//                               ))}
//                             </ul>
//                           ) : (
//                             <div className="list-group-item text-center text-muted">
//                               No lessons
//                             </div>
//                           )}
//                           <div
//                             className="text-center py-3 bg-light border-top text-success fw-bold"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => handleOpenDrawer(sec._id)}
//                           >
//                             + Add lesson
//                           </div>
//                         </>
//                       )}
//                     </li>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </ul>
//           )}
//         </Droppable>
//       </DragDropContext>

//       <div
//         className="border border-2 rounded mt-3 p-4 text-center bg-light"
//         style={{ cursor: "pointer" }}
//         onClick={() => setShowAddSectionDrawer(true)}
//       >
//         + Add Section
//       </div>

//       {showDrawer && (
//         <LessonDrawer
//           courseId={courseId}
//           selectedSectionId={selectedSectionId}
//           setLessonTitle={setLessonTitle}
//           setLessonType={setLessonType}
//           setUploadedUrl={setUploadedUrl}
//           lessonTitle={lessonTitle}
//           lessonType={lessonType}
//           uploadedUrl={uploadedUrl}
//           uploading={uploading}
//           setUploading={setUploading}
//           fileInputRef={fileInputRef}
//           setShowDrawer={setShowDrawer}
//           fetchSections={fetchSections}
//           navigate={navigate}
//         />
//       )}

//       {showAddSectionDrawer && (
//         <div
//           className="offcanvas offcanvas-end show"
//           style={{ visibility: "visible", width: 400, zIndex: 1050 }}
//         >
//           <div className="offcanvas-header">
//             <h5 className="offcanvas-title">Add Section</h5>
//             <button
//               className="btn-close text-reset"
//               onClick={() => setShowAddSectionDrawer(false)}
//             ></button>
//           </div>
//           <div className="offcanvas-body">
//             <label className="form-label">Section Title*</label>
//             <input
//               type="text"
//               className="form-control"
//               value={sectionTitle}
//               onChange={(e) => setSectionTitle(e.target.value)}
//               maxLength={60}
//             />
//             <div className="text-end small mt-1">{sectionTitle.length}/60</div>
//             <div className="d-flex justify-content-end mt-4">
//               <button
//                 className="btn btn-secondary me-2"
//                 onClick={() => setShowAddSectionDrawer(false)}
//               >
//                 CANCEL
//               </button>
//               <button
//                 className="btn btn-success"
//                 onClick={handleSaveSection}
//                 disabled={!sectionTitle.trim()}
//               >
//                 SAVE
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SectionBuilder;




// import React, { useState, useEffect, useRef, useContext } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../../../context/AuthContext";
// import LessonDrawer from "../LessonDrawer";

// import SectionBuilderUI from "../SectionBuilderUI";


// // ✅ use centralized axios wrapper
// import API from "../../../../api/axios";
// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// const SectionBuilder = () => {
//   const { user } = useContext(AuthContext);
//   const { courseId } = useParams();
//   const navigate = useNavigate();

//   const [sections, setSections] = useState([]);
//   const [showDrawer, setShowDrawer] = useState(false);
//   const [selectedSectionId, setSelectedSectionId] = useState(null);
//   const [lessonTitle, setLessonTitle] = useState("");
//   const [lessonType, setLessonType] = useState("");
//   const [uploadedUrl, setUploadedUrl] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   const [showAddSectionDrawer, setShowAddSectionDrawer] = useState(false);
//   const [sectionTitle, setSectionTitle] = useState("");

//   const [editingSectionId, setEditingSectionId] = useState(null);
//   const [editingTitle, setEditingTitle] = useState("");

//   const sectionRefs = useRef({});

//   useEffect(() => {
//     fetchSections();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [courseId]);

//   const fetchSections = async () => {
//     try {
//       let res = await API.get(`/api/courses/${courseId}`);

//       let course = res.data?.course || {};
//       let sectionsResp = Array.isArray(course.sections) ? course.sections : [];

//       // Count lessons if present
//       const totalLessons =
//         sectionsResp.reduce(
//           (sum, s) => sum + (Array.isArray(s.lessons) ? s.lessons.length : 0),
//           0
//         ) || 0;

//       // 2) Fallback to the robust route if lessons appear empty
//       if (sectionsResp.length > 0 && totalLessons === 0) {
//         try {
//           const res2 = await API.get(`/api/courses/fetchCourse/by/${courseId}`);
//           const course2 = res2.data?.course || {};
//           const sections2 = Array.isArray(course2.sections) ? course2.sections : [];

//           const totalLessons2 =
//             sections2.reduce(
//               (sum, s) => sum + (Array.isArray(s.lessons) ? s.lessons.length : 0),
//               0
//             ) || 0;

//           if (totalLessons2 > 0) {
//             sectionsResp = sections2;
//           }
//         } catch (e) {
//           console.warn("⚠️ Fallback route fetch failed:", e?.response?.data || e?.message);
//         }
//       }

//       const normalized = sectionsResp.map((s) => ({
//         ...s,
//         lessons: Array.isArray(s.lessons) ? s.lessons : [],
//         expanded: Boolean(s.expanded),
//       }));

//       setSections(normalized);
//     } catch (err) {
//       console.error("Failed to fetch sections:", err?.response?.data || err);
//     }
//   };

//   const handleSaveSection = async () => {
//     if (!sectionTitle.trim()) return;
//     const exists = sections.some(
//       (s) => s.title.trim().toLowerCase() === sectionTitle.trim().toLowerCase()
//     );
//     if (exists) {
//       alert("Section with this title already exists.");
//       return;
//     }

//      try {
//       const res = await API.post(`/api/courses/${courseId}/add-section`, {
//         title: sectionTitle,
//       });

//       const newSection = res.data.section;
//       if (!newSection._id) return;

//       const updatedSections = [
//         ...sections,
//         { ...newSection, expanded: false, lessons: [] },
//       ];
//       setSections(updatedSections);
//       setSectionTitle("");
//       setShowAddSectionDrawer(false);

//       setTimeout(() => {
//         const element = sectionRefs.current[newSection._id];
//         if (element)
//           element.scrollIntoView({ behavior: "smooth", block: "center" });
//       }, 300);
//     } catch (err) {
//       console.error("Error creating section:", err);
//     }
//   };

//   const handleUpdateSectionTitle = async (id) => {
//      try {
//       await API.put(`/api/courses/${courseId}/section/${id}`, {
//         title: editingTitle,
//       });
//       setSections((prev) =>
//         prev.map((s) => (s._id === id ? { ...s, title: editingTitle } : s))
//       );
//       setEditingSectionId(null);
//     } catch (err) {
//       console.error("Failed to update title:", err);
//     }
//   };

//   const handleToggleExpand = (index) => {
//     const updated = [...sections];
//     updated[index].expanded = !updated[index].expanded;
//     setSections(updated);
//   };

//   const handleDragEnd = async (result) => {
//     if (!result.destination) return;
//     const reordered = Array.from(sections);
//     const [moved] = reordered.splice(result.source.index, 1);
//     reordered.splice(result.destination.index, 0, moved);
//     setSections(reordered);

//     // Sync drag order to backend
//     try {
//       await API.patch(`/api/courses/${courseId}/reorder-sections`, {
//         sectionIds: reordered.map((s) => s._id),
//       });
//     } catch (err) {
//       console.error("Failed to sync section order:", err);
//     }
//   };

//   const handleOpenDrawer = (sectionId) => {
//     setSelectedSectionId(sectionId);
//     setLessonTitle("");
//     setLessonType("");
//     setUploadedUrl("");
//     setShowDrawer(true);
//   };

 

//   return (
//     <div className="container py-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h4 className="m-0">📚 Section Builder</h4>
//         <Link to={`/course/settings/${courseId}`}>
//           <button className="btn btn-outline-primary">Settings</button>
//         </Link>
//       </div>

//       <SectionBuilderUI
//         sections={sections}
//         onDragEnd={handleDragEnd}
//         onToggleExpand={handleToggleExpand}
//         editingSectionId={editingSectionId}
//         editingTitle={editingTitle}
//         setEditingSectionId={setEditingSectionId}
//         setEditingTitle={setEditingTitle}
//         onSaveTitle={handleUpdateSectionTitle}
//         handleOpenDrawer={handleOpenDrawer}
//         courseId={courseId}
//         navigate={navigate}
//         sectionRefs={sectionRefs}
//       />

//       <div
//         className="border border-2 rounded mt-3 p-4 text-center bg-light"
//         style={{ cursor: "pointer" }}
//         onClick={() => setShowAddSectionDrawer(true)}
//       >
//         + Add Section
//       </div>

//       {showDrawer && (
//         <LessonDrawer
//           courseId={courseId}
//           selectedSectionId={selectedSectionId}
//           setLessonTitle={setLessonTitle}
//           setLessonType={setLessonType}
//           setUploadedUrl={setUploadedUrl}
//           lessonTitle={lessonTitle}
//           lessonType={lessonType}
//           uploadedUrl={uploadedUrl}
//           uploading={uploading}
//           setUploading={setUploading}
//           fileInputRef={fileInputRef}
//           setShowDrawer={setShowDrawer}
//           fetchSections={fetchSections}
//           navigate={navigate}
//         />
//       )}

//       {showAddSectionDrawer && (
//         <div
//           className="offcanvas offcanvas-end show"
//           style={{ visibility: "visible", width: 400, zIndex: 1050 }}
//         >
//           <div className="offcanvas-header">
//             <h5 className="offcanvas-title">Add Section</h5>
//             <button
//               className="btn-close text-reset"
//               onClick={() => setShowAddSectionDrawer(false)}
//             ></button>
//           </div>
//           <div className="offcanvas-body">
//             <label className="form-label">Section Title*</label>
//             <input
//               type="text"
//               className="form-control"
//               value={sectionTitle}
//               onChange={(e) => setSectionTitle(e.target.value)}
//               maxLength={60}
//             />
//             <div className="text-end small mt-1">{sectionTitle.length}/60</div>
//             <div className="d-flex justify-content-end mt-4">
//               <button
//                 className="btn btn-secondary me-2"
//                 onClick={() => setShowAddSectionDrawer(false)}
//               >
//                 CANCEL
//               </button>
//               <button
//                 className="btn btn-success"
//                 onClick={handleSaveSection}
//                 disabled={!sectionTitle.trim()}
//               >
//                 SAVE
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SectionBuilder;






import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import LessonDrawer from "../LessonDrawer";
import SectionBuilderUI from "../SectionBuilderUI";

import { useAuth } from "../../../../../LoginSystem/context/AuthContext";
 import API from "../../../../../LoginSystem/axios";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const SectionBuilder = () => {
  const { user, ready } = useAuth(); // ✅ new context with ready + user
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [sections, setSections] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [showAddSectionDrawer, setShowAddSectionDrawer] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");

  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const sectionRefs = useRef({});

  useEffect(() => {
    if (!ready) return; // ✅ wait until AuthProvider finishes
    fetchSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, ready]);

  const fetchSections = async () => {
    try {
      let res = await API.get(`/api/courses/${courseId}`);
      let course = res.data?.course || {};
      let sectionsResp = Array.isArray(course.sections) ? course.sections : [];

      // Count lessons if present
      const totalLessons =
        sectionsResp.reduce(
          (sum, s) => sum + (Array.isArray(s.lessons) ? s.lessons.length : 0),
          0
        ) || 0;

      // fallback if lessons look empty
      if (sectionsResp.length > 0 && totalLessons === 0) {
        try {
          const res2 = await API.get(`/api/courses/fetchCourse/by/${courseId}`);
          const course2 = res2.data?.course || {};
          const sections2 = Array.isArray(course2.sections)
            ? course2.sections
            : [];

          const totalLessons2 =
            sections2.reduce(
              (sum, s) => sum + (Array.isArray(s.lessons) ? s.lessons.length : 0),
              0
            ) || 0;

          if (totalLessons2 > 0) {
            sectionsResp = sections2;
          }
        } catch (e) {
          console.warn(
            "⚠️ Fallback route fetch failed:",
            e?.response?.data || e?.message
          );
        }
      }

      const normalized = sectionsResp.map((s) => ({
        ...s,
        lessons: Array.isArray(s.lessons) ? s.lessons : [],
        expanded: Boolean(s.expanded),
      }));

      setSections(normalized);
    } catch (err) {
      console.error("Failed to fetch sections:", err?.response?.data || err);
    }
  };

  const handleSaveSection = async () => {
    if (!sectionTitle.trim()) return;
    const exists = sections.some(
      (s) => s.title.trim().toLowerCase() === sectionTitle.trim().toLowerCase()
    );
    if (exists) {
      alert("Section with this title already exists.");
      return;
    }

    try {
      const res = await API.post(`/api/courses/${courseId}/add-section`, {
        title: sectionTitle,
      });

      const newSection = res.data.section;
      if (!newSection._id) return;

      const updatedSections = [
        ...sections,
        { ...newSection, expanded: false, lessons: [] },
      ];
      setSections(updatedSections);
      setSectionTitle("");
      setShowAddSectionDrawer(false);

      setTimeout(() => {
        const element = sectionRefs.current[newSection._id];
        if (element)
          element.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    } catch (err) {
      console.error("Error creating section:", err);
    }
  };

  const handleUpdateSectionTitle = async (id) => {
    try {
      await API.put(`/api/courses/${courseId}/section/${id}`, {
        title: editingTitle,
      });
      setSections((prev) =>
        prev.map((s) => (s._id === id ? { ...s, title: editingTitle } : s))
      );
      setEditingSectionId(null);
    } catch (err) {
      console.error("Failed to update title:", err);
    }
  };

  const handleToggleExpand = (index) => {
    const updated = [...sections];
    updated[index].expanded = !updated[index].expanded;
    setSections(updated);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(sections);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setSections(reordered);

    try {
      await API.patch(`/api/courses/${courseId}/reorder-sections`, {
        sectionIds: reordered.map((s) => s._id),
      });
    } catch (err) {
      console.error("Failed to sync section order:", err);
    }
  };

  const handleOpenDrawer = (sectionId) => {
    setSelectedSectionId(sectionId);
    setLessonTitle("");
    setLessonType("");
    setUploadedUrl("");
    setShowDrawer(true);
  };

  // ✅ wait until auth is ready
  if (!ready) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading auth…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">📚 Section Builder</h4>
        <Link to={`/course/settings/${courseId}`}>
          <button className="btn btn-outline-primary">Settings</button>
        </Link>
      </div>

      <SectionBuilderUI
        sections={sections}
        onDragEnd={handleDragEnd}
        onToggleExpand={handleToggleExpand}
        editingSectionId={editingSectionId}
        editingTitle={editingTitle}
        setEditingSectionId={setEditingSectionId}
        setEditingTitle={setEditingTitle}
        onSaveTitle={handleUpdateSectionTitle}
        handleOpenDrawer={handleOpenDrawer}
        courseId={courseId}
        navigate={navigate}
        sectionRefs={sectionRefs}
      />

      <div
        className="border border-2 rounded mt-3 p-4 text-center bg-light"
        style={{ cursor: "pointer" }}
        onClick={() => setShowAddSectionDrawer(true)}
      >
        + Add Section
      </div>

      {showDrawer && (
        <LessonDrawer
          courseId={courseId}
          selectedSectionId={selectedSectionId}
          setLessonTitle={setLessonTitle}
          setLessonType={setLessonType}
          setUploadedUrl={setUploadedUrl}
          lessonTitle={lessonTitle}
          lessonType={lessonType}
          uploadedUrl={uploadedUrl}
          uploading={uploading}
          setUploading={setUploading}
          fileInputRef={fileInputRef}
          setShowDrawer={setShowDrawer}
          fetchSections={fetchSections}
          navigate={navigate}
        />
      )}

      {showAddSectionDrawer && (
        <div
          className="offcanvas offcanvas-end show"
          style={{ visibility: "visible", width: 400, zIndex: 1050 }}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Add Section</h5>
            <button
              className="btn-close text-reset"
              onClick={() => setShowAddSectionDrawer(false)}
            ></button>
          </div>
          <div className="offcanvas-body">
            <label className="form-label">Section Title*</label>
            <input
              type="text"
              className="form-control"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              maxLength={60}
            />
            <div className="text-end small mt-1">{sectionTitle.length}/60</div>
            <div className="d-flex justify-content-end mt-4">
              <button
                className="btn btn-secondary me-2"
                onClick={() => setShowAddSectionDrawer(false)}
              >
                CANCEL
              </button>
              <button
                className="btn btn-success"
                onClick={handleSaveSection}
                disabled={!sectionTitle.trim()}
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionBuilder;
