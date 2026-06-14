import React from 'react';

export const BrutalistButton = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary', // primary (red), secondary (black), ghost (outline), danger (red outline/fill)
  className = '', 
  disabled = false,
  fullWidth = false,
  title = ''
}) => {
  const baseStyle = "border-2 border-black dark:border-white font-headline font-black uppercase tracking-tight py-2 px-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:pointer-events-none transition-all cursor-crosshair text-sm";
  
  const widthStyle = fullWidth ? "w-full" : "";
  
  let variantStyle = "";
  if (variant === 'primary') {
    variantStyle = "bg-primary text-white hover:bg-[#B30320]";
  } else if (variant === 'secondary') {
    variantStyle = "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200";
  } else if (variant === 'ghost') {
    variantStyle = "bg-transparent text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10";
  } else if (variant === 'danger') {
    variantStyle = "bg-[#D90429] text-white hover:bg-[#9B031C]";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${widthStyle} ${className}`}
      title={title}
    >
      {children}
    </button>
  );
};

export default BrutalistButton;
