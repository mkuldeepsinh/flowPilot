"use client";
import React from "react";
import { Avatar, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-blue-100 shadow px-6 py-4">
      <div className="text-xl font-bold text-blue-900">Finance Management Admin</div>
      <div className="flex items-center space-x-4">
        <IconButton sx={{ color: '#1e3a8a' }}>
          <SettingsIcon />
        </IconButton>
        <Avatar alt="Admin" src="/admin-avatar.png" sx={{ bgcolor: '#60a5fa' }} />
      </div>
    </header>
  );
}
