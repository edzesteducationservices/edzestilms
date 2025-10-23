import React, { useState } from "react";
import StudentSidebar from "./StudentSidebar";
import DashboardHeader from "../../Shared/DashboardHeader";

export default function StudentDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dynamic classes so sidebar + content always add up to 12
  const sidebarCols = isCollapsed ? "col-md-1 col-lg-1" : "col-md-3 col-lg-2";
  const contentCols = isCollapsed ? "col-12 col-md-11 col-lg-11" : "col-12 col-md-9 col-lg-10";

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        {/* Sidebar column (md and up) */}
        <div className={`d-none d-md-block bg-dark ${sidebarCols}`}>
          <StudentSidebar
            isCollapsed={isCollapsed}
            toggleSidebar={() => setIsCollapsed((prev) => !prev)}
          />
        </div>

        {/* Offcanvas sidebar for mobile */}
        <div
          className="offcanvas offcanvas-start bg-dark text-white d-md-none"
          tabIndex="-1"
          id="mobileSidebar"
          aria-labelledby="mobileSidebarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="mobileSidebarLabel">Student</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body p-0">
            {/* Show full labels inside offcanvas */}
            <StudentSidebar isCollapsed={false} toggleSidebar={() => {}} />
          </div>
        </div>

        {/* Main content column */}
        <div className={`${contentCols} d-flex flex-column min-vh-100 bg-light`}>
          <DashboardHeader />

          <div className="container-fluid py-4 flex-grow-1 overflow-auto">
            <h2 className="fw-bold text-dark mb-3">Welcome to Your Dashboard</h2>
            <p className="text-muted mb-4">
              Here you’ll see your course progress, enrolled lessons, mock tests, and more.
            </p>

            <div className="row g-3">
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">My Courses</h5>
                    <p className="card-text text-muted">View and continue your courses.</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">Mock Tests</h5>
                    <p className="card-text text-muted">Attempt PMP mock exams and track performance.</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">Performance</h5>
                    <p className="card-text text-muted">Check your scores, weak areas, and reports.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> {/* /content */}
      </div>
    </div>
  );
}
