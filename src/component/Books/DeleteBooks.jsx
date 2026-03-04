"use client";

import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { Trash2 } from "lucide-react";
import { deleteBook } from "@/utils/apis/booksApi";

const DeleteBooks = ({ isOpen, onClose, bookId, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", msg: "" });
  const [countdown, setCountdown] = useState(5);

  const handleDelete = async () => {
    if (!bookId) return;

    setLoading(true);

    try {
      const res = await deleteBook(bookId);

      setMessage({
        type: "success",
        msg: res?.message || "Book deleted successfully",
      });
    } catch (error) {
      setMessage({
        type: "error",
        msg: error?.response?.data?.message || "Failed to delete book",
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage({ type: "", msg: "" });
      }, 5000);
    }
  };

  useEffect(() => {
    if (message.type === "success") {
      onRefresh?.();
    }
  }, [message.type, onRefresh]);

  // auto close modal after success
  useEffect(() => {
    let timer;

    if (message.type === "success") {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            onClose();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [message.type, onClose]);

  return (
    <Modal
      title="Delete Book"
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="py-4 space-y-4">
        {/* Message */}
        {message.msg && (
          <div
            className={`p-4 text-sm rounded-lg border text-center ${
              message.type === "error"
                ? "text-red-400 bg-red-500/10 border-red-500/30"
                : "text-green-400 bg-green-500/10 border-green-500/30"
            }`}
          >
            {message.msg}

            {message.type === "success" && (
              <p className="text-xs text-muted mt-2">
                Closing in {countdown} seconds...
              </p>
            )}
          </div>
        )}

        {/* Hide buttons after success */}
        {message.type !== "success" && (
          <>
            <p className="text-sm text-muted text-center">
              Are you sure you want to delete this book? This action cannot be
              undone.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="cursor-pointer px-4 py-2 rounded-lg border border-card-border text-sm hover:bg-card transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition disabled:opacity-60"
              >
                <Trash2 size={16} />

                {loading ? "Deleting..." : "Delete Book"}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DeleteBooks;
