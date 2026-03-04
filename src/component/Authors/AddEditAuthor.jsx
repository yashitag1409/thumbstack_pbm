"use client";

import React, { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { addAuthor, updateAuthor } from "@/utils/apis/authorsApi";
import { Loader2, Save, Upload } from "lucide-react";

const AddEditAuthor = ({
  isOpen,
  onClose,
  type = "add",
  author = null,
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
    biography: "",
    website: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Populate form
  useEffect(() => {
    if (isEdit && author) {
      setFormData({
        name: author.name || "",
        biography: author.biography || "",
        website: author.website || "",
      });

      setPreview(author.profileImage || "");
    } else {
      setFormData({
        name: "",
        biography: "",
        website: "",
      });

      setPreview("");
      setImageFile(null);
    }
  }, [author, isEdit, isOpen]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setMessage({
        type: "error",
        msg: "Author name is required",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("biography", formData.biography);
      payload.append("website", formData.website);

      if (imageFile) {
        payload.append("profileImage", imageFile);
      }

      if (isEdit) {
        await updateAuthor(author._id, payload);
      } else {
        await addAuthor(payload);
      }

      setMessage({
        type: "success",
        msg: isEdit
          ? "Author updated successfully!"
          : "Author created successfully!",
      });

      onRefresh?.();
    } catch (error) {
      setMessage({
        type: "error",
        msg:
          error?.response?.data?.message ||
          "Something went wrong while saving author",
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
      title={isEdit ? "Edit Author" : "Add Author"}
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
              placeholder="Author Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full bg-background border border-card-border p-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
            />

            {/* Biography */}
            <textarea
              rows={3}
              placeholder="Biography"
              value={formData.biography}
              onChange={(e) => handleChange("biography", e.target.value)}
              className="w-full bg-background border border-card-border p-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
            />

            {/* Website */}
            <input
              type="text"
              placeholder="Website"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              className="w-full bg-background border border-card-border p-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
            />

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted">Profile Image</label>

              <label className="cursor-pointer flex items-center justify-center gap-2 border border-dashed border-card-border p-4 rounded-xl hover:bg-card-border/30 transition">
                <Upload size={16} />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-20 h-20 rounded-lg object-cover border border-card-border"
                />
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold disabled:opacity-60 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isEdit ? "Update Author" : "Create Author"}
                </>
              )}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddEditAuthor;
