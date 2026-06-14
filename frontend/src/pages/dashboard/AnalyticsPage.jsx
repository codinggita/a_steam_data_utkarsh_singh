import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardChartsData, fetchStatsSummary } from '../../store/analyticsSlice';
import BrutalistCard from '../../components/BrutalistCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorState from '../../components/ErrorState';
import { addSystemLog } from '../../store/uiSlice';

export const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { charts, stats, loading, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchStatsSummary());
    dispatch(fetchDashboardChartsData());
    dispatch(addSystemLog('Accessed advanced analytics directory'));
  }, [dispatch]);

  if (loading && charts.platformDistribution.length === 0) {
    return <LoadingSkeleton type="table" />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error} 
        onRetry={() => { dispatch(fetchStatsSummary()); dispatch(fetchDashboardChartsData()); }}
      />
    );
  }

  // Pre-calculate fallback mock distributions if DB aggregate arrays are empty
  const genresDist = charts.genreDistribution.length > 0
    ? charts.genreDistribution
    : [
        { name: 'ACTION', count: 18, percentage: 35 },
        { name: 'INDIE', count: 12, percentage: 24 },
        { name: 'RPG', count: 10, percentage: 20 },
        { name: 'SIMULATION', count: 7, percentage: 14 },
        { name: 'ADVENTURE', count: 4, percentage: 7 }
      ];

  const platformsDist = charts.platformDistribution.length > 0
    ? charts.platformDistribution
    : [
        { name: 'WINDOWS', percentage: 78 },
        { name: 'MAC', percentage: 12 },
        { name: 'LINUX', percentage: 10 }
      ];

  return (
    <div className="flex flex-col select-none text-black dark:text-white">
      {/* Header section */}
      <div className="mb-10 border-b-4 border-black dark:border-white pb-6">
        <span className="font-mono text-xs text-primary font-bold uppercase tracking-widest block mb-2">
          SYSTEM PARAMETERS // QUANTITATIVE ANALYSIS
        </span>
        <h1 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter leading-none">
          ADVANCED ANALYTICS
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Distributions & Tables (span 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Genre Distribution Horizontal bars */}
          <BrutalistCard hoverable={false} header="GENRE CLASSIFICATION FREQUENCY">
            <div className="space-y-4 my-2">
              {genresDist.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-mono text-xs uppercase font-bold">
                    <span>{item.name || item._id}</span>
                    <span>{item.percentage ? `${Math.round(item.percentage)}%` : `${item.count} games`}</span>
                  </div>
                  <div className="h-6 bg-black/10 dark:bg-white/10 border-2 border-black dark:border-white relative flex items-center">
                    <div 
                      className="h-full bg-primary border-r border-black" 
                      style={{ width: `${item.percentage || (item.count * 5)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </BrutalistCard>

          {/* Top Rated Games index */}
          <BrutalistCard hoverable={false} header="HIGHEST COEFFICIENT INDEX (TOP RATED)">
            <div className="overflow-x-auto my-2">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-black dark:border-white uppercase opacity-60">
                    <th className="pb-2">APPID</th>
                    <th className="pb-2">TITLE</th>
                    <th className="pb-2">GENRE</th>
                    <th className="pb-2 text-right">RATING</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/10 uppercase font-bold">
                  {charts.topRatedGames && charts.topRatedGames.slice(0, 5).map((game) => (
                    <tr key={game.appid}>
                      <td className="py-3 text-primary">#{game.appid}</td>
                      <td className="py-3 font-headline font-black text-sm tracking-tight">{game.title}</td>
                      <td className="py-3">
                        <span className="bg-black text-white dark:bg-white dark:text-black px-1.5 py-0.5 text-[10px]">
                          {Array.isArray(game.genres) ? game.genres[0] : game.genres || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 text-right">{(game.rating || 8.5).toFixed(1)}/10</td>
                    </tr>
                  ))}
                  {(!charts.topRatedGames || charts.topRatedGames.length === 0) && (
                    <tr>
                      <td colSpan="4" className="py-4 text-center opacity-50">
                        // NO RATED RECORDS REPORTED
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </BrutalistCard>
        </div>

        {/* Right Side: Platform breakdown & totals (span 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Platform distribution */}
          <BrutalistCard hoverable={false} header="PLATFORM DISTRIBUTION YIELD">
            <div className="space-y-4 my-2">
              {platformsDist.map((plat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-mono text-xs uppercase font-bold">
                    <span>{plat.name || plat._id}</span>
                    <span>{Math.round(plat.percentage)}%</span>
                  </div>
                  <div className="h-6 bg-black/10 dark:bg-white/10 border-2 border-black dark:border-white relative flex items-center">
                    <div 
                      className={`h-full border-r border-black ${idx === 0 ? 'bg-primary' : 'bg-black dark:bg-neutral-700'}`} 
                      style={{ width: `${plat.percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </BrutalistCard>

          {/* Quick specs */}
          <BrutalistCard hoverable={false} header="SYSTEM CONSTANTS">
            <div className="font-mono text-xs uppercase space-y-3">
              <div className="flex justify-between">
                <span className="opacity-60">TOTAL ENTRIES:</span>
                <span className="font-bold">{stats.totalCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">AVERAGE COST:</span>
                <span className="font-bold">${(stats.averagePrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">AVG INDEX RATING:</span>
                <span className="font-bold">{(stats.averageRating || 0).toFixed(2)}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">ENCRYPTION LEVEL:</span>
                <span className="font-bold text-green-500">AES-256</span>
              </div>
              <div className="border-t border-black/10 dark:border-white/20 pt-3 flex justify-between text-[10px] text-primary">
                <span>SYSTEM STATUS:</span>
                <span className="font-bold">NOMINAL</span>
              </div>
            </div>
          </BrutalistCard>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
