// components/SectionList.js
import React from "react";
import { useNavigate } from "react-router-dom";

const SectionList = ({ sections, courseId }) => {
  const navigate = useNavigate();

  if (sections.length === 0) {
    return (
      <div className="text-center border border-2 border-secondary-subtle rounded p-5 bg-light">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3757/3757832.png"
          alt="Add section"
          width="150"
          className="mb-3"
        />
        <p className="mb-3">Start adding sections to build your course</p>
        <button
          className="btn btn-success"
          data-bs-toggle="offcanvas"
          data-bs-target="#addSectionDrawer"
        >
          + ADD SECTION
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between">
        <span>Sections</span>
        <button
          className="btn btn-sm btn-outline-success"
          data-bs-toggle="offcanvas"
          data-bs-target="#addSectionDrawer"
        >
          + Add Section
        </button>
      </div>
      <ul className="list-group list-group-flush">
        {sections.map((sec) => (
          <li key={sec._id} className="list-group-item d-flex justify-content-between align-items-center">
            {sec.title}
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => navigate(`/course/${courseId}/section/${sec._id}`)}
            >
              View
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SectionList;
