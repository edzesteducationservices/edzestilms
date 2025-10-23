import React from "react";
import {
  FaTachometerAlt,
  FaSitemap,
  FaUniversity,
  FaShieldAlt,
  FaTools,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../LoginSystem/context/AuthContext";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { id: "overview",  icon: <FaTachometerAlt />, label: "Overview" },
  { id: "tenants",   icon: <FaSitemap />,        label: "Institutes" },
  { id: "admins",    icon: <FaUniversity />,     label: "Admins" },
  { id: "security",  icon: <FaShieldAlt />,      label: "Security" },
  { id: "ops",       icon: <FaTools />,          label: "Operations" },
  { id: "analytics", icon: <FaChartLine />,      label: "Analytics" },
];

export default function SuperAdminSidebar({ isCollapsed, toggleSidebar }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="bg-dark text-white d-flex flex-column justify-content-between vh-100 position-sticky top-0">
      <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom border-secondary">
        {!isCollapsed && <h5 className="mb-0 fw-bold">SuperAdmin</h5>}
        <button
          className="btn btn-sm btn-outline-light d-none d-md-inline-flex"
          onClick={toggleSidebar}
          type="button"
        >
          {isCollapsed ? "➤" : "◀"}
        </button>
      </div>

      <div className="flex-grow-1 overflow-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className="btn btn-dark w-100 text-start d-flex align-items-center px-3 py-2"
            type="button"
          >
            <span className="fs-5 me-3">{item.icon}</span>
            <span className={`${isCollapsed ? "d-none d-md-none" : "d-inline"}`}>{item.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="btn btn-dark w-100 text-start d-flex align-items-center px-3 py-2 border-top border-secondary text-danger"
        type="button"
      >
        <FaSignOutAlt className="fs-5 me-3" />
        <span className={`${isCollapsed ? "d-none d-md-none" : "d-inline"}`}>Logout</span>
      </button>
    </div>
  );
}
