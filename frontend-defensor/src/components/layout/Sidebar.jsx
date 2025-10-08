import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  Settings,
  BarChart,
} from "lucide-react";

export const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: FolderKanban, label: "Casos", path: "/casos" },
  ];

  return (
    <aside className="w-64 bg-[#00330F] text-white flex flex-col border-r border-green-800">
      <div className="p-6 text-2xl text-[#dae2db] font-bold border-b border-green-800">
        Assistente Def Sul
      </div>
      <nav className="flex-grow p-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
