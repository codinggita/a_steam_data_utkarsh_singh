import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleSidebar, toggleDarkMode, addSystemLog } from '../store/uiSlice';
import { setFilters, fetchGames } from '../store/gamesSlice';
import { logoutUser } from '../store/authSlice';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const darkMode = useSelector((state) => state.ui.darkMode);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(addSystemLog(`Searching system for: "${searchVal}"`));
    dispatch(setFilters({ search: searchVal }));
    dispatch(fetchGames());
    navigate('/dashboard/registry');
  };

  const handleTerminateSession = async () => {
    if (window.confirm('CONFIRM TERMINATION OF SECURE CHANNEL?')) {
      dispatch(addSystemLog('Terminating session'));
      await dispatch(logoutUser());
      toast.success('Session Terminated. Channel Closed.');
      navigate('/login');
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-6 py-4 bg-[#EAE7DC] dark:bg-black border-b-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] select-none">
      <div className="flex items-center">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="md:hidden mr-3 p-1 border-2 border-black dark:border-white hover:bg-primary hover:text-white active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-crosshair"
          title="Toggle Navigation"
        >
          <span className="material-symbols-outlined block font-bold">menu</span>
        </button>

        <div className="text-sm md:text-xl font-headline font-black text-black dark:text-white uppercase tracking-tighter">
          MOMENTUM OS v4.0.12 // ENCRYPTED CHANNEL
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* System Query Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="bg-transparent border-2 border-black dark:border-white text-black dark:text-white px-4 py-1 font-mono text-sm focus:ring-0 focus:outline-none w-48 md:w-64 cursor-crosshair"
            placeholder="QUERY SYSTEM..."
            type="text"
          />
          {searchVal && (
            <button 
              type="button"
              onClick={() => { setSearchVal(''); dispatch(setFilters({ search: '' })); dispatch(fetchGames()); }}
              className="absolute right-2 top-1.5 text-black dark:text-white hover:text-primary font-bold"
            >
              ×
            </button>
          )}
        </form>

        <div className="flex gap-2">
          {/* Toggle Theme (Terminal Vibes) */}
          <button
            onClick={() => {
              dispatch(toggleDarkMode());
              dispatch(addSystemLog(`Theme mode changed to ${!darkMode ? 'dark' : 'light'}`));
            }}
            className="p-2 border-2 border-black dark:border-white hover:bg-primary hover:text-white dark:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-none cursor-crosshair"
            title="Toggle System Theme Mode"
          >
            <span className="material-symbols-outlined block">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Secure Lock (Logout) */}
          <button
            onClick={handleTerminateSession}
            className="p-2 border-2 border-black dark:border-white hover:bg-[#D90429] hover:text-white dark:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-none cursor-crosshair"
            title="Terminate Session"
          >
            <span className="material-symbols-outlined block">lock</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              dispatch(addSystemLog('Accessing configuration parameters'));
              toast.error('ACCESS DENIED: LEVEL 6 PRIVILEGES REQUIRED');
            }}
            className="p-2 border-2 border-black dark:border-white hover:bg-[#D90429] hover:text-white dark:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-none cursor-crosshair"
            title="System Settings"
          >
            <span className="material-symbols-outlined block">settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
