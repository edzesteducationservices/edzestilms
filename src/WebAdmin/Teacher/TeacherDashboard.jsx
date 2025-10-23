import React, { useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import DashboardHeader from "../../Shared/DashboardHeader";

export default function TeacherDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarCols = isCollapsed ? "col-md-1 col-lg-1" : "col-md-3 col-lg-2";
  const contentCols = isCollapsed ? "col-12 col-md-11 col-lg-11" : "col-12 col-md-9 col-lg-10";

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        {/* Sidebar (md+) */}
        <div className={`d-none d-md-block bg-dark ${sidebarCols}`}>
          <TeacherSidebar
            isCollapsed={isCollapsed}
            toggleSidebar={() => setIsCollapsed((prev) => !prev)}
          />
        </div>

        {/* Offcanvas (mobile) */}
        <div
          className="offcanvas offcanvas-start bg-dark text-white d-md-none"
          tabIndex="-1"
          id="mobileSidebar"
          aria-labelledby="mobileSidebarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="mobileSidebarLabel">Teacher</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body p-0">
            <TeacherSidebar isCollapsed={false} toggleSidebar={() => {}} />
          </div>
        </div>

        {/* Content */}
        <div className={`${contentCols} d-flex flex-column min-vh-100 bg-light`}>
          <DashboardHeader />

          <div className="container-fluid py-4 flex-grow-1 overflow-auto">
            <h2 className="fw-bold text-dark mb-3">Teacher Dashboard</h2>
            <p className="text-muted mb-4">Manage classes, assignments, and attendance.</p>

            <div className="row g-3">
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">My Classes</h5>
                    <p className="card-text text-muted">View your batches and schedules.</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">Assignments</h5>
                    <p className="card-text text-muted">Create, grade, and track submissions.</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">Attendance</h5>
                    <p className="card-text text-muted">Mark attendance and view reports.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </div>
      </div>
    </div>
  );
}
