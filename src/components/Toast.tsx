"use client";

import { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  type: 'success' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
        type === 'success' 
          ? 'bg-green-500/90 text-white' 
          : 'bg-blue-500/90 text-white'
      }`}>
        {type === 'success' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}