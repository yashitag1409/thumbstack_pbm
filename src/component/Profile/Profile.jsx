"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Camera, User, Mail, Globe, Phone, Save, Loader2 } from "lucide-react";
// import { updateProfile } from "@/utils/apis/authApi"; // Import your API call
import { toast } from "sonner";
import { updateProfile } from "@/utils/redux/slices/authSlice";

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const dispatch = useDispatch();
  // Schema-aligned form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    countryCode: "",
    profileImage: null,
  });

  // Sync state when component mounts or user changes
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
      setImagePreview(URL.createObjectURL(file)); // Generate local preview
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare Multipart/Form-Data for backend
    const data = new FormData();
    data.append("name", formData.name);
    data.append("contact", formData.contact);
    data.append("countryCode", formData.countryCode);

    // Only append image if a new one was selected
    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }

    try {
      dispatch(updateProfile(data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated)
    return (
      <div className="p-10 text-center">Please login to view profile.</div>
    );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* Header with your custom Gradient Border */}
      <div className="relative pl-6 flex items-center">
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5 rounded-full"
          style={{ background: "linear-gradient(to bottom, #6366f1, #0ea5e9)" }}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          User Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Profile Image Section */}
        <div className="lg:col-span-1">
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
        </div>

        {/* Form Details Section aligned with userSchema */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleUpdate}
            className="glass border border-card-border rounded-2xl p-6 space-y-6 shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted uppercase ml-1 flex items-center gap-2">
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

              {/* Email (Disabled as per unique constraint in schema) */}
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

              {/* Country Code */}
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

              {/* Contact */}
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
                className="cursor-pointer flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-60"
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
