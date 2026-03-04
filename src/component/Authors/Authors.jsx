"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { getAllAuthors } from "@/utils/apis/authorsApi";
import AddEditAuthor from "./AddEditAuthor";
import DeleteAuthor from "./DeleteAuthor";
import { AuthorCard, SectionHeading } from "../Home/SectionSlider";
// import AuthorCard from "./AuthorCard";

const AuthorSkeleton = () => (
  <div className="h-36 rounded-xl border border-card-border bg-card animate-pulse p-4 flex flex-col justify-between">
    <div className="w-8 h-8 rounded-full bg-card-border" />
    <div className="h-3 bg-card-border rounded w-1/2" />
  </div>
);

const Authors = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const observer = useRef();

  const [modalVisible, setModalVisible] = useState({
    type: "",
    visible: false,
    data: null,
  });

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchAuthors = async () => {
    try {
      setLoading(true);

      const res = await getAllAuthors({
        page,
        limit: 8,
        search: debouncedSearch,
      });

      console.log("API Response:", res);

      const newAuthors = res?.data || res?.data?.data || [];

      setAuthors((prev) => {
        if (page === 1) return newAuthors;

        const existingIds = new Set(prev.map((a) => a._id));
        const filtered = newAuthors.filter((a) => !existingIds.has(a._id));

        return [...prev, ...filtered];
      });

      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAuthors();
    }
  }, [page, debouncedSearch, modalVisible.visible]);

  // infinite scroll
  const lastAuthorRef = (node) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < totalPages) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  };
  console.log("authors state:", authors);
  return (
    <section className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <SectionHeading title={"All Authors"} />

        <button
          onClick={() =>
            setModalVisible({ visible: true, type: "add", data: null })
          }
          className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white text-sm font-semibold"
        >
          <Plus size={16} />
          Add Author
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="Search authors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-card-border rounded-lg px-3 py-2 mb-6 bg-background text-sm"
      />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {authors.map((author, index) => {
          if (authors.length === index + 1) {
            return (
              <div ref={lastAuthorRef} key={author._id}>
                <AuthorCard
                  item={author}
                  onEdit={(item) =>
                    setModalVisible({ type: "edit", visible: true, data: item })
                  }
                  onDelete={(item) =>
                    setModalVisible({
                      type: "delete",
                      visible: true,
                      data: item,
                    })
                  }
                />
              </div>
            );
          }

          return (
            <AuthorCard
              key={author._id}
              item={author}
              onEdit={(item) =>
                setModalVisible({ type: "edit", visible: true, data: item })
              }
              onDelete={(item) =>
                setModalVisible({ type: "delete", visible: true, data: item })
              }
            />
          );
        })}

        {loading &&
          Array(4)
            .fill(0)
            .map((_, i) => <AuthorSkeleton key={i} />)}
      </div>

      {/* Empty */}
      {!loading && authors.length === 0 && (
        <div className="text-center py-20 text-muted">No authors found</div>
      )}

      {/* Add */}
      <AddEditAuthor
        isOpen={modalVisible.visible && modalVisible.type === "add"}
        onClose={() =>
          setModalVisible({ visible: false, type: "", data: null })
        }
        onRefresh={() => {
          setPage(1);
          setAuthors([]);
          fetchAuthors();
        }}
      />

      {/* Edit */}
      <AddEditAuthor
        isOpen={modalVisible.visible && modalVisible.type === "edit"}
        author={modalVisible.data}
        type="edit"
        onClose={() =>
          setModalVisible({ visible: false, type: "", data: null })
        }
        onRefresh={() => {
          setPage(1);
          setAuthors([]);
          fetchAuthors();
        }}
      />

      {/* Delete */}
      <DeleteAuthor
        isOpen={modalVisible.visible && modalVisible.type === "delete"}
        author={modalVisible.data}
        onClose={() =>
          setModalVisible({ visible: false, type: "", data: null })
        }
        onRefresh={() => {
          setPage(1);
          setAuthors([]);
          fetchAuthors();
        }}
      />
    </section>
  );
};

export default Authors;
