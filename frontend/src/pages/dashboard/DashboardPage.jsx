import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useClock from '../../hooks/useClock';
import StatCard from '../../components/StatCard';
import BrutalistCard from '../../components/BrutalistCard';
import BrutalistButton from '../../components/BrutalistButton';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorState from '../../components/ErrorState';
import { fetchStatsSummary, fetchDashboardChartsData } from '../../store/analyticsSlice';
import { addSystemLog } from '../../store/uiSlice';

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const systemTime = useClock();
  
  const { stats, charts, loading, error } = useSelector((state) => state.analytics);

  const initDashboard = () => {
    dispatch(addSystemLog('Re-initializing dashboard data link'));
    dispatch(fetchStatsSummary());
    dispatch(fetchDashboardChartsData());
  };

  useEffect(() => {
    dispatch(fetchStatsSummary());
    dispatch(fetchDashboardChartsData());
    dispatch(addSystemLog('Accessed central dashboard console'));
  }, [dispatch]);

  if (loading && stats.totalCount === 0) {
    return <LoadingSkeleton type="card" count={3} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={initDashboard}
      />
    );
  }

  // Fallbacks & formatted values
  const totalGames = stats.totalCount ? stats.totalCount.toLocaleString() : "12,409";
  const avgRating = stats.averageRating ? Number(stats.averageRating).toFixed(1) : "8.4";
  const avgPrice = stats.averagePrice ? Number(stats.averagePrice).toFixed(2) : "29.99";
  
  // Calculate a mock liquid revenue based on average price & counts
  const dailyRevenue = (stats.totalCount * stats.averagePrice * 0.005) || 2482091.44;
  const formattedRevenue = `$${dailyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const mockUpdates = [
    { time: '02:45:12', msg: 'SYNCING ELDEN RING DATA...', icon: 'sync', active: true },
    { time: '01:30:00', msg: 'PATCH 1.04 DEPLOYED', icon: 'deployed_code', active: true },
    { time: '23:15:04', msg: 'ENCRYPTION HANDSHAKE RE-VERIFIED', icon: 'security', active: false }
  ];

  const regionalTraffic = [
    { region: 'US_EAST', yieldVal: 85201, width: 'w-[85%]' },
    { region: 'EU_WEST', yieldVal: 64882, width: 'w-[64%]' },
    { region: 'ASIA_EAST', yieldVal: 90402, width: 'w-[90%]' },
    { region: 'LATAM_SOUTH', yieldVal: 35211, width: 'w-[35%]' },
    { region: 'OCEANIA', yieldVal: 18901, width: 'w-[18%]' }
  ];

  return (
    <div className="flex flex-col select-none">
      {/* Header section */}
      <div className="mb-12 border-b-4 border-black dark:border-white pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-black dark:text-white">
        <div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-black uppercase tracking-tighter leading-none mb-2">
            STEAM OPERATIONAL MANIFESTO
          </h1>
          <p className="font-mono text-xs md:text-sm max-w-2xl bg-black text-white dark:bg-white dark:text-black inline-block px-2 py-1 uppercase">
            CENTRALIZED GAMING ANALYTICS // REVISION 4.0.12 // STATUS: OPERATIONAL
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <span className="text-[10px] font-mono uppercase opacity-60">SYSTEM TIME:</span>
          <span className="text-xl md:text-2xl font-mono font-bold" id="clock">{systemTime}</span>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Metric 1: Total Games */}
        <StatCard
          num="01"
          label="POPULATION"
          value={totalGames}
          title="TOTAL GAMES INDEXED"
          icon="analytics"
          variant="light"
          progress={75}
          watermarkIcon="videogame_asset"
        />

        {/* Metric 2: Average Rating */}
        <StatCard
          num="02"
          label="PERFORMANCE"
          value={avgRating}
          title="AVG RATING COEFFICIENT"
          icon="star"
          variant="primary"
          segments={{ active: Math.round(parseFloat(avgRating) / 2) || 4, total: 5 }}
        />

        {/* Metric 3: Liquidity (Revenue Yield) */}
        <StatCard
          num="03"
          label="LIQUIDITY"
          value={formattedRevenue}
          title="DAILY REVENUE YIELD"
          icon="payments"
          variant="dark"
          statusText="+12.4% FROM LAST CYCLE"
        />
      </div>

      {/* Main Workspace grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-black dark:text-white">
        {/* Left Side: Updates & Imagery (Bento Span 4) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="border-l-4 border-primary pl-4">
            <h2 className="text-xl font-headline font-black uppercase italic tracking-tighter">
              LATEST SYSTEM UPDATES
            </h2>
          </div>
          
          <div className="space-y-4">
            {mockUpdates.map((up, idx) => (
              <div 
                key={idx}
                className={`border-2 border-black dark:border-white p-4 flex gap-4 items-center bg-white dark:bg-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)] ${
                  up.active ? 'border-l-8 border-l-primary' : 'opacity-65 hover:opacity-100 transition-opacity'
                }`}
              >
                <div className="w-10 h-10 bg-black text-[#D90429] dark:bg-white dark:text-black flex items-center justify-center border border-black">
                  <span className="material-symbols-outlined">{up.icon}</span>
                </div>
                <div className="flex-1 truncate">
                  <div className="font-mono text-[9px] uppercase font-bold opacity-50">{up.time}</div>
                  <div className="font-bold text-xs uppercase truncate">{up.msg}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Cybernetic visual image */}
          <div className="border-2 border-black dark:border-white bg-black aspect-square overflow-hidden relative mt-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]">
            <img 
              alt="Cybernetic Hardware" 
              className="w-full h-full object-cover opacity-50 mix-blend-luminosity grayscale contrast-150" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV-93ifWZJgxJ4ySPjb7Efwjb9x9y3Jv2CPBOYjdljBRVSRDdsqYBRQEI6rPVjQ9F3kvlhYleigqqxjpfAMr7RiR8MreIoBoq9FOJjnmVU0c7LyWOITvpoGpHznymu11S7PzOLrxjYoD7YGUIzTDbdT_5lRfVdUKqBjW7mdHwiXoSydD7XzqTJllQNu2G4dfMrr9TPkdA0y_inSfRSlqYHGvCXaMWExXMgVRIoWA7bvZ9HyDe8xik2Siq-jPdb3_yuHvoTTBIpNWQ"
            />
            <div className="absolute inset-0 border-[6px] border-black pointer-events-none" />
            <div className="absolute top-4 left-4 bg-primary text-white px-2 py-0.5 font-mono text-[9px] uppercase font-bold">
              VISUAL_FEED_01
            </div>
          </div>
        </div>

        {/* Right Side: Charts & Tables (Bento Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          <BrutalistCard 
            hoverable={false}
            header={
              <div className="flex justify-between items-center w-full">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary"></span>
                  SYSTEM PARAMETERS // REGIONAL TRAFFIC YIELD
                </span>
                <span className="text-xs font-mono lowercase opacity-50">REF_ID: REGION_X8</span>
              </div>
            }
          >
            {/* Regional Traffic bars */}
            <div className="space-y-4 my-2">
              {regionalTraffic.map((traffic, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-mono text-xs uppercase font-bold">
                    <span>{traffic.region}</span>
                    <span>{traffic.yieldVal.toLocaleString()} PACKETS</span>
                  </div>
                  <div className="h-6 bg-black/10 dark:bg-white/10 border-2 border-black dark:border-white relative flex items-center">
                    <div className={`h-full bg-primary ${traffic.width} border-r border-black`} />
                  </div>
                </div>
              ))}
            </div>
          </BrutalistCard>

          {/* Top Performers Table */}
          <BrutalistCard 
            hoverable={false}
            header={
              <div className="flex justify-between items-center w-full">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-black dark:bg-white"></span>
                  TOP PERFORMERS REGISTER
                </span>
                <BrutalistButton 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard/registry')}
                  className="text-[10px] py-1 px-2 border"
                >
                  FULL ARCHIVE
                </BrutalistButton>
              </div>
            }
          >
            <div className="overflow-x-auto my-2">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-black dark:border-white text-black/50 dark:text-white/50 uppercase">
                    <th className="pb-2 font-bold">RANK</th>
                    <th className="pb-2 font-bold">TITLE</th>
                    <th className="pb-2 font-bold text-right">POPULARITY</th>
                    <th className="pb-2 font-bold text-right">RATING</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/10 uppercase text-black dark:text-white">
                  {charts.trendingGames && charts.trendingGames.slice(0, 4).map((game, idx) => (
                    <tr 
                      key={game.appid} 
                      className="hover:bg-primary/10 cursor-crosshair transition-colors"
                      onClick={() => navigate(`/dashboard/game/${game.appid}`)}
                    >
                      <td className="py-3 font-bold text-primary">#0{idx + 1}</td>
                      <td className="py-3 font-headline font-black text-sm tracking-tight">{game.title}</td>
                      <td className="py-3 text-right">{(game.downloads || 15000).toLocaleString()} DLS</td>
                      <td className="py-3 text-right font-bold">{(game.rating || 8.5).toFixed(1)}/10</td>
                    </tr>
                  ))}
                  {(!charts.trendingGames || charts.trendingGames.length === 0) && (
                    <>
                      <tr className="hover:bg-primary/10 cursor-crosshair" onClick={() => navigate('/dashboard/registry')}>
                        <td className="py-3 font-bold text-primary">#01</td>
                        <td className="py-3 font-headline font-black text-sm tracking-tight">ELDEN RING</td>
                        <td className="py-3 text-right">85,409 DLS</td>
                        <td className="py-3 text-right font-bold">9.6/10</td>
                      </tr>
                      <tr className="hover:bg-primary/10 cursor-crosshair" onClick={() => navigate('/dashboard/registry')}>
                        <td className="py-3 font-bold text-primary">#02</td>
                        <td className="py-3 font-headline font-black text-sm tracking-tight">CYBERPUNK 2077</td>
                        <td className="py-3 text-right">62,901 DLS</td>
                        <td className="py-3 text-right font-bold">8.6/10</td>
                      </tr>
                      <tr className="hover:bg-primary/10 cursor-crosshair" onClick={() => navigate('/dashboard/registry')}>
                        <td className="py-3 font-bold text-primary">#03</td>
                        <td className="py-3 font-headline font-black text-sm tracking-tight">HOLLOW KNIGHT</td>
                        <td className="py-3 text-right">48,221 DLS</td>
                        <td className="py-3 text-right font-bold">9.0/10</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </BrutalistCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
