import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-graphite/80 font-sans">
        {label}
      </label>
      <input
        className={`w-full px-4 py-3 bg-surface border rounded-xl 
        focus:outline-none focus:ring-2 focus:ring-accentNavy/20 focus:border-accentNavy
        transition-all duration-200 text-graphite font-sans
        ${error ? 'border-red-500' : 'border-gray-200'}
        ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
