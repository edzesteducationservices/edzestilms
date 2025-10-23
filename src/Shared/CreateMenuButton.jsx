// src/Shared/CreateMenuButton.jsx
import React from "react";
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { FaPlus, FaDatabase, FaClipboardList, FaBookOpen, FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/**
 * Reusable "Create" menu button.
 * Props:
 *  - label: string (default "Create")
 *  - items: [{ label, to, icon }]  // each opens a route
 *  - color, variant, sx: optional MUI styling
 */
export default function CreateMenuButton({
  label = "Create",
  items = [],
  color = "primary",
  variant = "contained",
  sx = {},
}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleGo = (to) => {
    handleClose();
    if (to) navigate(to);
  };

  // sensible defaults if items were not provided
  const defaultItems = [
    { label: "Question Bank", to: "/admin/qbank/upload", icon: <FaDatabase /> },
    { label: "MockTest",     to: "/admin/mocktests", icon: <FaClipboardList /> },
    { label: "Course",        to: "/admin/courses/create",  icon: <FaBookOpen /> },
    { label: "E-Book",        to: "/admin/ebook/create",    icon: <FaFileAlt /> },
  ];

  const list = items.length ? items : defaultItems;

  return (
    <>
      <Button
        startIcon={<FaPlus />}
        variant={variant}
        color={color}
        onClick={handleOpen}
        sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600, px: 3, py: 1, ...sx }}
      >
        {label}
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {list.map((it) => (
          <MenuItem key={it.label} onClick={() => handleGo(it.to)}>
            {it.icon && <ListItemIcon style={{ minWidth: 32 }}>{it.icon}</ListItemIcon>}
            <ListItemText>{it.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
