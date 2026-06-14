import React from 'react';

export const BrutalistCard = ({ 
  children, 
  className = '', 
  hoverable = true, 
  header = null,
  footer = null,
  onClick = null
}) => {
  const baseStyle = "bg-white dark:bg-black border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] p-4 md:p-6 transition-all duration-100 ease-in-out flex flex-col";
  
  const hoverStyle = hoverable 
    ? "hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]" 
    : "";
    
  const clickableStyle = onClick ? "cursor-crosshair" : "";

  return (
    <div 
      className={`${baseStyle} ${hoverStyle} ${clickableStyle} ${className}`}
      onClick={onClick}
    >
      {header && (
        <div className="border-b-2 border-black dark:border-white pb-3 mb-4 flex justify-between items-center font-headline font-black uppercase tracking-tight">
          {header}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
      {footer && (
        <div className="border-t border-black/10 dark:border-white/20 pt-3 mt-4 text-xs font-mono">
          {footer}
        </div>
      )}
    </div>
  );
};

export default BrutalistCard;
