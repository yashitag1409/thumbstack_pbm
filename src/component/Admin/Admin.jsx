"use client";

import React, { useState, useEffect } from "react";
import { getAllOrigins, deleteOrigin } from "@/utils/apis/adminApi";
import {
  Search,
  Plus,
  Globe,
  Trash2,
  Pencil,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import AddEditCorsModal from "./AddEditCorsModal";

const Admin = () => {
  const [origins, setOrigins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ isOpen: false, data: null });

  // Message state for UI feedback
  const [message, setMessage] = useState({ msg: "", type: "" });

  const fetchOrigins = async () => {
    try {
      setLoading(true);
      const res = await getAllOrigins();
      setOrigins(res?.data || []);
    } catch (err) {
      setMessage({ msg: "Failed to fetch authorized origins.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrigins();
  }, []);

  // Auto-clear messages
  useEffect(() => {
    if (message.msg) {
      const timer = setTimeout(() => setMessage({ msg: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteOrigin(id);
      setMessage({
        msg: "Origin access revoked successfully.",
        type: "success",
      });
      fetchOrigins();
    } catch (err) {
      setMessage({
        msg: "Could not remove origin. Please try again.",
        type: "failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOrigins = origins.filter((item) =>
    item.origin.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative pl-6">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-full bg-gradient-to-b from-primary to-secondary" />
          <h1 className="text-2xl font-bold text-foreground">
            CORS Security Vault
          </h1>
          <p className="text-xs text-muted">
            Manage authorized domains and access permissions
          </p>
        </div>
        <button
          onClick={() => setModal({ isOpen: true, data: null })}
          className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> Add New Origin
        </button>
      </div>

      {/* --- Status Message UI --- */}
      {message.msg && (
        <div
          className={`p-4 text-xs rounded-xl border flex items-center gap-3 transition-all duration-300 ${
            message.type === "success"
              ? "text-green-400 bg-green-500/10 border-green-500/30"
              : message.type === "failed"
                ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                : "text-red-400 bg-red-500/10 border-red-500/30"
          }`}
        >
          <AlertCircle size={16} />
          {message.msg}
        </div>
      )}

      {/* --- Search Bar --- */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          size={18}
        />
        <input
          type="text"
          placeholder="Search authorized domains..."
          className="w-full bg-card border border-card-border pl-12 pr-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* --- Data Table --- */}
      <div className="glass border border-card-border rounded-2xl overflow-x-scroll shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 border-b border-card-border text-muted font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-6 py-5">Origin URL</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border/50">
            {loading && origins.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-20 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-primary"
                    size={32}
                  />
                </td>
              </tr>
            ) : filteredOrigins.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-20 text-center text-muted italic">
                  No authorized origins found matching your search.
                </td>
              </tr>
            ) : (
              filteredOrigins.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-5 font-mono text-xs text-secondary flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10 text-white">
                      <Globe size={14} />
                    </div>
                    {item.origin}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                        item.status === "active"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-3  transition-all duration-300">
                      <button
                        onClick={() => setModal({ isOpen: true, data: item })}
                        className="p-2.5 rounded-lg  bg-blue-400/20 text-blue-400 transition-all active:scale-90"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2.5 rounded-lg bg-red-500/20 text-red-500 transition-all active:scale-90"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Add/Edit Modal Implementation --- */}
      <AddEditCorsModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        data={modal.data}
        onRefresh={fetchOrigins}
      />
    </div>
  );
};

export default Admin;
