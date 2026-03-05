"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import SectionSlider from "@/components/home/SectionSlider";
import { LogIn, Star } from "lucide-react";
import SectionSlider from "./SectionSlider";
import { getAllBooks, getFavouriteBooks } from "@/utils/apis/booksApi";
import { getAllCategories } from "@/utils/apis/categoriesApi";
import { getAllAuthors } from "@/utils/apis/authorsApi";
import AddEditBook from "../Books/AddEditBooks";
import AddEditCategory from "../Categories/AddEditCategory";
import AddEditAuthor from "../Authors/AddEditAuthor";
import { useAuth } from "@/utils/redux/AuthContext";
import DeleteBooks from "../Books/DeleteBooks";
import DeleteAuthor from "../Authors/DeleteAuthor";
import DeleteCategory from "../Categories/DeleteCategory";

const MainPage = () => {
  const { openAuthModal } = useAuth();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  const [allFavBooks, setAllFavBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);
  const [modalVisible, setModalVisible] = useState({
    type: "",
    visible: false,
    data: null,
  });

  // Mock effect to simulate API loading for skeleton states
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // fetch the ALL books by this user

  const fetchAllFavBooks = async () => {
    try {
      const data = await getFavouriteBooks();
      setAllFavBooks(data);
    } catch (error) {}
  };
  const fetchAllBooks = async () => {
    try {
      // console.log("fetching all books");

      const data = await getAllBooks();
      // console.log("all books data 👇👇👇\n\n", data);
      setAllBooks(data);
    } catch (error) {
      // console.log(error);
    }
  };

  // fetch all categories
  const fetchAllCategories = async () => {
    try {
      // console.log("fetching all books");

      const data = await getAllCategories();
      // console.log("all categories data 👇👇👇\n\n", data);
      setAllCategories(data);
    } catch (error) {
      // console.log(error);
    }
  };

  // fetch all authors
  const fetchAllAuthors = async () => {
    try {
      // console.log("fetching all books");

      const data = await getAllAuthors();
      // console.log("all authors data 👇👇👇\n\n", data);
      setAllAuthors(data);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAllBooks();
      fetchAllCategories();
      fetchAllAuthors();
      fetchAllFavBooks();
    }
  }, []);
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAllBooks();
      fetchAllCategories();
      fetchAllAuthors();
      fetchAllFavBooks();
    }
  }, [isAuthenticated, user]);

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
    <div className="">
      {/* 1. Favorite Books Section */}
      <SectionSlider
        title="Your Favorites"
        type="book"
        isLoading={loading}
        tag="favourite"
        emptyMessage="No favorite books available."
        data={allFavBooks}
        onEditBook={(item) =>
          setModalVisible({ type: "edit_book", visible: true, data: item })
        }
        onDeleteBook={(item) =>
          setModalVisible({
            type: "delete_book",
            visible: true,
            data: item,
          })
        }
        onAdd={() =>
          setModalVisible({
            visible: true,
            type: "add_book",
            data: null,
          })
        }
        onToggleFavoriteBook={(item) => {}}
      />

      {/* 2. All Categories Section */}
      <SectionSlider
        title="Explore Categories"
        type="category"
        isLoading={loading}
        tag="categories"
        emptyMessage="No categories available."
        data={allCategories}
        onEditCategory={(item) =>
          setModalVisible({
            type: "edit_category",
            visible: true,
            data: item,
          })
        }
        onAdd={() =>
          setModalVisible({
            visible: true,
            type: "add_category",
            data: null,
          })
        }
        onDeleteCategory={(item) =>
          setModalVisible({
            type: "delete_category",
            visible: true,
            data: item,
          })
        }
      />

      {/* 3. All Books Section */}
      <SectionSlider
        title="Latest Additions"
        type="book"
        isLoading={loading}
        tag="books"
        emptyMessage="No books added yet."
        data={allBooks}
        onEditBook={(item) =>
          setModalVisible({
            type: "edit_book",
            visible: true,
            data: item,
          })
        }
        onAdd={() =>
          setModalVisible({
            visible: true,
            type: "add_book",
            data: null,
          })
        }
        onDeleteBook={(item) =>
          setModalVisible({
            type: "delete_book",
            visible: true,
            data: item,
          })
        }
        onToggleFavoriteBook={(item) => {}}
      />

      {/* 4. All Authors Section */}
      <SectionSlider
        title="Top Authors"
        type="author"
        isLoading={loading}
        tag="authors"
        emptyMessage="No authors available."
        data={allAuthors}
        onAdd={() =>
          setModalVisible({
            visible: true,
            type: "add_author",
            data: null,
          })
        }
        onEditAuthor={(item) =>
          setModalVisible({
            visible: true,
            type: "edit_author",
            data: item,
          })
        }
        onDeleteAuthor={(item) =>
          setModalVisible({
            visible: true,
            type: "edit_author",
            data: item,
          })
        }
      />
      {/* bbok operations */}
      <AddEditBook
        onClose={() => {
          setModalVisible({
            visible: false,
            type: "",
            data: null,
          });
        }}
        isOpen={modalVisible.visible && modalVisible.type === "add_book"}
        onRefresh={() => {
          fetchAllBooks();
          fetchAllFavBooks();
        }}
        type={"add"}
      />
      <AddEditBook
        onClose={() => {
          setModalVisible({
            visible: false,
            type: "",
            data: null,
          });
        }}
        book={modalVisible.data}
        type={"edit"}
        isOpen={modalVisible.visible && modalVisible.type === "edit_book"}
        onRefresh={() => {
          fetchAllBooks();
          fetchAllFavBooks();
        }}
      />

      {/* category operations */}

      <AddEditCategory
        onClose={() => {
          setModalVisible({
            visible: false,
            type: "",
            data: null,
          });
        }}
        // category={}
        type={"add"}
        onRefresh={() => {
          fetchAllCategories();
        }}
        isOpen={modalVisible.visible && modalVisible.type === "add_category"}
      />

      <AddEditCategory
        onClose={() => {
          setModalVisible({
            visible: false,
            type: "",
            data: null,
          });
        }}
        category={modalVisible.data}
        type={"edit"}
        onRefresh={() => {
          fetchAllCategories();
        }}
        isOpen={modalVisible.visible && modalVisible.type === "edit_category"}
      />

      {/* author operations */}

      <AddEditAuthor
        onClose={() => {
          setModalVisible({
            visible: false,
            type: "",
            data: null,
          });
        }}
        type="add"
        onRefresh={() => {
          fetchAllAuthors();
        }}
        isOpen={modalVisible.visible && modalVisible.type === "add_author"}
      />

      <AddEditAuthor
        onClose={() => {
          setModalVisible({
            visible: false,
            type: "",
            data: null,
          });
        }}
        onRefresh={() => {
          fetchAllAuthors();
        }}
        type="edit"
        isOpen={modalVisible.visible && modalVisible.type === "edit_author"}
      />

      {/* delete operations on books | authors | categories */}

      <DeleteBooks
        bookId={modalVisible?.data?._id}
        onClose={() => {
          setModalVisible({
            visible: false,
            type: "",
            data: null,
          });
        }}
        onRefresh={() => {
          fetchAllBooks();
          fetchAllFavBooks();
        }}
        isOpen={modalVisible.visible && modalVisible.type === "delete_book"}
      />
      <DeleteAuthor
        author={modalVisible?.data?._id}
        onClose={() => {
          setModalVisible({
            visible: false,
            type: "",
            data: null,
          });
        }}
        onRefresh={() => {
          fetchAllAuthors();
        }}
        isOpen={modalVisible.visible && modalVisible.type === "delete_author"}
      />
      <DeleteCategory
        category={modalVisible?.data}
        onClose={() => {
          setModalVisible({
            visible: false,
            type: "",
            data: null,
          });
        }}
        onRefresh={() => {
          fetchAllCategories();
        }}
        isOpen={modalVisible.visible && modalVisible.type === "delete_category"}
      />
    </div>
  );
};

export default MainPage;
