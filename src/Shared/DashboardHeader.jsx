import React from "react";
import { useAuth } from "../LoginSystem/context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();

  const hours = new Date().getHours();
  const greeting =
    hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="bg-white shadow-sm border-bottom p-3 d-flex align-items-center justify-content-between">
      {/* Left: Mobile menu button */}
      <button
        className="btn btn-outline-secondary d-md-none"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#mobileSidebar"
        aria-controls="mobileSidebar"
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Right: Modern User Badge (aligned right) */}
      <div className="d-flex align-items-center ms-auto bg-light rounded-pill px-3 py-2 shadow-sm">
        {/* Avatar circle with initials */}
        <div
          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
          style={{ width: "40px", height: "40px", fontWeight: "600" }}
        >
          {(user?.name || "S").charAt(0).toUpperCase()}
        </div>

        {/* Greeting + Email */}
        <div className="d-flex flex-column lh-sm text-end">
          <h6 className="mb-0 text-dark fw-semibold">
            {greeting}, {user?.name || "Student"}
          </h6>
          <small className="text-muted">{user?.email}</small>
        </div>
      </div>
    </div>
  );
}
