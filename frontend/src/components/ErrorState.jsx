import React from 'react';
import BrutalistCard from './BrutalistCard';
import BrutalistButton from './BrutalistButton';

export const ErrorState = ({
  title = "SYSTEM CORRUPTION DETECTED",
  message = "An error occurred while transmitting data packets.",
  onRetry
}) => {
  return (
    <BrutalistCard 
      hoverable={false} 
      className="border-primary dark:border-primary py-10 flex flex-col items-center justify-center text-center max-w-lg mx-auto bg-white dark:bg-black"
    >
      <span className="material-symbols-outlined text-6xl text-primary mb-4">
        report_gmailerrorred
      </span>
      <h3 className="font-headline font-black text-xl text-primary uppercase mb-2">
        {title}
      </h3>
      <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400 uppercase max-w-sm mb-6 leading-relaxed">
        // EXCEPTION: {message}
      </p>
      {onRetry && (
        <BrutalistButton variant="primary" onClick={onRetry}>
          RE-INITIALIZE LINK
        </BrutalistButton>
      )}
    </BrutalistCard>
  );
};

export default ErrorState;
