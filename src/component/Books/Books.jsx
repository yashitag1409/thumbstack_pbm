"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { BookCard, SkeletonCard } from "@/components/SectionSlider";
// import { getAllBooks } from "@/services/books";
import { BookCard, SectionHeading, SkeletonCard } from "../Home/SectionSlider";
import { getAllBooks } from "@/utils/apis/booksApi";
import AddEditBook from "./AddEditBooks";
import { Plus } from "lucide-react";

const Books = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState({
    type: "",
    visible: false,
    data: null,
  });

  const fetchAllBooks = async () => {
    try {
      setLoading(true);

      const data = await getAllBooks();

      setAllBooks(data || []);
    } catch (error) {
      console.log("Fetch Books Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllBooks();
    }
  }, [isAuthenticated, modalVisible.visible]);

  return (
    <section className="px-4 md:px-8 py-6">
      <SectionHeading title={"Your Books"} />
      {/* Add Book Button */}
      {!loading && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() =>
              setModalVisible({
                visible: true,
                type: "add",
                data: null,
              })
            }
            className="cursor-pointer  flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all"
          >
            <Plus size={16} />
            Add Book
          </button>
        </div>
      )}
      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} type="book" />
            ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && allBooks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-card-border rounded-xl">
          <p className="text-muted text-sm">No books found</p>
        </div>
      )}

      {/* Books Grid */}
      {!loading && allBooks.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {allBooks.map((book) => (
            <BookCard
              key={book._id}
              item={book}
              onEdit={(item) =>
                setModalVisible({
                  type: "edit",
                  visible: true,
                  data: book,
                })
              }
              onDelete={() =>
                setModalVisible({
                  type: "delete",
                  visible: true,
                  data: book,
                })
              }
              onToggleFavorite={() =>
                setModalVisible({
                  type: "favorite",
                  visible: true,
                  data: book,
                })
              }
            />
          ))}
        </div>
      )}
      {/* add modal */}
      <AddEditBook
        type={"add"}
        onClose={() =>
          setModalVisible({
            visible: false,
            type: "",
            data: null,
          })
        }
        isOpen={modalVisible.visible && modalVisible.type === "add"}
      />

      {/* edit modal */}

      <AddEditBook
        type={"edit"}
        onClose={() =>
          setModalVisible({
            visible: false,
            type: "",
            data: null,
          })
        }
        book={modalVisible.data}
        isOpen={modalVisible.visible && modalVisible.type === "edit"}
      />

      {/* delete modal  */}
    </section>
  );
};

export default Books;
