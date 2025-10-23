// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// const AddSection = () => {
//   const { testId } = useParams();
//   const [mockTest, setMockTest] = useState(null);

//   useEffect(() => {
//     const fetchTest = async () => {
//       try {
//         const res = await axios.get(`${REACT_APP_API_URL}/api/admin/mock-tests/${testId}`);
//         setMockTest(res.data);
//       } catch (error) {
//         console.error("Failed to fetch test:", error);
//       }
//     };

//     fetchTest();
//   }, [testId]);

//   if (!mockTest) return <div className="text-center p-5">Loading test info...</div>;

//   return (
//     <div className="container mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3 className="fw-bold">{mockTest.title}</h3>
//         <div>
//           <span className="badge bg-secondary me-2">Unpublished</span>
//           <span className={`badge ${mockTest.security === "encrypted" ? "bg-primary" : "bg-dark"}`}>
//             {mockTest.security === "encrypted" ? "Encrypted" : "No Encryption"}
//           </span>
//         </div>
//       </div>

//       <div className="text-center border rounded p-5 bg-light">
//         <img
//           src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png"
//           alt="illustration"
//           style={{ width: "120px", marginBottom: "20px" }}
//         />
//         <h5 className="mb-3">Add Section</h5>
//         <p>Start adding sections to build your course</p>
//         <button className="btn btn-success px-4 mt-2">+ ADD SECTION</button>
//       </div>
//     </div>
//   );
// };

// export default AddSection;



// src/.../AddSection.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// ✅ Use centralized API instance (auto Bearer + refresh)
import API from "../../../../LoginSystem/axios";


const AddSection = () => {
  const { testId } = useParams();
  const [mockTest, setMockTest] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await API.get(`/api/admin/mock-tests/${testId}`);
        setMockTest(res.data);
      } catch (error) {
        console.error("Failed to fetch test:", error);
      }
    };

    fetchTest();
  }, [testId]);

  if (!mockTest) return <div className="text-center p-5">Loading test info...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">{mockTest.title}</h3>
        <div>
          <span className="badge bg-secondary me-2">Unpublished</span>
          <span
            className={`badge ${
              mockTest.security === "encrypted" ? "bg-primary" : "bg-dark"
            }`}
          >
            {mockTest.security === "encrypted" ? "Encrypted" : "No Encryption"}
          </span>
        </div>
      </div>

      <div className="text-center border rounded p-5 bg-light">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png"
          alt="illustration"
          style={{ width: "120px", marginBottom: "20px" }}
        />
        <h5 className="mb-3">Add Section</h5>
        <p>Start adding sections to build your course</p>
        <button className="btn btn-success px-4 mt-2">+ ADD SECTION</button>
      </div>
    </div>
  );
};

export default AddSection;
