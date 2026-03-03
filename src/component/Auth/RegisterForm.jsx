"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/utils/redux/slices/authSlice";
import { toast } from "sonner";

const RegisterForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    countryCode: "",
  });

  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  // Sample Country Codes
  const countryCodes = [
    { code: "+91", label: "🇮🇳 IND" },
    { code: "+1", label: "🇺🇸 USA" },
    { code: "+44", label: "🇬🇧 UK" },
    { code: "+971", label: "🇦🇪 UAE" },
  ];
  // 🔥 Countdown effect
  useEffect(() => {
    if (success) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [success]);

  // 🔥 Close modal when timer hits 0
  useEffect(() => {
    if (countdown === 0 && success) {
      onClose?.();
    }
  }, [countdown, success, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛡️ Manual Validation Check
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.contact
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (formData.contact.length < 10) {
      toast.error("Please enter a valid contact number.");
      return;
    }

    const result = await dispatch(registerUser(formData));

    if (result.meta.requestStatus === "fulfilled") {
      setSuccess(true);
    }
  };

  // =========================
  // SUCCESS SCREEN
  // =========================
  if (success) {
    return (
      <div className="text-center space-y-4 py-6">
        <div className="text-green-400 text-lg font-bold">
          🎉 Account Created Successfully
        </div>

        <p className="text-sm text-muted">
          Please wait... this modal will automatically close in
        </p>

        <div className="text-3xl font-bold text-primary animate-pulse">
          {countdown}
        </div>
      </div>
    );
  }

  // =========================
  // FORM UI
  // =========================
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Loading Message */}
      {loading && (
        <div className="p-2 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          Creating your account... Please wait
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm"
        // required
      />

      <input
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm"
        // required
      />
      {/* 📱 Contact Field with Country Code Selection */}
      <div className="flex gap-2">
        <div className="relative">
          <select
            value={formData.countryCode}
            onChange={(e) =>
              setFormData({ ...formData, countryCode: e.target.value })
            }
            className="h-full bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm appearance-none cursor-pointer pr-8"
          >
            {countryCodes.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label} ({c.code})
              </option>
            ))}
          </select>
          {/* <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
            ▼
          </div> */}
        </div>
        <input
          type="text"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={(e) =>
            setFormData({ ...formData, contact: e.target.value })
          }
          pattern="^[6-9]{1}[0-9]{9}$"
          maxLength={10}
          minLength={10}
          className="flex-1 bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      <input
        type="password"
        placeholder="Create Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="w-full bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm"
        // required
      />

      <p className="text-[10px] text-muted px-1">
        By registering, you agree to AksharVault's terms of service and privacy
        policy.
      </p>

      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer w-full py-3 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-60"
      >
        {loading ? "Please wait..." : "Create My Vault"}
      </button>
    </form>
  );
};

export default RegisterForm;
