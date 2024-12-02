import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <Header/> 
      </div>
    </div>
  );
};

export default AdminDashboard;
