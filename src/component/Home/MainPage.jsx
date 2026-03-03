"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import SectionSlider from "@/components/home/SectionSlider";
import { LogIn, Star } from "lucide-react";
import SectionSlider from "./SectionSlider";

const MainPage = ({ openAuthModal }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  // Mock effect to simulate API loading for skeleton states
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_var(--primary)]">
          <div className="min-w-[32px] flex justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 text-[#a78bfa] fill-current animate-pulse drop-shadow-[0_0_8px_#a78bfa]"
            >
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Your Vault Awaits
        </h2>
        <p className="text-muted max-w-md mb-8">
          Join the AksharVault community to organize your personal library,
          track your favorite authors, and secure your digital collection.
        </p>
        <button
          onClick={() => openAuthModal(true)}
          className="bg-primary hover:bg-accent cursor-pointer text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <LogIn size={20} /> Get Started
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-6">
      {/* 1. Favourite Section (Filtered Books) */}
      <SectionSlider
        title="Your Favorites"
        type="book"
        isLoading={loading}
        endpoint="/api/books/all?isFavourite=true"
      />

      {/* 2. All Categories Section */}
      <SectionSlider
        title="Explore Categories"
        type="category"
        isLoading={loading}
        endpoint="/api/categories/all"
      />

      {/* 3. All Books Section */}
      <SectionSlider
        title="Latest Additions"
        type="book"
        isLoading={loading}
        endpoint="/api/books/all"
      />

      {/* 4. All Authors Section */}
      <SectionSlider
        title="Top Authors"
        type="author"
        isLoading={loading}
        endpoint="/api/authors/all"
      />
    </div>
  );
};

export default MainPage;
