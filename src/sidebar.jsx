import React, { useState } from "react";
import { Home, LineChart, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <aside
      className={`h-screen  bg-gray-200 dark:bg-gray-800 shadow-md text-black dark:text-white flex flex-col transform transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        {!isCollapsed && (
          <span className="text-xl font-semibold transition-opacity duration-300">
            Lets Code
          </span>
        )}
        <button
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <nav className="p-4 space-y-4">
        <NavLink
          to="/table"
          className={({ isActive }) =>
            `flex items-center gap-2 w-full p-2 rounded-lg ${
              isActive ? "bg-gray-200 dark:bg-gray-700" : ""
            } hover:bg-gray-100 dark:hover:bg-gray-600`
          }
        >
          <Home className="w-5 h-5" />
          {!isCollapsed && (
            <span className="transition-opacity duration-300">
              Contest Table
            </span>
          )}
        </NavLink>
        <NavLink
          to="/visualization"
          className={({ isActive }) =>
            `flex items-center gap-2 w-full p-2 rounded-lg ${
              isActive ? "bg-gray-200 dark:bg-gray-700" : ""
            } hover:bg-gray-100 dark:hover:bg-gray-600`
          }
        >
          <LineChart className="w-5 h-5" />
          {!isCollapsed && (
            <span className="transition-opacity duration-300">
              Line-Visualization
            </span>
          )}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
