"use client";

import { forwardRef } from "react";

interface HistoryInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const HistoryInput = forwardRef<HTMLInputElement, HistoryInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#2D2A26] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-lg border border-[#EFE9E3] bg-[#F9F8F6] text-[#2D2A26] placeholder:text-[#6B6762] focus:outline-none focus:ring-2 focus:ring-[#C9B59C] focus:border-transparent transition-all ${
            error ? "border-red-500" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

HistoryInput.displayName = "HistoryInput";
