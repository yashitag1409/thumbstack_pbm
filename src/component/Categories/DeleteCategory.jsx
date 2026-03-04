"use client";

import React, { useState } from "react";
import { deleteCategory } from "@/utils/apis/categoriesApi";
import {
  AlertTriangle,
  Trash2,
  X,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * DeleteCategory component
 *
 * A modal that prompts the user to delete a category
 *
 * @param {bool} isOpen - Whether the modal is open or not
 * @param {Function} onClose - Callback to close the modal
 * @param {Object} category - The category to delete
 * @param {Function} onRefresh - Callback to refresh the categories list after deletion
 */
/*******  9cb251d1-19e0-4666-90b1-8eeba61f3b86  *******/
const DeleteCategory = ({ isOpen, onClose, category, onRefresh }) => {
  const [status, setStatus] = useState("idle");
  // idle | deleting | success | error

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      setStatus("deleting");

      await deleteCategory(category?._id);

      setStatus("success");

      setTimeout(() => {
        onRefresh?.();
        onClose?.();
        setStatus("idle");
      }, 1500);
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card border border-card-border rounded-2xl shadow-xl p-6 relative">
        {/* Close button */}
        {status !== "deleting" && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-md hover:bg-card-border"
          >
            <X size={18} />
          </button>
        )}

        {/* ===================== */}
        {/* SUCCESS STATE */}
        {/* ===================== */}
        {status === "success" && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto text-green-400 mb-3" size={40} />
            <h2 className="text-lg font-semibold">Category Deleted</h2>
            <p className="text-sm text-muted mt-1">
              The category has been successfully removed.
            </p>
          </div>
        )}

        {/* ===================== */}
        {/* ERROR STATE */}
        {/* ===================== */}
        {status === "error" && (
          <div className="text-center">
            <XCircle className="mx-auto text-red-400 mb-3" size={40} />
            <h2 className="text-lg font-semibold">Deletion Failed</h2>
            <p className="text-sm text-muted mt-1">
              Something went wrong while deleting this category.
            </p>

            <button
              onClick={handleDelete}
              className="mt-4 px-4 py-2 rounded-lg bg-red-500 text-white text-sm"
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
            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="text-red-400" size={24} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-center mb-2">
              Delete Category
            </h2>

            {/* Category Name */}
            <p className="text-sm text-center text-muted mb-4">
              Are you sure you want to delete
              <span className="text-foreground font-semibold">
                {" "}
                {category?.name}{" "}
              </span>
              category?
            </p>

            {/* Warning */}
            <div className="bg-yellow-500/10 border border-yellow-400/20 text-yellow-300 text-xs rounded-lg p-3 mb-5">
              ⚠️ If this category is used in any books, deleting it may cause
              issues. Please update those books and change their category before
              deleting.
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="cursor-pointer flex-1 py-2 rounded-lg border border-card-border text-sm hover:bg-card-border transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
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
          <div className="text-center">
            <Loader2
              className="mx-auto animate-spin text-primary mb-3"
              size={40}
            />
            <h2 className="text-lg font-semibold">Deleting Category...</h2>
            <p className="text-sm text-muted mt-1">
              Please wait while we remove this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteCategory;
