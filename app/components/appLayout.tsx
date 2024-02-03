import React from "react";
import Link from "next/link";

const AppLayout = ({ children }: any) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 p-4 text-white">
        <h1 className="text-2xl font-bold mb-4">Your App Name</h1>
        <nav>
          <ul>
            <li>
              <Link href="/">
                <div className="text-blue-500">Today&apos;s Tasks</div>
              </Link>
            </li>
            <li>
              <Link href="/upcoming">
                <div className="text-blue-500">Upcoming Tasks</div>
              </Link>
            </li>
            <li>
              <Link href="/add-task">
                <div className="text-blue-500">Add Task</div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
};

export default AppLayout;
