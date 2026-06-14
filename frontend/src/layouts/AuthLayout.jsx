import React from 'react';
import ScanlineOverlay from '../components/ScanlineOverlay';

export const AuthLayout = ({ children, headline = "THE DATABASE NEVER SLEEPS." }) => {
  return (
    <main className="flex min-h-screen flex-col md:flex-row bg-canvas text-ink font-body select-none">
      {/* Left Panel: Industrial Imagery & System Branding */}
      <section className="relative w-full md:w-1/2 lg:w-3/5 bg-ink flex flex-col justify-end p-8 md:p-16 overflow-hidden min-h-[300px] md:min-h-screen">
        <div className="absolute inset-0 z-0">
          <img
            alt="Industrial Machinery"
            className="w-full h-full object-cover opacity-40 grayscale contrast-150"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfpROzfCMZ3T1V_4TDzO_NGlrI_djqDiM7fBY84TT2SRkvv3GAct-7wT6LeA6STFIv26VF0h9MM_p7VjgjSEOfhcafDlT5KKghBPwMFFH0TIsst9sois3VxiaV7GXnpU7KJqPoKJuCrnWuK3HK7Dh23IB84oCT70ERjHZMtvLfCp85gE1bUqNE9jc-Ma37B-6VADo96T3NFbmhceU9WJWJkNtxBk5oLw3xF9hbLb-pBoWeEwMbL_fk1p7b6YBvin0WZER7ydDbQaE"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80"></div>
          <ScanlineOverlay />
        </div>
        
        <div className="relative z-10">
          <div className="inline-block bg-primary text-white px-4 py-1 mb-6 font-mono font-bold text-sm tracking-widest">
            SYSTEM_STATUS: ACTIVE
          </div>
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-headline font-black leading-[0.85] text-white uppercase tracking-tighter max-w-2xl"
            dangerouslySetInnerHTML={{ __html: headline.replace('\n', '<br />') }}
          />
          <div className="mt-8 flex gap-4">
            <div className="h-[4px] w-24 bg-primary"></div>
            <p className="font-mono text-white/60 text-xs max-w-xs uppercase leading-relaxed">
              OPERATOR CLEARANCE LEVEL 5 REQUIRED. UNAUTHORIZED ATTEMPTS WILL BE LOGGED AND INVESTIGATED BY THE LEGAL DEPARTMENT.
            </p>
          </div>
        </div>
      </section>

      {/* Right Panel: Content / Form Slot */}
      <section className="relative w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-canvas">
        <ScanlineOverlay />
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </section>
    </main>
  );
};

export default AuthLayout;
