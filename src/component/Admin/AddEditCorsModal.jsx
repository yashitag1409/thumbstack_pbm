"use client";

import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { addOrigin, updateOrigin } from "@/utils/apis/adminApi";
import { Save, Loader2, Globe } from "lucide-react";

const AddEditCorsModal = ({ isOpen, onClose, data, onRefresh }) => {
  const isEdit = !!data;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ msg: "", type: "" });
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (data && isOpen) setUrl(data.origin);
    else setUrl("");
    setMessage({ msg: "", type: "" });
  }, [data, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url)
      return setMessage({ msg: "Origin URL is required", type: "error" });

    try {
      setLoading(true);
      if (isEdit) await updateOrigin(data._id, { origin: url });
      else await addOrigin({ origin: url });

      setMessage({
        msg: `Origin ${isEdit ? "updated" : "added"} successfully!`,
        type: "success",
      });
      onRefresh();
      setTimeout(onClose, 2000);
    } catch (err) {
      setMessage({
        msg: err.response?.data?.message || "Operation failed",
        type: "failed",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ msg: "", type: "" }), 5000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Update Authorized Domain" : "Authorize New Domain"}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 py-2">
        {/* Local Modal Messages */}
        {message.msg && (
          <div
            className={`p-4 text-xs rounded-xl border ${
              message.type === "success"
                ? "text-green-400 bg-green-500/10 border-green-500/30"
                : message.type === "failed"
                  ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                  : "text-red-400 bg-red-500/10 border-red-500/30"
            }`}
          >
            {message.msg}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted tracking-widest ml-1">
            Origin URL (Protocol + Domain)
          </label>
          <div className="relative">
            <Globe
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              size={16}
            />
            <input
              type="text"
              placeholder="https://example.com"
              className="w-full bg-background border border-card-border pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-sm transition-all"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {isEdit ? "Update Permissions" : "Grant Access"}
        </button>
      </form>
    </Modal>
  );
};

export default AddEditCorsModal;
