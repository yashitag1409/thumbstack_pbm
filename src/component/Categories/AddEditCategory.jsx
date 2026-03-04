"use client";

import React, { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { createCategory, updateCategory } from "@/utils/apis/categoriesApi";
import { Loader2, Save } from "lucide-react";

const AddEditCategory = ({
  isOpen,
  onClose,
  type = "add",
  category = null,
  onRefresh,
}) => {
  const isEdit = type === "edit";

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    msg: "",
  });

  const [countdown, setCountdown] = useState(5);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    // isSystemDefault: false,
  });

  // Populate form for edit
  useEffect(() => {
    if (isEdit && category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        // isSystemDefault: category.isSystemDefault || false,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        isSystemDefault: false,
      });
    }
  }, [category, isEdit, isOpen]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setMessage({
        type: "error",
        msg: "Category name is required",
      });
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await updateCategory(category._id, formData);
      } else {
        await createCategory(formData);
      }

      setMessage({
        type: "success",
        msg: isEdit
          ? "Category updated successfully!"
          : "Category created successfully!",
      });

      onRefresh?.();
    } catch (error) {
      setMessage({
        type: "error",
        msg:
          error?.response?.data?.message ||
          "Something went wrong while saving category",
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage({ type: "", msg: "" });
      }, 5000);
    }
  };

  // auto close modal
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
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Category" : "Add Category"}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Loading */}
        {loading && (
          <div className="p-3 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            Processing... Please wait
          </div>
        )}

        {/* Message */}
        {message.msg && (
          <div
            className={`p-3 text-sm rounded-lg border text-center ${
              message.type === "error"
                ? "text-red-400 bg-red-500/10 border-red-500/30"
                : "text-green-400 bg-green-500/10 border-green-500/30"
            }`}
          >
            {message.msg}

            {message.type === "success" && (
              <p className="text-xs text-muted mt-1">Closing in {countdown}s</p>
            )}
          </div>
        )}

        {message.type !== "success" && (
          <>
            {/* Name */}
            <input
              type="text"
              placeholder="Category Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full bg-background border border-card-border p-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
            />

            {/* Description */}
            <textarea
              rows={3}
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full bg-background border border-card-border p-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
            />

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="cursor-pointer  w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold disabled:opacity-60 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isEdit ? "Update Category" : "Create Category"}
                </>
              )}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddEditCategory;
