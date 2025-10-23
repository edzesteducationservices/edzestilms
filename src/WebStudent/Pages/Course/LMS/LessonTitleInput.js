// components/LessonTitleInput.js
import React from "react";

const LessonTitleInput = ({ title, setTitle }) => (
  <div className="mb-3">
    <label>Lesson Title</label>
    <input
      type="text"
      className="form-control"
      placeholder="Enter title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  </div>
);

export default LessonTitleInput;
