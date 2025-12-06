"use client";
import React from "react";

export default function LoadingButton({
  children,
  loading = false,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        inline-flex items-center justify-center rounded-md text-sm font-medium 
        ring-offset-background transition-colors focus-visible:outline-none 
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
        disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 
        bg-blue-600 text-white hover:bg-blue-700 
        ${className} 
        ${loading ? "opacity-70 cursor-not-allowed" : ""}
      `}
    >
      {loading && (
        // Simple, clean spinner
        <svg
          className="animate-spin h-5 w-5 mr-2 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          {/* Background circle (less opacity) */}
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          {/* Spinner path (full opacity) */}
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
}