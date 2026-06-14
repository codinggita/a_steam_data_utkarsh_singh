import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import BrutalistCard from '../../components/BrutalistCard';
import BrutalistButton from '../../components/BrutalistButton';
import { addSystemLog } from '../../store/uiSlice';
import toast from 'react-hot-toast';

export const OverviewPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAcknowledge = () => {
    dispatch(addSystemLog('Acknowledged urgent system amendment 498-A'));
    toast.success('AMENDMENT 498-A ACKNOWLEDGED. PROTOCOL VERIFIED.');
  };

  const metrics = [
    { label: 'TOTAL PENAL LAWS', val: '511', color: 'text-black dark:text-white' },
    { label: 'ACTIVE STATUTES', val: '480', color: 'text-primary' },
    { label: 'REPEALED SECTIONS', val: '31', color: 'text-black dark:text-white' },
    { label: 'SAVED BOOKMARKS', val: '12', color: 'text-black dark:text-white' }
  ];

  const bars = [
    { label: 'PERSONAL', height: 'h-[85%]', bg: 'bg-primary' },
    { label: 'PROPERTY', height: 'h-[60%]', bg: 'bg-black dark:bg-neutral-800' },
    { label: 'PUBLIC TRANQUILITY', height: 'h-[95%]', bg: 'bg-primary' },
    { label: 'STATE', height: 'h-[40%]', bg: 'bg-black dark:bg-neutral-800' },
    { label: 'ELECTION', height: 'h-[70%]', bg: 'bg-primary' },
    { label: 'MARRIAGE', height: 'h-[50%]', bg: 'bg-black dark:bg-neutral-800' }
  ];

  const updates = [
    { time: '08:42', text: 'AMENDMENT 12-B PENDING...', red: false },
    { time: '07:15', text: 'CRITICAL OVERRIDE: SEC 144', red: true },
    { time: '04:00', text: 'SYSTEM RECALIBRATION COMPLETE', red: false }
  ];

  return (
    <div className="flex flex-col select-none text-black dark:text-white">
      {/* Header section */}
      <section className="mb-12">
        <h1 className="text-5xl md:text-8xl font-headline font-black tracking-tight leading-none mb-4 uppercase">
          OPERATIONAL MANIFESTO
        </h1>
        <div className="h-1.5 bg-black dark:bg-white w-full"></div>
        <p className="font-mono text-[10px] md:text-sm mt-2 font-bold text-neutral-600 dark:text-neutral-400">
          SYSTEM TIMESTAMP: {new Date().toISOString().slice(0, 10).replace(/-/g, '.')} // ALL DATA STREAMS VERIFIED
        </p>
      </section>

      {/* Metrics Square Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {metrics.map((m, idx) => (
          <div 
            key={idx}
            className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between aspect-square min-h-[150px]"
          >
            <span className="font-mono text-xs font-bold uppercase border-b-2 border-black dark:border-white pb-1 mb-4">
              {m.label}
            </span>
            <div className="flex items-end mt-auto">
              <span className={`text-5xl md:text-6xl font-headline font-black leading-none ${m.color}`}>
                {m.val}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Data Panel: Split Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Chart panel (span 8) */}
        <div className="lg:col-span-8 bg-[#D8D4C7] dark:bg-neutral-900 border-2 border-black dark:border-white p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between">
          <h3 className="font-headline text-2xl md:text-3xl font-black mb-8 border-b-2 border-black dark:border-white pb-2">
            OFFENSES BY CATEGORY
          </h3>
          
          <div className="flex items-end gap-3 md:gap-4 h-[300px] border-l-2 border-b-2 border-black dark:border-white p-4 overflow-x-auto">
            {bars.map((bar, idx) => (
              <div key={idx} className="flex-grow flex-1 flex flex-col items-center min-w-[40px] group relative h-full justify-end">
                {/* Bar */}
                <div 
                  className={`w-full ${bar.bg} border-2 border-black dark:border-white ${bar.height} transition-all duration-300 hover:opacity-90`} 
                  title={`${bar.label}`}
                />
                {/* Rotated Labels */}
                <span className="mt-3 font-mono text-[8px] md:text-[9px] font-bold uppercase rotate-45 origin-left whitespace-nowrap text-black dark:text-white/80">
                  {bar.label.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Messages & Image Panel (span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Urgent alert card */}
          <div className="bg-primary border-2 border-black dark:border-white p-6 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-3xl font-bold animate-pulse">
                    warning
                  </span>
                  <h3 className="font-headline text-3xl md:text-4xl font-black italic">
                    URGENT ALERT
                  </h3>
                </div>
                <p className="font-mono text-xs leading-relaxed mb-6 font-bold uppercase text-white/90">
                  SYSTEM ALERT: MANDATORY REVIEW OF AMENDED SECTION 498-A REQUIRED BY ALL OPERATORS. PROTOCOL DELTA IN EFFECT. FAILURE TO COMPLY WILL RESULT IN SESSION TERMINATION.
                </p>
              </div>
              <BrutalistButton 
                variant="secondary" 
                onClick={handleAcknowledge}
                className="w-full bg-black text-white font-headline text-lg py-3 border-2 border-white hover:bg-white hover:text-black transition-none active:translate-x-[2px] active:translate-y-[2px]"
              >
                ACKNOWLEDGE &amp; REVIEW
              </BrutalistButton>
            </div>
            {/* Background texture watermark */}
            <div className="absolute top-0 right-0 p-2 font-mono text-[80px] opacity-10 font-black select-none pointer-events-none">
              !!!
            </div>
          </div>

          {/* Constructivist Graphic Panel */}
          <div className="bg-black border-2 border-black dark:border-white flex-grow min-h-[200px] relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]">
            <img 
              alt="Industrial machinery" 
              className="w-full h-full object-cover grayscale contrast-125 opacity-80" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLsJCXopfsYA-t5fb9biHWHWtkwAenfmM8pOio_72M9Uk4BVqhTtAWsxfn_zjutZGam53thHJHTm2ol_ICO83HTD9XLJakty8Nt9HUq5OTW2S-7OYa9n1J4LjHuZuozr5FE3K3szh8Su0G3O2S0EMURnvtGlDHTecMHt1cJmb2HJ0A6zuE8l30od6EDgfzZXqKKdD6vEK0tu4WKxgrVn4IVNuZI9ZDdwCMRr3OtVpoXppVuWcl9Zr2TFESY"
            />
            <div className="absolute inset-0 border-4 border-black/20 pointer-events-none" />
            <div className="absolute bottom-4 left-4 bg-white dark:bg-neutral-900 px-2 py-0.5 border-2 border-black dark:border-white">
              <span className="font-mono text-[9px] font-black uppercase text-black dark:text-white">MECHANISM ID: BNS-X19</span>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Bottom Row (Bento style) */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Latest Updates log */}
        <div className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4 border-b pb-2 border-black/10 dark:border-white/10">
            <span className="font-headline text-lg font-bold">LIVE STATUS FEED</span>
            <span className="font-mono text-[9px] bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 animate-pulse">LIVE</span>
          </div>
          <ul className="font-mono text-xs space-y-3">
            {updates.map((up, idx) => (
              <li key={idx} className="border-b border-black/10 dark:border-white/10 pb-2 last:border-0">
                <span className="opacity-50">{up.time} // </span>
                <span className={up.red ? "text-primary font-bold animate-pulse" : ""}>{up.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Engine card */}
        <div className="bg-[#D8D4C7] dark:bg-neutral-900 border-2 border-black dark:border-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] flex flex-col justify-center items-center text-center py-8">
          <span className="material-symbols-outlined text-5xl mb-2">gavel</span>
          <span className="font-headline text-2xl font-black">LEGAL ENGINE</span>
          <p className="font-mono text-[9px] uppercase mt-2 opacity-75">VIRTUAL COURT SIMULATION ACTIVE</p>
        </div>

        {/* Browse Archive quicklink */}
        <div 
          onClick={() => {
            dispatch(addSystemLog('Bypassing directly to game registry'));
            navigate('/dashboard/registry');
          }}
          className="bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-[150px] group cursor-crosshair hover:bg-primary dark:hover:bg-primary dark:hover:text-white hover:text-white transition-all duration-100"
        >
          <span className="font-headline text-3xl font-black uppercase">BROWSE REGISTER</span>
          <div className="flex justify-between items-end mt-4">
            <span className="font-mono text-[9px] uppercase opacity-75">ACCESS LEVEL 5 ONLY</span>
            <span className="material-symbols-outlined text-4xl transition-transform group-hover:translate-x-2">
              arrow_forward
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OverviewPage;
