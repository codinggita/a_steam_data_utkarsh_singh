import React from 'react';

export const StatCard = ({
  num = "01",
  label = "POPULATION",
  value = "0",
  title = "METRIC TITLE",
  icon = "analytics",
  variant = "light", // 'light' (white bg), 'primary' (red bg), 'dark' (black bg)
  progress = null,   // percentage (0-100) for light variant progress bar
  segments = null,   // active count for red variant square segments (e.g. { active: 4, total: 5 })
  statusText = null, // text for dark variant bottom tag (e.g. "+12.4% FROM LAST CYCLE")
  watermarkIcon = null // optional big icon in bottom right
}) => {
  let cardClass = "relative overflow-hidden border-2 border-black dark:border-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-[170px]";
  let headerLabelClass = "font-mono text-xs font-bold uppercase";
  let valueClass = "text-4xl md:text-5xl font-headline font-black tracking-tighter truncate mt-2";
  let titleClass = "text-xs md:text-sm font-bold uppercase mt-1";
  
  if (variant === 'light') {
    cardClass += " bg-white text-black dark:bg-neutral-900 dark:text-white";
    headerLabelClass += " text-primary";
  } else if (variant === 'primary') {
    cardClass += " bg-primary text-white";
    headerLabelClass += " text-white/80";
  } else if (variant === 'dark') {
    cardClass += " bg-black text-white dark:bg-neutral-950 dark:border-white";
    headerLabelClass += " text-primary";
  }

  return (
    <div className={cardClass}>
      {/* Watermark icon (bottom right) */}
      {watermarkIcon && (
        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[100px] md:text-[120px]">
            {watermarkIcon}
          </span>
        </div>
      )}

      {/* Card Header */}
      <div className="flex justify-between items-start z-10">
        <span className={headerLabelClass}>
          {num} // {label}
        </span>
        <span className="material-symbols-outlined text-xl">
          {icon}
        </span>
      </div>

      {/* Main Stats Value */}
      <div className="z-10 mt-auto">
        <div className={valueClass} title={value}>
          {value}
        </div>
        <div className={titleClass}>
          {title}
        </div>

        {/* Footer indicators depending on variant */}
        {variant === 'light' && typeof progress === 'number' && (
          <div className="mt-4 w-full h-2 bg-black/10 dark:bg-white/10 border border-black dark:border-white">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} 
            />
          </div>
        )}

        {variant === 'primary' && segments && (
          <div className="mt-4 flex gap-1">
            {[...Array(segments.total || 5)].map((_, idx) => {
              const isActive = idx < segments.active;
              return (
                <div 
                  key={idx} 
                  className={`w-3 h-3 border border-black dark:border-white ${
                    isActive ? 'bg-white' : 'bg-white/30'
                  }`} 
                />
              );
            })}
          </div>
        )}

        {variant === 'dark' && statusText && (
          <div className="mt-4 font-mono text-[10px] text-green-400 font-bold uppercase tracking-wider">
            {statusText}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
