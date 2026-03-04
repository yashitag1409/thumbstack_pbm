"use client";

import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { addBook, updateBook } from "@/utils/apis/booksApi";
import { getAllAuthors } from "@/utils/apis/authorsApi";
import { getAllCategories } from "@/utils/apis/categoriesApi";
import { ImagePlus, Loader2, Save } from "lucide-react";
import CustomDropdown from "../CustomElementsTag/CustomDropdown";

const AddEditBook = ({ isOpen, type, onClose, book = null, onRefresh }) => {
  const isEdit = !!book;

  // --- States ---
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    thumbNail: null,
  });

  // Load selection data
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          const [authRes, catRes] = await Promise.all([
            getAllAuthors(),
            getAllCategories(),
          ]);
          setAuthors(authRes || []);
          setCategories(catRes || []);
        } catch (err) {
          console.error("Failed to load select data");
        }
      };
      loadData();
    }
  }, [isOpen]);

  // Sync for Edit mode
  useEffect(() => {
    if (book && isOpen) {
      setFormData({
        title: book.title || "",
        author: book.author?._id || "",
        category: book.category?._id || "",
        description: book.description || "",
        thumbNail: null,
      });
    } else {
      setFormData({
        title: "",
        author: "",
        category: "",
        description: "",
        thumbNail: null,
      });
    }
  }, [book, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      alert("Description is required");
      return;
    }

    if (!formData.category) {
      alert("Please select a category");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);

      if (formData.author) {
        data.append("author", formData.author);
      }

      if (formData.category) {
        data.append("category", formData.category);
      }

      if (formData.thumbNail) {
        data.append("thumbNail", formData.thumbNail);
      }

      if (isEdit && book) {
        await updateBook(book._id, data);
      } else {
        await addBook(data);
      }

      onRefresh?.();
      onClose();
    } catch (error) {
      console.error("Operation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === "edit" ? "Edit Book Details" : "Add New Book"}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 py-2">
        {/* Loading Message */}
        {loading && (
          <div className="p-4 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            Processing... Please wait
          </div>
        )}

        {/* Form Inputs (Styled like LoginForm) */}
        <input
          type="text"
          placeholder="Book Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
        />

        <div className="grid grid-cols-2 gap-2">
          <CustomDropdown
            options={authors}
            placeholder="Select Author"
            value={formData.author}
            labelKey="name"
            valueKey="_id"
            onChange={(val) => setFormData({ ...formData, author: val })}
          />
          <CustomDropdown
            options={categories}
            placeholder="Select Category"
            value={formData.category}
            labelKey="name"
            valueKey="_id"
            onChange={(val) => setFormData({ ...formData, category: val })}
          />
          {/* <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm transition-all text-muted"
          >
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id} className="bg-slate-900">
                {c.name}
              </option>
            ))}
          </select> */}
        </div>

        <textarea
          placeholder="Short Description"
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm transition-all resize-none"
        />

        {/* Custom File Upload Styled as Input */}
        <div className="relative group">
          <label className="flex items-center justify-between w-full bg-background border border-card-border p-3 rounded-xl cursor-pointer hover:border-primary/50 transition-all">
            <span className="text-sm text-muted truncate">
              {formData.thumbNail
                ? formData.thumbNail.name
                : book?.thumbNail
                  ? "Current thumbnail"
                  : "Upload Thumbnail"}
            </span>

            <ImagePlus size={18} className="text-primary" />

            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  thumbNail: e.target.files[0],
                })
              }
            />
          </label>
        </div>

        {/* Submit Button (Identical to LoginForm) */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-xl font-bold disabled:opacity-60 cursor-pointer shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
        >
          {loading
            ? "Saving..."
            : type === "edit"
              ? "Update Book"
              : "Add to Vault"}
        </button>
      </div>
    </Modal>
  );
};

export default AddEditBook;
