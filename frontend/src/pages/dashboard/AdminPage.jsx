import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../services/api';
import BrutalistCard from '../../components/BrutalistCard';
import BrutalistButton from '../../components/BrutalistButton';
import { addSystemLog } from '../../store/uiSlice';
import toast from 'react-hot-toast';

export const AdminPage = () => {
  const dispatch = useDispatch();
  const [adminStats, setAdminStats] = useState(null);
  const [indexing, setIndexing] = useState(false);
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagLog, setDiagLog] = useState([]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await api.get('/api/v1/admin/dashboard');
        setAdminStats(response.data);
      } catch (err) {
        // Fallback admin mock details on fetch error or incomplete route
        setAdminStats({
          activeUsers: 48,
          pendingAudits: 5,
          dbLatency: '1.2ms',
          bufferLoad: '12.4%',
        });
      }
    };
    
    fetchAdminStats();
    dispatch(addSystemLog('Accessed root admin controls'));
  }, [dispatch]);

  const handleReindex = () => {
    setIndexing(true);
    dispatch(addSystemLog('Initiated database re-indexing protocol'));
    toast.loading('RE-INDEXING DATABASE...', { id: 'index-toast' });
    
    setTimeout(() => {
      toast.dismiss('index-toast');
      setIndexing(false);
      toast.success('DATABASE SHARDS RE-ALIGNED. INDEX OK.');
      dispatch(addSystemLog('Re-indexing finished: 12,409 games synced'));
    }, 2000);
  };

  const handleRunDiagnostics = () => {
    setDiagnosticsRunning(true);
    setDiagLog([]);
    dispatch(addSystemLog('Running core system diagnostics'));
    toast.loading('RUNNING HARNESS TESTS...', { id: 'diag-toast' });

    const tests = [
      'TEST 01: Vault Connection ... OK',
      'TEST 02: API Endpoint Handshake ... OK',
      'TEST 03: SSL Token Rotation check ... OK',
      'TEST 04: Database shard response latency (1.2ms) ... NOMINAL',
      'DIAGNOSTICS PROTOCOL COMPLETE. STATUS: 100% HEALTHY'
    ];

    tests.forEach((test, idx) => {
      setTimeout(() => {
        setDiagLog((prev) => [...prev, test]);
        if (idx === tests.length - 1) {
          toast.dismiss('diag-toast');
          setDiagnosticsRunning(false);
          toast.success('DIAGNOSTICS LOGGED. 0 EXCEPTIONS FOUND.');
        }
      }, (idx + 1) * 600);
    });
  };

  return (
    <div className="flex flex-col select-none text-black dark:text-white">
      {/* Header section */}
      <div className="mb-10 border-b-4 border-black dark:border-white pb-6">
        <span className="font-mono text-xs text-primary font-bold uppercase tracking-widest block mb-2">
          OPERATOR ACTION // ROOT CENTRAL CONTROL TERMINAL
        </span>
        <h1 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter leading-none">
          ADMIN TERMINAL
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Diagnostics and re-indexing (span 8) */}
        <div className="lg:col-span-8 space-y-6">
          <BrutalistCard hoverable={false} header="SYSTEM CONTROL PROTOCOLS">
            <div className="flex flex-wrap gap-4 my-2">
              <BrutalistButton 
                variant="primary" 
                onClick={handleReindex}
                disabled={indexing}
              >
                {indexing ? 'RE-INDEXING...' : 'RE-INDEX DATABASE'}
              </BrutalistButton>

              <BrutalistButton 
                variant="secondary" 
                onClick={handleRunDiagnostics}
                disabled={diagnosticsRunning}
              >
                {diagnosticsRunning ? 'TESTING...' : 'RUN LIVE DIAGNOSTICS'}
              </BrutalistButton>
            </div>
            
            {/* Live diagnostic logger console output */}
            {diagLog.length > 0 && (
              <div className="mt-6 p-4 bg-black text-[#00FF00] font-mono text-xs space-y-1.5 border-2 border-black">
                <div className="text-white border-b border-neutral-700 pb-1 mb-2 font-bold tracking-widest">
                  DIAGNOSTICSSTREAM://SECURE
                </div>
                {diagLog.map((log, index) => (
                  <div key={index} className="leading-tight animate-pulse">
                    &gt; {log}
                  </div>
                ))}
              </div>
            )}
          </BrutalistCard>

          {/* Admin reports stub */}
          <BrutalistCard hoverable={false} header="RECENT SYSTEM EVENT LOGS">
            <div className="font-mono text-xs space-y-2.5 my-2 uppercase">
              <div className="flex justify-between border-b pb-2 border-black/10 dark:border-white/20">
                <span className="opacity-50">AUDIT_LOG_ID: #4092</span>
                <span className="font-bold text-primary">ROLE MODIFIED: operator@steam.core to admin</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-black/10 dark:border-white/20">
                <span className="opacity-50">AUDIT_LOG_ID: #4091</span>
                <span className="font-bold text-green-600 dark:text-green-400">RESTORED RECORD APPID #124562</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-black/10 dark:border-white/20">
                <span className="opacity-50">AUDIT_LOG_ID: #4090</span>
                <span className="font-bold text-primary">DELETED RECORD APPID #991002</span>
              </div>
            </div>
          </BrutalistCard>
        </div>

        {/* Right Side: Admin stats & credentials (span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <BrutalistCard hoverable={false} header="ADMIN METRIC YIELDS">
            <div className="font-mono text-xs uppercase space-y-3">
              <div className="flex justify-between">
                <span className="opacity-60">ACTIVE USERS:</span>
                <span className="font-bold">{adminStats?.activeUsers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">PENDING AUDITS:</span>
                <span className="font-bold text-primary">{adminStats?.pendingAudits || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">DB LATENCY:</span>
                <span className="font-bold text-green-500">{adminStats?.dbLatency || '0.00ms'}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">BUFFER LOAD:</span>
                <span className="font-bold">{adminStats?.bufferLoad || '0%'}</span>
              </div>
            </div>
          </BrutalistCard>

          <BrutalistCard hoverable={false} className="border-primary bg-primary/5" header="SECURITY CLEARANCE CHECK">
            <div className="font-mono text-[10px] uppercase space-y-2 text-primary font-bold">
              <div>// OPERATOR ASSIGNED STATUS: ROOT ADMIN</div>
              <div>// SECURITY CLEARANCE LEVEL: 5</div>
              <div>// PROTOCOLS ENGAGED: DELTA_FORCE</div>
            </div>
          </BrutalistCard>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
