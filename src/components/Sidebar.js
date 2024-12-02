import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-full w-64 p-4">
      <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
      <ul>
        <li className="mb-4">
          <Link to="/product" className="flex items-center space-x-2">
            <span>📦</span>
            <span>Products</span>
          </Link>
        </li>
        <li className="mb-4">
          <a href="/order" className="flex items-center space-x-2">
            <span>🛒</span>
            <span>Orders</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
