// components/AddSectionDrawer.js
import React from "react";

const AddSectionDrawer = ({ sectionTitle, setSectionTitle, handleSaveSection }) => (
  <div
    className="offcanvas offcanvas-end"
    tabIndex="-1"
    id="addSectionDrawer"
    aria-labelledby="addSectionDrawerLabel"
  >
    <div className="offcanvas-header">
      <h5 className="offcanvas-title" id="addSectionDrawerLabel">
        Add Section
      </h5>
      <button
        type="button"
        className="btn-close text-reset"
        id="closeDrawerBtn"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
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
        <button className="btn btn-secondary me-2" data-bs-dismiss="offcanvas">
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
);

export default AddSectionDrawer;




