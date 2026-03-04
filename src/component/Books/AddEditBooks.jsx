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
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  // --- States ---
  const [loading, setLoading] = useState(false);
  const [thumbPreview, setThumbPreview] = useState("");
  const [pagePreviews, setPagePreviews] = useState([]);
  const [countdown, setCountdown] = useState(5);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    customAuthor: "",
    category: "",
    customCategory: "",
    description: "",
    thumbNail: null,
    pages: [],
  });

  const [message, setMessage] = useState({
    type: "", // error | success
    msg: "",
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

          setAuthors([...authRes.data, { _id: "other", name: "Other" }]);
          setCategories([...catRes.data, { _id: "other", name: "Other" }]);
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
        customAuthor: "",
        category: book.category?._id || "",
        customCategory: "",
        description: book.description || "",
        thumbNail: null,
        pages: [],
      });

      setThumbPreview(book.thumbNail || "");
      setPagePreviews(book.pages?.map((p) => p.page_url) || []);
    } else {
      setFormData({
        title: "",
        author: "",
        customAuthor: "",
        category: "",
        customCategory: "",
        description: "",
        thumbNail: null,
        pages: [],
      });

      setThumbPreview("");
      setPagePreviews([]);
    }
  }, [book, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setMessage({ type: "error", msg: "Title is required" });
      return;
    }

    if (!formData.description.trim()) {
      setMessage({ type: "error", msg: "Description is required" });
      return;
    }

    if (!formData.category) {
      setMessage({ type: "error", msg: "Please select a category" });
      return;
    }

    if (formData.author === "other" && !formData.customAuthor.trim()) {
      setMessage({ type: "error", msg: "Please enter author name" });
      return;
    }

    if (formData.category === "other" && !formData.customCategory.trim()) {
      setMessage({ type: "error", msg: "Please enter category name" });
      return;
    }

    if (!isEdit && formData.pages.length === 0) {
      setMessage({ type: "error", msg: "Please upload book pages" });
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      // Basic fields
      data.append("title", formData.title);
      data.append("description", formData.description);

      // Thumbnail
      if (formData.thumbNail) {
        data.append("thumbNail", formData.thumbNail);
      }

      // Author
      if (formData.author === "other") {
        data.append("customAuthor", formData.customAuthor);
      } else if (formData.author) {
        data.append("author", formData.author);
      }

      // Category
      if (formData.category === "other") {
        data.append("customCategory", formData.customCategory);
      } else if (formData.category) {
        data.append("category", formData.category);
      }

      // Page Images
      if (formData.pages && formData.pages.length > 0) {
        formData.pages.forEach((file) => {
          data.append("pageImages", file);
        });

        data.append("numberOfPages", formData.pages.length);
      }

      // API Call
      if (isEdit && book) {
        await updateBook(book._id, data);
      } else {
        await addBook(data);
      }

      onRefresh?.();

      setMessage({
        type: "success",
        msg: isEdit ? "Book updated successfully!" : "Book added successfully!",
      });
    } catch (error) {
      console.error("Operation failed", error);

      setMessage({
        type: "error",
        msg: error.response?.data?.message || "Operation failed",
      });
    } finally {
      setLoading(false);

      if (message.type === "success") {
        setTimeout(() => {
          onClose();
          setMessage({ type: "", msg: "" });
        }, 5000);
      } else {
        setTimeout(() => {
          setMessage({ type: "", msg: "" });
        }, 4000);
      }
    }
  };

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

        {message.type !== "success" && (
          <>
            <input
              type="text"
              placeholder="Book Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
            />
            <div className="grid grid-cols-2 gap-2">
              <CustomDropdown
                options={authors}
                placeholder="Select Author"
                value={formData.author}
                labelKey="name"
                valueKey="_id"
                onChange={(val) =>
                  setFormData({ ...formData, author: val, customAuthor: "" })
                }
              />

              {formData.author === "other" && (
                <input
                  type="text"
                  placeholder="Enter Author Name"
                  value={formData.customAuthor}
                  onChange={(e) =>
                    setFormData({ ...formData, customAuthor: e.target.value })
                  }
                  className="w-full bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm"
                />
              )}
              <CustomDropdown
                options={categories}
                placeholder="Select Category"
                value={formData.category}
                labelKey="name"
                valueKey="_id"
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    category: val,
                    customCategory: "",
                  })
                }
              />

              {formData.category === "other" && (
                <input
                  type="text"
                  placeholder="Enter Category Name"
                  value={formData.customCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, customCategory: e.target.value })
                  }
                  className="w-full bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm"
                />
              )}
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
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (!file) return;

                    if (file.size > MAX_FILE_SIZE) {
                      setMessage({
                        type: "error",
                        msg: "Thumbnail must be smaller than 5MB",
                      });
                      return;
                    }

                    setFormData({
                      ...formData,
                      thumbNail: file,
                    });

                    setThumbPreview(URL.createObjectURL(file));
                  }}
                />
              </label>
              {thumbPreview && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={thumbPreview}
                    alt="Thumbnail Preview"
                    className="h-32 rounded-lg object-cover border border-card-border"
                  />
                </div>
              )}
            </div>

            <div className="relative group">
              <label className="flex items-center justify-between w-full bg-background border border-card-border p-3 rounded-xl cursor-pointer hover:border-primary/50 transition-all">
                <span className="text-sm text-muted">
                  {formData.pages.length
                    ? `${formData.pages.length} pages selected`
                    : "Upload Book Pages"}
                </span>

                <ImagePlus size={18} className="text-primary" />

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);

                    // validate file size
                    const oversizedFile = files.find(
                      (file) => file.size > MAX_FILE_SIZE,
                    );

                    if (oversizedFile) {
                      setMessage({
                        type: "error",
                        msg: `${oversizedFile.name} exceeds 5MB limit`,
                      });
                      return;
                    }

                    const updatedPages = [...formData.pages, ...files];

                    setFormData({
                      ...formData,
                      pages: updatedPages,
                    });

                    const previews = files.map((file) =>
                      URL.createObjectURL(file),
                    );
                    setPagePreviews((prev) => [...prev, ...previews]);
                  }}
                />
              </label>
              {pagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3 max-h-40 overflow-y-auto">
                  {pagePreviews.map((src, i) => (
                    <div
                      key={i}
                      className="relative border border-card-border rounded-lg overflow-hidden"
                    >
                      <img
                        src={src}
                        alt={`Page ${i + 1}`}
                        className="w-full h-20 object-cover"
                      />

                      <span className="absolute bottom-0 right-0 bg-black/60 text-white text-xs px-1 rounded-tl">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddEditBook;
