import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ScanlineOverlay from '../components/ScanlineOverlay';
import { setSidebarOpen } from '../store/uiSlice';

export const DashboardLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  // Close sidebar on path changes (especially on mobile)
  useEffect(() => {
    dispatch(setSidebarOpen(false));
  }, [location.pathname, dispatch]);

  return (
    <div className="min-h-screen bg-canvas text-ink font-body flex flex-col">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <div className="flex flex-1 relative min-h-screen">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => dispatch(setSidebarOpen(false))}
          />
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 md:pl-64 pt-24 relative min-h-screen flex flex-col">
          <ScanlineOverlay />
          
          <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-10 z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
