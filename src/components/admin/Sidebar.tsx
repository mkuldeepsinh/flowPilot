"use client";

import React from "react";
import { Dashboard, AccountBalance, Receipt, Settings } from "@mui/icons-material";

const navItems = [
  { label: "Dashboard", icon: <Dashboard />, href: "/admin" },
  { label: "Accounts", icon: <AccountBalance />, href: "/admin/accounts" },
  { label: "Transactions", icon: <Receipt />, href: "/admin/transactions" },
  { label: "Settings", icon: <Settings />, href: "/admin/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-blue-100 shadow h-screen p-6 hidden md:block">
      <div className="text-2xl font-bold mb-8 text-black">Admin</div>
      <nav>
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.label}>
              <a href={item.href} className="flex items-center space-x-3 text-black hover:text-blue-900">
                {item.icon}
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
