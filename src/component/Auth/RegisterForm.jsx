"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/utils/redux/slices/authSlice";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const RegisterForm = ({ onClose, onSetLogin }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    countryCode: "+91",
  });

  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [localMsg, setLocalMsg] = useState({ msg: "", type: "" }); // types: 'error' | 'success'

  const countryCodes = [
    { code: "+91", label: "🇮🇳 IND" },
    { code: "+1", label: "🇺🇸 USA" },
    { code: "+44", label: "🇬🇧 UK" },
    { code: "+971", label: "🇦🇪 UAE" },
  ];

  // Sync Redux Errors to Local UI
  useEffect(() => {
    if (error) setLocalMsg({ msg: error, type: "error" });
  }, [error]);

  // Handle Success Countdown & Auto-close
  useEffect(() => {
    let interval;
    if (success) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onClose?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      // Reset logic when component unmounts
      if (!success) setLocalMsg({ msg: "", type: "" });
    };
  }, [success, onClose]);

  // Auto-clear error messages
  useEffect(() => {
    if (localMsg.msg && localMsg.type === "error" && !loading) {
      const timer = setTimeout(() => setLocalMsg({ msg: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [localMsg, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Manual Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.contact
    ) {
      setLocalMsg({
        msg: "All fields are required to create a vault.",
        type: "error",
      });
      return;
    }

    if (formData.contact.length !== 10) {
      setLocalMsg({
        msg: "Please enter a valid 10-digit contact number.",
        type: "error",
      });
      return;
    }

    const result = await dispatch(registerUser(formData));

    if (result.meta.requestStatus === "fulfilled") {
      setSuccess(true);
      setLocalMsg({
        msg: "Registration successful! Please login to continue.",
        type: "success",
      });
    }
  };

  // --- Success UI Block ---
  if (success) {
    return (
      <div className="text-center space-y-6 py-8 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
            <CheckCircle2 size={48} />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Vault Created!</h2>
          <p className="text-sm text-muted px-6">
            Registration successful! Please login to continue. This modal will
            close automatically.
          </p>
        </div>
        <div className="inline-block px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-2xl tracking-tighter">
          {countdown}s
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Status Alert Block */}
      {(loading || localMsg.msg) && (
        <div
          className={`flex items-center gap-3 p-3.5 text-xs font-medium border rounded-xl transition-all duration-300 ${
            loading
              ? "text-blue-400 bg-blue-500/10 border-blue-500/20 animate-pulse"
              : localMsg.type === "success"
                ? "text-green-400 bg-green-500/10 border-green-500/20"
                : "text-red-400 bg-red-500/10 border-red-500/20"
          }`}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <AlertCircle size={16} />
          )}
          {loading ? "Constructing your vault... Please wait" : localMsg.msg}
        </div>
      )}

      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full bg-background border border-card-border p-3.5 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-sm transition-all shadow-inner"
      />

      <input
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full bg-background border border-card-border p-3.5 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-sm transition-all shadow-inner"
      />

      <div className="flex gap-2">
        <select
          value={formData.countryCode}
          onChange={(e) =>
            setFormData({ ...formData, countryCode: e.target.value })
          }
          className="bg-background border border-card-border p-3 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-sm cursor-pointer appearance-none pr-8 relative shadow-inner"
        >
          {countryCodes.map((c) => (
            <option key={c.code} value={c.code} className="bg-[#1a1b1e]">
              {c.label} ({c.code})
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={(e) =>
            setFormData({ ...formData, contact: e.target.value })
          }
          maxLength={10}
          className="flex-1 bg-background border border-card-border p-3.5 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-sm shadow-inner"
        />
      </div>

      <input
        type="password"
        placeholder="Create Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="w-full bg-background border border-card-border p-3.5 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-sm transition-all shadow-inner"
      />

      <p className="text-[10px] text-muted px-2 leading-relaxed">
        By registering, you agree to AksharVault's{" "}
        <span className="text-primary hover:underline cursor-pointer">
          Terms of Service
        </span>{" "}
        and{" "}
        <span className="text-primary hover:underline cursor-pointer">
          Privacy Policy
        </span>
        .
      </p>

      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer w-full py-3.5 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-60 flex justify-center items-center gap-2"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : null}
        {loading ? "Building Vault..." : "Create My Vault"}
      </button>
    </form>
  );
};

export default RegisterForm;
