"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BookCard, SectionHeading, SkeletonCard } from "../Home/SectionSlider";
import { getAllBooks, updateBook } from "@/utils/apis/booksApi";
import AddEditBook from "./AddEditBooks";
import { Plus } from "lucide-react";
import DeleteBooks from "./DeleteBooks";

const Books = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const [modalVisible, setModalVisible] = useState({
    type: "",
    visible: false,
    data: null,
  });
  const [updateFav, setUpdateFav] = useState(false);
  const fetchBooks = async () => {
    if (!hasMore) return;

    try {
      setLoading(true);

      const res = await getAllBooks({ page, limit: 10 });

      console.log("API Response:", res);

      const newBooks = res.data || [];

      setAllBooks((prev) => {
        // prevent duplicates
        const existingIds = new Set(prev.map((b) => b._id));
        const filtered = newBooks.filter((b) => !existingIds.has(b._id));
        return [...prev, ...filtered];
      });

      // pagination control
      if (page >= res.totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Fetch Books Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page]);

  // update the book by isFavorite status
  const updateBooksByFav = async (book) => {
    try {
      setUpdateFav(true);
      await updateBook(book._id, {
        isFavorite: !book.isFavorite,
      });

      // refresh books list
      setAllBooks((prev) =>
        prev.map((b) =>
          b._id === book._id ? { ...b, isFavorite: !b.isFavorite } : b,
        ),
      );
    } catch (error) {
      console.log("Favorite update error:", error);
    } finally {
      setUpdateFav(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated, modalVisible.visible, updateFav]);

  // Infinite Scroll Observer
  const lastBookRef = (node) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

  return (
    <section className="px-4 md:px-8 py-6">
      <div className="flex items-center justify-between  mb-6">
        <SectionHeading title={"Your Collection"} />

        <button
          onClick={() =>
            setModalVisible({ visible: true, type: "add", data: null })
          }
          className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white text-sm font-semibold"
        >
          <Plus size={16} />
          Add Books
        </button>
      </div>
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
        <div className="grid grid-cols-1 md:grid-cols-4  gap-4">
          {allBooks.map((book, index) => {
            if (allBooks.length === index + 1) {
              return (
                <div ref={lastBookRef} key={book._id}>
                  <BookCard
                    item={book}
                    onEdit={() =>
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
                    onToggleFavorite={() => updateBooksByFav(book)}
                  />
                </div>
              );
            }

            return (
              <BookCard
                key={book._id}
                item={book}
                onEdit={() =>
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
                onToggleFavorite={() => updateBooksByFav(book)}
              />
            );
          })}
        </div>
      )}

      {loading && page > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} type="book" />
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

      <DeleteBooks
        onClose={() =>
          setModalVisible({
            visible: false,
            type: "",
            data: null,
          })
        }
        isOpen={modalVisible.visible && modalVisible.type === "delete"}
        bookId={modalVisible.data?._id}
        onRefresh={fetchBooks}
      />
    </section>
  );
};

export default Books;
