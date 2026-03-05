"use client";

import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { deleteCategory } from "@/utils/apis/categoriesApi";
import {
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";

const DeleteCategory = ({ isOpen, onClose, category, onRefresh }) => {
  const [status, setStatus] = useState("idle"); // idle | deleting | success | error
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let timer;
    if (status === "success" && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [status, countdown]);

  useEffect(() => {
    if (status === "success" && countdown === 0) {
      // Small delay to ensure the '0' is rendered before everything disappears
      const finalClose = setTimeout(() => {
        onRefresh?.();
        onClose?.();
        // Reset local state for next time the modal opens
        setStatus("idle");
        setCountdown(3);
      }, 100);

      return () => clearTimeout(finalClose);
    }
  }, [status, countdown, onClose, onRefresh]);

  const handleDelete = async () => {
    try {
      setStatus("deleting");
      await deleteCategory(category?._id);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={status === "deleting" ? null : onClose} // Disable closing during deletion
      title="Delete Category"
      maxWidth="max-w-md"
    >
      <div className="space-y-6 py-2">
        {/* ===================== */}
        {/* SUCCESS STATE */}
        {/* ===================== */}
        {status === "success" && (
          <div className="text-center py-4">
            <CheckCircle2 className="mx-auto text-green-400 mb-3" size={48} />
            <h2 className="text-lg font-semibold text-foreground">
              Category Removed
            </h2>
            <p className="text-sm text-muted mt-1">
              The category has been successfully deleted from your vault.
            </p>
            <p className="text-xs text-primary mt-4 font-bold uppercase tracking-widest">
              Closing in {countdown}s
            </p>
          </div>
        )}

        {/* ===================== */}
        {/* ERROR STATE */}
        {/* ===================== */}
        {status === "error" && (
          <div className="text-center py-4">
            <XCircle className="mx-auto text-red-400 mb-3" size={48} />
            <h2 className="text-lg font-semibold text-foreground">
              Deletion Failed
            </h2>
            <p className="text-sm text-muted mt-1">
              Something went wrong. Please try again or check if the category is
              in use.
            </p>
            <button
              onClick={handleDelete}
              className="mt-6 px-6 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ===================== */}
        {/* DEFAULT CONFIRMATION */}
        {/* ===================== */}
        {status === "idle" && (
          <>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle className="text-red-400" size={32} />
              </div>

              <p className="text-sm text-muted mb-2">
                Are you sure you want to delete
              </p>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {category?.name}
              </h3>

              <div className="bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs rounded-xl p-4 mb-6 leading-relaxed">
                <span className="font-bold text-amber-400 block mb-1">
                  ⚠️ System Warning
                </span>
                Deleting this category will remove it from all linked books.
                Please ensure you have re-assigned those books before
                proceeding.
              </div>
            </div>

            {/* Buttons Styled like Login/Add forms */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="cursor-pointer flex-1 py-3 rounded-xl border border-card-border text-sm font-bold text-muted hover:text-foreground hover:bg-white/5 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </>
        )}

        {/* ===================== */}
        {/* DELETING STATE */}
        {/* ===================== */}
        {status === "deleting" && (
          <div className="text-center py-8">
            <Loader2
              className="mx-auto animate-spin text-primary mb-4"
              size={48}
            />
            <h2 className="text-lg font-semibold text-foreground">
              Removing Category...
            </h2>
            <p className="text-sm text-muted mt-2 italic">
              Updating your vault collection...
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DeleteCategory;
