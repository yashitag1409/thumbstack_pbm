"use client";

import {
  loginViaPassword,
  loginViaOtp,
  sendOtp,
} from "@/utils/redux/slices/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const LoginForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [loginMethod, setLoginMethod] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({
    msg: "",
    title: "",
  });
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // ✅ Countdown effect
  useEffect(() => {
    if (success) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [success]);

  // ✅ Close modal when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && success) {
      onClose?.();
    }
  }, [countdown, success, onClose]);

  const handleLogin = async () => {
    try {
      if (!email) {
        setMessage({ msg: "Email is required", title: "error" });
        return;
      }

      let result;

      if (loginMethod === "password") {
        if (!password) {
          setMessage({ msg: "Password is required", title: "error" });
          return;
        }

        result = await dispatch(loginViaPassword({ email, password }));
      } else {
        if (!otp) return setMessage({ msg: "OTP is required", type: "error" });
        result = await dispatch(loginViaOtp({ email, otp }));
      }
      // console.log("resulkt from login via otp  ", result);
      if (result.meta.requestStatus === "fulfilled") {
        setSuccess(true);
      }
    } catch (error) {
      setMessage({ msg: error.message, title: "error" });
    } finally {
      setTimeout(() => {
        setMessage({ msg: "", title: "" });
      }, 5000);
    }
  };

  const handleSendOtp = async () => {
    try {
      if (!email) {
        setMessage({ msg: "Email is required", title: "error" });
        return;
      }

      const result = await dispatch(sendOtp(email));

      // console.log("resulkt from send otp  ", result);
      if (result.meta.requestStatus === "fulfilled") {
        // console.log(
        //   "resulkt from send otp payload need to be true ->  ",
        //   result.payload,
        // );

        setMessage({ msg: "OTP sent successfully", title: "success" });
      } else if (result.meta.requestStatus === "rejected") {
        setMessage({ msg: result.payload, title: "error" });
      }
    } catch (error) {
      // console.log(error);

      setMessage({ msg: error.message, title: "error" });
    } finally {
      setTimeout(() => {
        setMessage({ msg: "", title: "" });
      }, 5000);
    }
  };

  useEffect(() => {
    if (message.msg) {
      setTimeout(() => {
        setMessage({ msg: "", title: "" });
      }, 5000);
    }
  }, [message.msg]);

  // ========================
  // SUCCESS SCREEN
  // ========================
  if (success) {
    return (
      <div className="text-center space-y-4 py-6">
        <div className="text-green-400 text-lg font-bold">
          ✅ Successfully Logged In
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

  // ========================
  // FORM UI
  // ========================
  return (
    <div className="space-y-4">
      {/* Loading State */}
      {loading && (
        <div className="p-4 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          Authenticating... Please wait
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg">
          {error}
        </div>
      )}
      {message.type === "success" && (
        <div className="p-4 text-xs text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg">
          {message.msg}
        </div>
      )}

      {message.type === "error" && (
        <div className="p-4 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg">
          {message.msg}
        </div>
      )}
      {message.type === "failed" && (
        <div className="p-4 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          {message.msg}
        </div>
      )}

      {/* Switch Tabs */}
      <div className="relative flex p-1 bg-background/50 rounded-lg border border-card-border h-10">
        {/* Background Sliding Pill */}
        <div
          className={`absolute z-0 top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded transition-transform duration-300 ${
            loginMethod === "otp" ? "translate-x-full" : "translate-x-0"
          } bg-gradient-to-r from-primary via-secondary to-accent`}
        />

        {/* Password Button */}
        <button
          className={`cursor-pointer relative z-10 flex-1 py-1 text-xs font-bold transition-colors duration-300 ${
            loginMethod === "password"
              ? "text-white"
              : "text-muted hover:text-foreground"
          }`}
          onClick={() => setLoginMethod("password")}
        >
          Password
        </button>

        {/* OTP Button */}
        <button
          className={`cursor-pointer relative z-10 flex-1 py-1 text-xs font-bold transition-colors duration-300 ${
            loginMethod === "otp"
              ? "text-white"
              : "text-muted hover:text-foreground"
          }`}
          onClick={() => setLoginMethod("otp")}
        >
          OTP
        </button>
      </div>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
        className="w-full bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
      />

      {loginMethod === "password" ? (
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
        />
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="flex-1 bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
          />
          <button
            type="button"
            onClick={handleSendOtp}
            className=" cursor-pointer px-4 text-xs font-bold text-secondary"
          >
            Send OTP
          </button>
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-xl font-bold disabled:opacity-60 cursor-pointer"
      >
        Login
      </button>
    </div>
  );
};

export default LoginForm;
