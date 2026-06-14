import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ScanlineOverlay from '../components/ScanlineOverlay';
import BrutalistButton from '../components/BrutalistButton';
import { addSystemLog } from '../store/uiSlice';

export const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleJoin = () => {
    dispatch(addSystemLog('Landing CTA clicked: Join the Front'));
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const mockLogs = [
    { pid: '#9821', protocol: 'DATABASE_SCAN', location: 'SECTOR_7G', operator: 'USER_402', status: 'SUCCESS', statusColor: 'text-green-600 dark:text-green-400' },
    { pid: '#9822', protocol: 'ENCRYPTION_WIPE', location: 'VAULT_01', operator: 'SYSTEM_ROOT', status: 'PENDING', statusColor: 'text-primary' },
    { pid: '#9823', protocol: 'REGISTRY_COMMIT', location: 'GLOBAL_NODE', operator: 'USER_881', status: 'SUCCESS', statusColor: 'text-green-600 dark:text-green-400' },
    { pid: '#9824', protocol: 'CORE_DIAGNOSTICS', location: 'SECTOR_01', operator: 'CRON_JOB', status: 'SUCCESS', statusColor: 'text-green-600 dark:text-green-400' },
    { pid: '#9825', protocol: 'API_OVERFLOW_SHIELD', location: 'GATEWAY_NODE', operator: 'SYSTEM_ROOT', status: 'NOMINAL', statusColor: 'text-green-600 dark:text-green-400' }
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink font-body flex flex-col relative select-none">
      <ScanlineOverlay />

      {/* Landing Top Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#EAE7DC] dark:bg-black border-b-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]">
        <div className="flex items-center gap-4">
          <span className="text-sm md:text-xl font-headline font-black text-black dark:text-white uppercase tracking-tighter">
            MOMENTUM OS v4.0.12 // ENCRYPTED CHANNEL
          </span>
        </div>
        <nav className="flex gap-4 md:gap-8 items-center font-headline font-black uppercase text-xs md:text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-black dark:text-white hover:text-primary transition-colors">
                Terminal
              </Link>
              <Link to="/dashboard/registry" className="text-black dark:text-white hover:text-primary transition-colors">
                Registry
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-black dark:text-white hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="text-primary hover:underline transition-colors">
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Bento Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[90vh] border-b-2 border-black dark:border-white pt-16">
        {/* Left Side: Headline & stats */}
        <div className="lg:col-span-7 p-8 lg:p-16 flex flex-col justify-center border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white bg-[#EAE7DC] dark:bg-neutral-900 relative">
          <div className="absolute top-4 left-4 font-mono text-[10px] opacity-35 text-black dark:text-white">
            SYSTEM_ID: STEAM_CORE_ALPHA
          </div>
          
          <h1 className="font-headline font-black text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.85] tracking-tighter uppercase mb-6 text-black dark:text-white mt-8 lg:mt-0">
            DECODE THE <span className="text-primary text-outline-black">DATABASE</span>
          </h1>
          
          <p className="font-body text-lg md:text-2xl text-black dark:text-white max-w-xl mb-10 border-l-4 border-primary pl-6 py-2 leading-relaxed">
            Industrial-grade management for the global gaming registry. Execute CRUD protocols with mathematical precision.
          </p>

          <div className="flex flex-wrap gap-4 z-10">
            <BrutalistButton 
              variant="primary" 
              onClick={handleJoin} 
              className="text-lg md:text-xl px-8 py-4 md:px-10 md:py-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px]"
            >
              {isAuthenticated ? 'ACCESS DASHBOARD' : 'JOIN THE FRONT'}
            </BrutalistButton>
            <BrutalistButton 
              variant="secondary" 
              onClick={() => {
                dispatch(addSystemLog('Viewing operational manifesto'));
                if (isAuthenticated) navigate('/dashboard/overview');
                else navigate('/login');
              }}
              className="text-lg md:text-xl px-8 py-4 md:px-10 md:py-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px]"
            >
              VIEW MANIFESTO
            </BrutalistButton>
          </div>

          <div className="mt-12 lg:mt-16 grid grid-cols-3 gap-4 md:gap-8 border-t-2 border-black dark:border-white pt-8 text-black dark:text-white">
            <div>
              <div className="font-mono text-[10px] md:text-xs mb-1 opacity-70">DATA_STREAM</div>
              <div className="font-headline font-black text-2xl md:text-3xl">99.9%</div>
              <div className="text-[9px] md:text-[10px] uppercase font-bold tracking-tight opacity-80">Uptime Efficiency</div>
            </div>
            <div>
              <div className="font-mono text-[10px] md:text-xs mb-1 opacity-70">LATENCY</div>
              <div className="font-headline font-black text-2xl md:text-3xl">0.02ms</div>
              <div className="text-[9px] md:text-[10px] uppercase font-bold tracking-tight opacity-80">Execution Speed</div>
            </div>
            <div>
              <div className="font-mono text-[10px] md:text-xs mb-1 opacity-70">CLEARANCE</div>
              <div className="font-headline font-black text-2xl md:text-3xl">LVL 5</div>
              <div className="text-[9px] md:text-[10px] uppercase font-bold tracking-tight opacity-80">Encrypted Access</div>
            </div>
          </div>
        </div>

        {/* Right Side: Industrial Image Hero */}
        <div className="lg:col-span-5 relative bg-black overflow-hidden flex items-center justify-center min-h-[300px] lg:min-h-0">
          <img 
            alt="Industrial gears" 
            className="w-full h-full object-cover mix-blend-lighten opacity-80 grayscale contrast-150" 
            src="https://lh3.googleusercontent.com/aida/AP1WRLu3GwAK0MImSKRbYWcp7qN0O099cHYxMvme0uQ0WSyAZuKffpf6HH7Jm7TxXgSQRO_N76pIB9X9rlJ6yMiHet6YOp6YLH2il-kPpvc3crE8aiNaPPyshJhvjy6CK9QAB8mTphX8uORhenBxy1N3HaRV_8b_UDD8QdmEEiViQ2BXVCyqjxQ45cMWEgvXPDBqprwsONBFRIXfEmNuhVtAxDctLUUXNGKz76bimnr_m0GcP3OXxk0FESoCK50"
          />
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          <div className="absolute bottom-6 right-6 bg-white dark:bg-neutral-900 border-2 border-black dark:border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] max-w-xs z-20">
            <p className="font-mono text-[10px] text-black dark:text-white leading-tight">
              [UNIT_18] THERMAL RECYCLER CORE. MAINTAIN OPERATIONAL INTEGRITY AT ALL COSTS. UNAUTHORIZED ACCESS IS PROHIBITED BY ORDER OF THE COUNCIL.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-black text-white py-12 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="p-8 lg:p-12 border-b-2 md:border-b-0 md:border-r-2 border-white/20 hover:bg-primary transition-colors group relative overflow-hidden">
            <span className="material-symbols-outlined text-5xl md:text-6xl mb-6 block group-hover:scale-115 transition-transform">
              precision_manufacturing
            </span>
            <h3 className="font-headline font-black text-2xl md:text-3xl mb-4 uppercase">FORGED PRECISION</h3>
            <p className="font-body text-xs md:text-sm opacity-70 group-hover:opacity-100 leading-relaxed">
              Our engine executes registry alterations with zero margin for error. Every byte is accounted for, every transaction hardened against failure.
            </p>
            <div className="absolute -bottom-4 -right-4 font-black text-7xl md:text-8xl text-white/5 uppercase select-none">01</div>
          </div>
          
          {/* Feature 2 */}
          <div className="p-8 lg:p-12 border-b-2 md:border-b-0 md:border-r-2 border-white/20 hover:bg-primary transition-colors group relative overflow-hidden">
            <span className="material-symbols-outlined text-5xl md:text-6xl mb-6 block group-hover:scale-115 transition-transform">
              security
            </span>
            <h3 className="font-headline font-black text-2xl md:text-3xl mb-4 uppercase">ENCRYPTED CORE</h3>
            <p className="font-body text-xs md:text-sm opacity-70 group-hover:opacity-100 leading-relaxed">
              Layered verification protocols ensure that only the validated operators can touch the central pillar of the registry. Total isolation.
            </p>
            <div className="absolute -bottom-4 -right-4 font-black text-7xl md:text-8xl text-white/5 uppercase select-none">02</div>
          </div>
          
          {/* Feature 3 */}
          <div className="p-8 lg:p-12 hover:bg-primary transition-colors group relative overflow-hidden">
            <span className="material-symbols-outlined text-5xl md:text-6xl mb-6 block group-hover:scale-115 transition-transform">
              speed
            </span>
            <h3 className="font-headline font-black text-2xl md:text-3xl mb-4 uppercase">KINETIC THROUGHPUT</h3>
            <p className="font-body text-xs md:text-sm opacity-70 group-hover:opacity-100 leading-relaxed">
              Designed for massive scale. The Steam Operational System handles millions of concurrent requests without breaking the structural flow.
            </p>
            <div className="absolute -bottom-4 -right-4 font-black text-7xl md:text-8xl text-white/5 uppercase select-none">03</div>
          </div>
        </div>
      </section>

      {/* Operational Logs / Table Section */}
      <section className="p-6 md:p-8 lg:p-16 bg-[#EAE7DC] dark:bg-neutral-950">
        <div className="flex justify-between items-end mb-8 border-b-4 border-black dark:border-white pb-4 text-black dark:text-white">
          <div>
            <h2 className="font-headline font-black text-3xl md:text-5xl uppercase tracking-tighter">OPERATIONAL_LOG</h2>
            <p className="font-mono text-xs md:text-sm uppercase opacity-65 mt-1">Live feedback from the central processing unit</p>
          </div>
          <div className="hidden md:block font-mono text-[10px] md:text-xs text-right leading-normal opacity-85">
            REF_TIMESTAMP: 0x442-A<br />
            STATUS: <span className="text-primary font-bold">NOMINAL</span>
          </div>
        </div>

        <div className="overflow-x-auto border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] bg-white dark:bg-black">
          <table className="w-full text-left font-mono text-xs text-black dark:text-white border-collapse">
            <thead>
              <tr className="bg-black text-white dark:bg-white dark:text-black uppercase border-b-2 border-black">
                <th className="p-4 border-r border-white/20">PID</th>
                <th className="p-4 border-r border-white/20">PROTOCOL</th>
                <th className="p-4 border-r border-white/20">LOCATION</th>
                <th className="p-4 border-r border-white/20">OPERATOR</th>
                <th className="p-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {mockLogs.map((log, index) => (
                <tr key={index} className="hover:bg-primary/10 transition-colors odd:bg-neutral-50 dark:odd:bg-neutral-900/30">
                  <td className="p-4 border-r border-black/10 dark:border-white/10 font-bold">{log.pid}</td>
                  <td className="p-4 border-r border-black/10 dark:border-white/10 font-bold">{log.protocol}</td>
                  <td className="p-4 border-r border-black/10 dark:border-white/10">{log.location}</td>
                  <td className="p-4 border-r border-black/10 dark:border-white/10">{log.operator}</td>
                  <td className={`p-4 font-bold ${log.statusColor}`}>{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-black text-white text-center border-t border-white/20 font-mono text-[10px] tracking-widest uppercase select-none">
        © 2026 MOMENTUM OPERATIONS // DECODE THE CENTRAL PROTOCOLS // SECURE DEPLOYMENT
      </footer>
    </div>
  );
};

export default LandingPage;
