"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// Added LogOut icon
import {
  Camera,
  User,
  Mail,
  Globe,
  Phone,
  Save,
  Loader2,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { updateProfile, logout } from "@/utils/redux/slices/authSlice"; // Import logout action
import { useRouter } from "next/navigation"; // To redirect after logout

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    countryCode: "",
    profileImage: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        contact: user.contact || "",
        countryCode: user.countryCode || "+91",
        profileImage: null,
      });
      setImagePreview(user.profileImage || null);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("contact", formData.contact);
    data.append("countryCode", formData.countryCode);

    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }

    try {
      await dispatch(updateProfile(data)).unwrap();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/"); // Redirect to home/landing page
  };

  if (!isAuthenticated)
    return (
      <div className="p-10 text-center">Please login to view profile.</div>
    );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative pl-6 flex items-center">
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5 rounded-full"
            style={{
              background: "linear-gradient(to bottom, #6366f1, #0ea5e9)",
            }}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            User Profile
          </h1>
        </div>

        {/* Desktop Logout Button */}
        <button
          onClick={handleLogout}
          className=" cursor-pointer hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all font-semibold text-sm active:scale-95"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Left Section: Avatar & Role */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass border border-card-border rounded-2xl p-8 flex flex-col items-center shadow-lg">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-card-border group-hover:border-primary transition-all duration-300 shadow-xl">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted/20 flex items-center justify-center text-muted">
                    <User size={50} />
                  </div>
                )}
              </div>

              <label className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-secondary transition-all shadow-lg active:scale-90">
                <Camera size={18} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <h2 className="mt-4 font-bold text-xl text-foreground">
              {user?.name}
            </h2>
            <p className="text-xs font-medium text-primary uppercase tracking-widest mt-1">
              {user?.role}
            </p>
          </div>

          {/* Mobile Logout Button (Shows only in column on mobile) */}
          <button
            onClick={handleLogout}
            className="md:hidden w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/30 text-red-500 bg-red-500/5 font-bold"
          >
            <LogOut size={18} /> Logout Session
          </button>
        </div>

        {/* Right Section: Form Details */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleUpdate}
            className="glass border border-card-border rounded-2xl p-6 space-y-6 shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted uppercase ml-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted uppercase ml-1 opacity-60">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-muted/10 border border-card-border p-3 rounded-xl text-sm outline-none cursor-not-allowed opacity-60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted uppercase ml-1">
                  Country Code
                </label>
                <input
                  type="text"
                  value={formData.countryCode}
                  onChange={(e) =>
                    setFormData({ ...formData, countryCode: e.target.value })
                  }
                  className="w-full bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted uppercase ml-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  className="w-full bg-background border border-card-border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
