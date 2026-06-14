import React from 'react';
import BrutalistCard from './BrutalistCard';

export const EmptyState = ({ 
  title = "NO SECTOR RECORDS FOUND", 
  message = "The query completed successfully, but returned 0 files.",
  action = null
}) => {
  return (
    <BrutalistCard hoverable={false} className="py-12 flex flex-col items-center justify-center text-center max-w-lg mx-auto bg-canvas">
      <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-bounce">
        folder_open
      </span>
      <h3 className="font-headline font-black text-xl uppercase mb-2">
        {title}
      </h3>
      <p className="font-mono text-xs text-neutral-500 uppercase max-w-sm mb-6 leading-relaxed">
        // {message}
      </p>
      {action}
    </BrutalistCard>
  );
};

export default EmptyState;
