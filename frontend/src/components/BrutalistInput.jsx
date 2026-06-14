import React from 'react';

export const BrutalistInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder = '',
  disabled = false,
  className = '',
  required = false
}) => {
  const isError = error && touched;
  
  return (
    <div className={`flex flex-col mb-4 w-full ${className}`}>
      {label && (
        <label 
          htmlFor={name}
          className="font-mono text-xs font-bold uppercase mb-1.5 text-black dark:text-white flex items-center justify-between"
        >
          <span>{label} {required && <span className="text-primary">*</span>}</span>
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`bg-white dark:bg-black text-black dark:text-white border-2 px-4 py-2 font-mono text-sm focus:ring-0 focus:outline-none w-full cursor-crosshair transition-colors duration-100 ${
            isError 
              ? 'border-primary focus:border-primary' 
              : 'border-black dark:border-white focus:border-primary dark:focus:border-primary'
          }`}
        />
      </div>
      {isError && (
        <span className="text-primary font-mono text-[11px] mt-1 uppercase">
          // ERROR: {error}
        </span>
      )}
    </div>
  );
};

export default BrutalistInput;
