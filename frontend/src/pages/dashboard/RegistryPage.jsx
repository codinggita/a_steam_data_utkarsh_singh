import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useGames from '../../hooks/useGames';
import useAuth from '../../hooks/useAuth';
import BrutalistCard from '../../components/BrutalistCard';
import BrutalistButton from '../../components/BrutalistButton';
import BrutalistTable from '../../components/BrutalistTable';
import Pagination from '../../components/Pagination';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorState from '../../components/ErrorState';
import { addSystemLog } from '../../store/uiSlice';
import toast from 'react-hot-toast';

export const RegistryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const {
    games,
    totalCount,
    totalPages,
    currentPage,
    limit,
    filters,
    loading,
    error,
    loadGames,
    updateFilters,
    clearFilters,
    changePage,
  } = useGames();

  // Load games whenever page, filters, or sorting changes
  useEffect(() => {
    loadGames();
    dispatch(addSystemLog(`Retrieved registry page ${currentPage}`));
  }, [currentPage, filters.genre, filters.sort, filters.platform, filters.search, dispatch]);

  const handleGenreSelect = (genre) => {
    const nextGenre = filters.genre === genre ? '' : genre;
    dispatch(addSystemLog(`Filtering registry by genre: "${nextGenre || 'ALL'}"`));
    updateFilters({ genre: nextGenre });
  };

  const handlePlatformSelect = (e) => {
    const plat = e.target.value === 'ALL SYSTEMS' ? '' : e.target.value.toLowerCase();
    dispatch(addSystemLog(`Filtering registry by platform: "${plat || 'ALL'}"`));
    updateFilters({ platform: plat });
  };

  const handleRefresh = () => {
    dispatch(addSystemLog('Manual refresh of game archive logs'));
    toast.success('Archive Link Synced.');
    loadGames();
  };

  const genresList = ['ACTION', 'INDIE', 'RPG', 'SIMULATION', 'ADVENTURE', 'STRATEGY'];

  const columns = [
    { 
      key: 'appid', 
      label: 'APPID',
      className: 'border-r-2 border-black dark:border-white font-bold',
      render: (row) => `#${row.appid}`
    },
    { 
      key: 'title', 
      label: 'TITLE',
      className: 'border-r-2 border-black dark:border-white font-headline font-black text-sm md:text-lg uppercase tracking-tight',
      render: (row) => (
        <span 
          className="hover:text-primary transition-colors cursor-crosshair"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/game/${row.appid}`);
          }}
        >
          {row.title}
        </span>
      )
    },
    { 
      key: 'genres', 
      label: 'GENRE',
      className: 'border-r-2 border-black dark:border-white hidden sm:table-cell',
      render: (row) => (
        <span className="bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 text-xs font-bold font-mono">
          {Array.isArray(row.genres) ? row.genres[0] : row.genres || 'N/A'}
        </span>
      )
    },
    { 
      key: 'price', 
      label: 'PRICE',
      className: 'border-r-2 border-black dark:border-white',
      render: (row) => row.isFreeToPlay ? 'FREE' : `$${(row.price || 0).toFixed(2)}`
    },
    { 
      key: 'rating', 
      label: 'RATING',
      render: (row) => (
        <div className="flex items-center gap-1.5 font-bold">
          <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
          <span>{row.rating ? `${Math.round(row.rating * 10)}/100` : 'N/A'}</span>
        </div>
      )
    }
  ];

  // If user is admin, add actions column for edit/delete
  if (user && user.role === 'admin') {
    columns.push({
      key: 'actions',
      label: 'PROTOCOLS',
      className: 'text-center',
      render: (row) => (
        <div className="flex gap-2 justify-center" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/dashboard/game/${row.appid}/edit`)}
            className="p-1 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-crosshair active:translate-y-px"
            title="Edit Registry Entry"
          >
            <span className="material-symbols-outlined text-sm block">edit</span>
          </button>
        </div>
      )
    });
  }

  return (
    <div className="flex flex-col select-none text-black dark:text-white">
      {/* Header section */}
      <div className="mb-10 border-b-4 border-black dark:border-white pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter leading-none mb-2">
            GAME REGISTRY
          </h1>
          <p className="font-mono text-xs md:text-sm max-w-2xl bg-black text-white dark:bg-white dark:text-black inline-block px-2 py-1 uppercase">
            OPERATIONAL LOG: SECURE DATA SYSTEM INDEX
          </p>
        </div>
        <div className="flex gap-3 self-stretch sm:self-auto">
          {user && user.role === 'admin' && (
            <BrutalistButton 
              variant="primary" 
              onClick={() => navigate('/dashboard/game/create')}
              className="flex-1 sm:flex-none py-1.5 px-3 text-xs"
            >
              NEW ENTRY
            </BrutalistButton>
          )}
          <BrutalistButton 
            variant="secondary" 
            onClick={handleRefresh}
            className="flex-1 sm:flex-none py-1.5 px-3 text-xs"
          >
            RELOAD
          </BrutalistButton>
        </div>
      </div>

      {/* Filter and stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Genre buttons filter */}
        <div className="md:col-span-1 border-4 border-black dark:border-white p-6 bg-white dark:bg-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]">
          <h3 className="font-headline font-black text-2xl uppercase mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-primary"></span> GENRE PROTOCOL
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilters({ genre: '' })}
              className={`px-3 py-1.5 border-2 border-black dark:border-white font-label font-bold uppercase text-xs transition-none cursor-crosshair ${
                !filters.genre
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-white text-black dark:bg-neutral-800 dark:text-white hover:bg-primary hover:text-white'
              }`}
            >
              ALL
            </button>
            {genresList.map((g) => {
              const isActive = filters.genre.toLowerCase() === g.toLowerCase();
              return (
                <button
                  key={g}
                  onClick={() => handleGenreSelect(g)}
                  className={`px-3 py-1.5 border-2 border-black dark:border-white font-label font-bold uppercase text-xs transition-none cursor-crosshair ${
                    isActive
                      ? 'bg-black text-white dark:bg-white dark:text-black font-black'
                      : 'bg-white text-black dark:bg-neutral-800 dark:text-white hover:bg-primary hover:text-white'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Platform select filter */}
        <div className="md:col-span-1 border-4 border-black dark:border-white p-6 bg-white dark:bg-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between">
          <div>
            <h3 className="font-headline font-black text-2xl uppercase mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-black dark:bg-white"></span> PLATFORM
            </h3>
            <select
              value={filters.platform ? filters.platform.toUpperCase() : 'ALL SYSTEMS'}
              onChange={handlePlatformSelect}
              className="w-full border-2 border-black dark:border-white p-2.5 font-label font-bold uppercase focus:ring-0 focus:border-primary rounded-none bg-[#EAE7DC] dark:bg-neutral-800 text-black dark:text-white cursor-crosshair text-sm"
            >
              <option value="ALL SYSTEMS">ALL SYSTEMS</option>
              <option value="WINDOWS">WINDOWS</option>
              <option value="MAC">MAC / APPLE</option>
              <option value="LINUX">LINUX / STEAMOS</option>
            </select>
          </div>

          {filters.search && (
            <div className="mt-3 flex justify-between items-center bg-primary/10 border border-primary p-2 text-xs font-mono">
              <span className="truncate uppercase font-bold text-primary">SEARCH: "{filters.search}"</span>
              <button 
                onClick={() => {
                  dispatch(addSystemLog('Clearing search filter'));
                  updateFilters({ search: '' });
                }} 
                className="font-bold hover:text-primary pl-2 text-sm"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* System integrity indicator */}
        <div className="md:col-span-1 border-4 border-black dark:border-white p-6 bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-[140px]">
          <div className="font-mono text-xs uppercase opacity-80">System.integrity</div>
          <div className="font-headline font-black text-4xl">98.4%</div>
          <div className="w-full bg-black h-2 mt-2 border border-white">
            <div className="bg-white h-full w-[98.4%]"></div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-8">
          <ErrorState message={error} onRetry={loadGames} />
        </div>
      )}

      {/* Game register table */}
      <div className="border-4 border-black dark:border-white bg-white dark:bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] overflow-hidden">
        <div className="bg-black text-white dark:bg-white dark:text-black p-4 font-headline font-black uppercase flex flex-col sm:flex-row justify-between sm:items-center gap-2 select-none">
          <span>ACTIVE REGISTRY ENTRIES [{totalCount || 0} TOTAL]</span>
          <span className="font-mono text-xs opacity-75">
            REF: {new Date().toISOString().slice(0, 19).replace('T', ' ')}
          </span>
        </div>
        
        <BrutalistTable
          columns={columns}
          data={games}
          loading={loading}
          onRowClick={(row) => navigate(`/dashboard/game/${row.appid}`)}
          emptyMessage="NO MATCHING RECORD CONSTRAINTS SECURED."
        />

        {/* Pagination controls */}
        {!loading && games.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
            totalResults={totalCount}
            pageSize={limit}
          />
        )}
      </div>

      {/* Dynamic bottom details widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="p-4 border-2 border-black dark:border-white bg-white dark:bg-neutral-900 flex items-center gap-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-black text-white dark:bg-white dark:text-black p-3">
            <span className="material-symbols-outlined block">memory</span>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase opacity-65">CPU_USAGE</div>
            <div className="font-headline font-black text-2xl">42.8%</div>
          </div>
        </div>
        <div className="p-4 border-2 border-black dark:border-white bg-white dark:bg-neutral-900 flex items-center gap-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-black text-white dark:bg-white dark:text-black p-3">
            <span className="material-symbols-outlined block">database</span>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase opacity-65">DB_RESPONSE</div>
            <div className="font-headline font-black text-2xl">1.2ms</div>
          </div>
        </div>
        <div className="p-4 border-2 border-black dark:border-white bg-white dark:bg-neutral-900 flex items-center gap-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-black text-white dark:bg-white dark:text-black p-3">
            <span className="material-symbols-outlined block">cloud_sync</span>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase opacity-65">SYNC_NODES</div>
            <div className="font-headline font-black text-2xl">12 // ACTIVE</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistryPage;
