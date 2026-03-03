"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer, // Prop for dynamic footer buttons
  maxWidth = "max-w-lg", // Optional: wider for books/authors
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container with Gradient Top */}
      <div
        className={`relative bg-background/50 w-full ${maxWidth} rounded-2xl shadow-2xl transform transition-all overflow-hidden flex flex-col h-auto max-h-[90vh] border-t border-white/10`}
      >
        {/* ADDED: Dynamic Gradient Top Line (Digital Lavender -> corporate Blue -> Hot Pink) */}
        <div className="h-[4px] w-full bg-gradient-to-r from-[#6366f1] via-[#0ea5e9] to-[#8b5cf6]" />

        {/* 1. Fixed Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-card-border bg-background/20 z-10">
          <h3 className="text-xl font-bold text-foreground">
            {title || "AksharVault"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full cursor-pointer hover:bg-white/10 transition-colors text-muted hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        {/* 2. Scrollable Content Area */}
        <div className="flex-1 px-6 py-4 overflow-y-auto custom-scrollbar bg-background/50">
          {children}
        </div>

        {/* 3. Fixed Footer */}
        {footer && (
          <div className="shrink-0 px-6 py-4 border-t border-card-border bg-card/80 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
