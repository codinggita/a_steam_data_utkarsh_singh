import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { addSystemLog, setSidebarOpen } from '../store/uiSlice';
import toast from 'react-hot-toast';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen, systemLogs } = useSelector((state) => state.ui);

  const handleTerminateSession = async () => {
    if (window.confirm('CONFIRM TERMINATION OF SECURE CHANNEL?')) {
      dispatch(addSystemLog('Terminating session'));
      await dispatch(logoutUser());
      toast.success('Session Terminated. Channel Closed.');
      navigate('/login');
    }
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard', end: true },
    { path: '/dashboard/overview', label: 'Overview', icon: 'gavel' },
    { path: '/dashboard/registry', label: 'Registry', icon: 'folder_shared' },
    { path: '/dashboard/analytics', label: 'Analytics', icon: 'monitoring' },
  ];

  // If user is admin, add admin link
  if (user && user.role === 'admin') {
    navLinks.push({ path: '/dashboard/admin', label: 'Admin Terminal', icon: 'admin_panel_settings' });
  }

  const activeClass = "bg-primary text-white border-2 border-black dark:border-white -ml-2 p-3 w-[calc(100%+8px)] flex items-center gap-3 font-label font-bold uppercase transition-none brutalist-shadow-sm";
  const inactiveClass = "flex items-center gap-3 p-3 border-b border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-none font-label font-bold uppercase";

  return (
    <nav 
      className={`fixed left-0 top-0 h-full pt-24 flex flex-col z-40 bg-[#EAE7DC] dark:bg-black border-r-2 border-black dark:border-white w-64 transition-transform duration-200 ease-in-out md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Operator Metadata */}
      <div className="px-6 mb-6 mt-4 select-none">
        <div className="text-lg font-headline font-black text-primary uppercase truncate" title={user?.name || 'OPERATOR'}>
          {user?.name || 'OPERATOR'}
        </div>
        <div className="text-[10px] font-mono tracking-widest opacity-70 uppercase text-black dark:text-white">
          CLEARANCE LEVEL: {user?.role === 'admin' ? '5 (ADMIN)' : '1 (STANDARD)'}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col flex-1 overflow-y-auto px-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
            onClick={() => dispatch(setSidebarOpen(false))}
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span className="text-sm tracking-tight">{link.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Embedded Terminal Log Feed (Bottom Pane) */}
      <div className="p-3 bg-black text-[#00FF00] font-mono text-[9px] border-t-2 border-black border-b-2 h-36 overflow-y-auto select-none">
        <div className="text-white border-b border-white/20 pb-1 mb-1 font-bold tracking-widest text-[8px]">
          LOGSTREAM://SECURE_CHANNEL
        </div>
        {systemLogs.map((log, index) => (
          <div key={index} className="leading-tight truncate">
            {log}
          </div>
        ))}
      </div>

      {/* Sidebar Footer Controls */}
      <div className="p-4 border-t-2 border-black dark:border-white bg-[#EAE7DC] dark:bg-black space-y-2 select-none">
        <button 
          onClick={() => {
            dispatch(addSystemLog('Reading core diagnostics'));
            toast.success('Core Diagnostics: Integrity 100%');
          }}
          className="w-full flex items-center gap-3 text-[10px] font-mono uppercase opacity-75 hover:opacity-100 text-black dark:text-white"
        >
          <span className="material-symbols-outlined text-xs">terminal</span> System Integrity
        </button>
        <button 
          onClick={() => {
            dispatch(addSystemLog('Requesting system support'));
            toast.success('Support Channel Initialized. Queue Position: 1');
          }}
          className="w-full flex items-center gap-3 text-[10px] font-mono uppercase opacity-75 hover:opacity-100 text-black dark:text-white"
        >
          <span className="material-symbols-outlined text-xs">help_center</span> Operator Help
        </button>
        <button 
          onClick={handleTerminateSession}
          className="w-full mt-4 bg-black text-white dark:bg-white dark:text-black py-2 font-headline font-black uppercase text-xs tracking-wider border-2 border-black hover:bg-primary dark:hover:bg-primary dark:hover:text-white hover:text-white transition-colors cursor-crosshair"
        >
          TERMINATE SESSION
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
