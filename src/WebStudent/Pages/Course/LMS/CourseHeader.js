// components/CourseHeader.js
import React from "react";

const CourseHeader = ({ course }) => (
  <div className="d-flex justify-content-between align-items-center mb-4">
    <div>
      <span className="badge bg-danger text-uppercase me-2">{course.status}</span>
      <h2 className="mt-2">{course.title}</h2>
    </div>
    <div>
      <button className="btn btn-outline-secondary me-2">SETTINGS</button>
      <button className="btn btn-outline-secondary">REORDER</button>
    </div>
  </div>
);

export default CourseHeader;
