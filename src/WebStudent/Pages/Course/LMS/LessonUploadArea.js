// // // components/LessonUploadArea.js
// // import React from "react";

// // const LessonUploadArea = ({ label, fileInputRef, onClick }) => (
// //   <div
// //     className="border border-2 rounded p-5 text-center bg-light"
// //     onClick={onClick}
// //     style={{ cursor: "pointer" }}
// //   >
// //     <div>📁 <strong>{label}</strong></div>
// //     <p className="text-muted mb-0">Drop files here or <u>browse files</u></p>
// //   </div>
// // );

// // export default LessonUploadArea;





// // src/components/LessonUploadArea.js
// import React, { useRef, useState } from "react";
// import API from "../../../../../LoginSystem/axios";


// /**
//  * Props:
//  * - label
//  * - folder: e.g. courses/<courseId>/sections/<sectionId>
//  * - accept: file types (default: "video/*")
//  * - type: "video" | "pdf" | "audio" | "slides" | etc.
//  * - onUploaded: ({ key, duration, size, contentType })
//  * - fileInputRef (optional)
//  */
// export default function LessonUploadArea({
//   label = "Upload File",
//   folder = "",
//   accept = "*/*",
//   type = "file",
//   onUploaded,
//   fileInputRef: externalRef,
// }) {
//   const localRef = useRef(null);

//   const setInputRef = (el) => {
//     localRef.current = el;
//     if (externalRef) {
//       if (typeof externalRef === "function") externalRef(el);
//       else externalRef.current = el;
//     }
//   };

//   const [fileName, setFileName] = useState("");
//   const [status, setStatus] = useState("idle"); // idle|signing|uploading|done|error
//   const [progress, setProgress] = useState(0);
//   const [errorMsg, setErrorMsg] = useState("");

//   const handleClick = () => localRef.current?.click();
//   const onDrop = (e) => {
//     e.preventDefault();
//     handleFiles(e.dataTransfer.files);
//   };
//   const onChange = (e) => handleFiles(e.target.files);

//   async function handleFiles(files) {
//     const file = files && files[0];
//     if (!file) return;

//     setFileName(file.name);
//     setStatus("signing");
//     setProgress(0);
//     setErrorMsg("");

//     // 1) presign PUT using centralized API
//     try {
//       const { data: sig } = await API.post("/api/media/presignPut", {
//         filename: file.name,
//         contentType: file.type || "application/octet-stream",
//         folder,
//       });

//       if (!sig?.url || !sig?.key) {
//         throw new Error(sig?.error || "presign failed");
//       }

//       // 2) PUT directly to S3 (still raw fetch)
//       setStatus("uploading");
//       setProgress(0);
//       const putRes = await fetch(sig.url, { method: "PUT", body: file });
//       if (!putRes.ok) throw new Error(`S3 PUT failed (${putRes.status})`);
//       setProgress(100);

//       // Only compute duration for video files
//       const duration =
//         type.toLowerCase() === "video"
//           ? await getVideoDuration(file).catch(() => 0)
//           : 0;

//       setStatus("done");
//       onUploaded?.({
//         key: sig.key,
//         duration,
//         size: file.size,
//         contentType: file.type || "application/octet-stream",
//       });
//       return;
//     } catch (err) {
//       console.error("Direct PUT failed:", err);
//       setErrorMsg(`Direct upload failed: ${err.message}`);
//     }

//     // 3) Fallback: proxy upload via backend (using centralized API)
//     try {
//       setStatus("uploading");
//       const fd = new FormData();
//       fd.append("file", file);
//       fd.append("folder", folder || "uploads");

//       const { data } = await API.post("/api/media/upload-direct", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//         onUploadProgress: (e) => {
//           if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
//         },
//       });

//       const duration =
//         type.toLowerCase() === "video"
//           ? await getVideoDuration(file).catch(() => 0)
//           : 0;

//       setStatus("done");
//       setProgress(100);
//       onUploaded?.({
//         key: data.key,
//         duration,
//         size: file.size,
//         contentType: file.type || "application/octet-stream",
//       });
//     } catch (e) {
//       console.error("Server upload also failed:", e);
//       setStatus("error");
//       setErrorMsg(`Upload failed: ${e.response?.data?.error || e.message}`);
//     }
//   }

//   return (
//     <div
//       className="border rounded p-5 text-center bg-light"
//       onClick={handleClick}
//       onDragOver={(e) => e.preventDefault()}
//       onDrop={onDrop}
//       style={{
//         cursor: "pointer",
//         minHeight: 160,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         flexDirection: "column",
//       }}
//       title="Click or drop a file"
//     >
//       <input
//         ref={setInputRef}
//         type="file"
//         accept={accept}
//         onChange={onChange}
//         style={{ display: "none" }}
//       />
//       <div>
//         <span style={{ fontSize: 24, marginRight: 8 }}>📁</span>
//         <strong>{label}</strong>
//       </div>
//       <div className="text-muted">
//         Drop files here or <u>browse files</u>
//       </div>

//       {fileName && (
//         <div className="small mt-2">
//           {fileName} • {status}
//           {status === "uploading" ? ` • ${progress}%` : ""}
//         </div>
//       )}

//       {status === "uploading" && (
//         <div
//           className="mt-2"
//           style={{
//             width: "80%",
//             height: 8,
//             background: "#eee",
//             borderRadius: 4,
//           }}
//         >
//           <div
//             style={{
//               height: "100%",
//               width: `${progress}%`,
//               background: "#0d6efd",
//               borderRadius: 4,
//               transition: "width .2s ease",
//             }}
//           />
//         </div>
//       )}

//       {status === "error" && (
//         <div className="text-danger small mt-2">{errorMsg}</div>
//       )}
//     </div>
//   );
// }

// function getVideoDuration(file) {
//   return new Promise((resolve, reject) => {
//     const url = URL.createObjectURL(file);
//     const v = document.createElement("video");
//     v.preload = "metadata";
//     v.onloadedmetadata = () => {
//       URL.revokeObjectURL(url);
//       resolve(Math.round(v.duration || 0));
//     };
//     v.onerror = reject;
//     v.src = url;
//   });
// }
