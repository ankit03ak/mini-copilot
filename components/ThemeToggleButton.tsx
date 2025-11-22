
"use client";

import { IconButton, Tooltip } from "@mui/material";
import { useThemeMode } from "./ThemeRegistry";

export default function ThemeToggleButton() {
  const { mode, toggleMode } = useThemeMode();

  const label =
    mode === "dark" ? "Switch to light mode" : "Switch to dark mode";
  const icon = mode === "dark" ? "🔆" : "🌙";

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={toggleMode}
        color="inherit"
        size="small"
        aria-label={label}
      >
        <span style={{ fontSize: 18 }} role="img" aria-hidden="true">
          {icon}
        </span>
      </IconButton>
    </Tooltip>
  );
}