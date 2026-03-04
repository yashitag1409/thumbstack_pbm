"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import SectionSlider from "@/components/home/SectionSlider";
import { LogIn, Star } from "lucide-react";
import SectionSlider from "./SectionSlider";
import { getAllBooks, getFavouriteBooks } from "@/utils/apis/booksApi";
import { getAllCategories } from "@/utils/apis/categoriesApi";
import { getAllAuthors } from "@/utils/apis/authorsApi";

const MainPage = ({ openAuthModal }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  const [allFavBooks, setAllFavBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);

  // Mock effect to simulate API loading for skeleton states
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // fetch the ALL books by this user

  const fetchAllFavBooks = async () => {
    try {
      console.log("fetching all books");

      const data = await getFavouriteBooks();
      console.log("all fav books data 👇👇👇\n\n", data);
      setAllFavBooks(data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAllBooks = async () => {
    try {
      console.log("fetching all books");

      const data = await getAllBooks();
      console.log("all books data 👇👇👇\n\n", data);
      setAllBooks(data);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch all categories
  const fetchAllCategories = async () => {
    try {
      console.log("fetching all books");

      const data = await getAllCategories();
      console.log("all categories data 👇👇👇\n\n", data);
      setAllCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch all authors
  const fetchAllAuthors = async () => {
    try {
      console.log("fetching all books");

      const data = await getAllAuthors();
      console.log("all authors data 👇👇👇\n\n", data);
      setAllAuthors(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllBooks();
    fetchAllCategories();
    fetchAllAuthors();
    fetchAllFavBooks();
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
      {/* 1. Favorite Books Section */}
      <SectionSlider
        title="Your Favorites"
        type="book"
        isLoading={loading}
        tag="favourite"
        emptyMessage="No favorite books available."
        data={allFavBooks}
      />

      {/* 2. All Categories Section */}
      <SectionSlider
        title="Explore Categories"
        type="category"
        isLoading={loading}
        tag="categories"
        emptyMessage="No categories available."
        data={allCategories}
      />

      {/* 3. All Books Section */}
      <SectionSlider
        title="Latest Additions"
        type="book"
        isLoading={loading}
        tag="books"
        emptyMessage="No books added yet."
        data={allBooks}
      />

      {/* 4. All Authors Section */}
      <SectionSlider
        title="Top Authors"
        type="author"
        isLoading={loading}
        tag="authors"
        emptyMessage="No authors available."
        data={allAuthors}
      />
    </div>
  );
};

export default MainPage;
