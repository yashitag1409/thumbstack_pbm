"use client";

import React, { useState } from "react";
import { deleteAuthor } from "@/utils/apis/authorsApi";
import { Trash2, X } from "lucide-react";

const DeleteAuthor = ({ isOpen, onClose, author, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteAuthor(author._id);

      onRefresh?.();
      onClose?.();
    } catch (error) {
      //   console.log("Delete author error:", error);
    } finally {
      setLoading(false);
      //   setTimeout(() => {
      //     setMessage({ type: "", msg: "" });
      //   }, 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border border-card-border rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 hover:bg-card-border p-1 rounded"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-3">Delete Author</h2>

        <p className="text-sm text-muted mb-5">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{author?.name}</span> ?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-card-border py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAuthor;
