"use client";

import React, { useEffect, useRef, useState } from "react";
import { getAllCategories } from "@/utils/apis/categoriesApi";
import { CategoryCard, SectionHeading } from "../Home/SectionSlider";
import { Plus } from "lucide-react";
import AddEditCategory from "./AddEditCategory";
import DeleteCategory from "./DeleteCategory";

const CategorySkeleton = () => (
  <div className="h-40 rounded-2xl border border-card-border bg-card p-5 animate-pulse flex flex-col justify-between">
    <div className="w-10 h-10 bg-card-border rounded-lg" />
    <div>
      <div className="h-4 w-1/2 bg-card-border rounded mb-2" />
      <div className="h-3 w-3/4 bg-card-border rounded" />
    </div>
  </div>
);

const Categories = () => {
  const [categories, setCategories] = useState([]);
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

  // API call
  const fetchCategories = async (reset = false) => {
    try {
      setLoading(true);

      const res = await getAllCategories({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
      });
      const newCategories = res.data || [];

      setCategories((prev) =>
        page === 1 ? newCategories : [...prev, ...newCategories],
      );

      setTotalPages(res.totalPages || 1);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // fetch data
  useEffect(() => {
    fetchCategories();
  }, [page, debouncedSearch, modalVisible.visible]);

  // infinite scroll
  const lastCategoryRef = (node) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < totalPages) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

  return (
    <section className="px-4 md:px-8 py-6">
      <div className="flex items-center justify-between  mb-6">
        <SectionHeading title={"All Categories"} />

        <button
          onClick={() =>
            setModalVisible({ visible: true, type: "add", data: null })
          }
          className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white text-sm font-semibold"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-card-border rounded-lg px-3 py-2 bg-background text-sm outline-none focus:border-primary"
        />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {categories.map((category, index) => {
          if (categories.length === index + 1) {
            return (
              <div ref={lastCategoryRef} key={category._id}>
                <CategoryCard
                  item={category}
                  onEdit={(item) =>
                    setModalVisible({
                      type: "edit",
                      visible: true,
                      data: item,
                    })
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
            <CategoryCard
              key={category._id}
              item={category}
              onEdit={(item) =>
                setModalVisible({
                  type: "edit",
                  visible: true,
                  data: item,
                })
              }
              onDelete={(item) =>
                setModalVisible({
                  type: "delete",
                  visible: true,
                  data: item,
                })
              }
            />
          );
        })}

        {loading &&
          Array(4)
            .fill(0)
            .map((_, i) => <CategorySkeleton key={i} />)}
      </div>

      {/* Empty */}
      {!loading && categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-card-border rounded-xl mt-6">
          <p className="text-muted text-sm">No categories found</p>
        </div>
      )}

      {/* Modals */}
      <AddEditCategory
        isOpen={modalVisible.visible && modalVisible.type === "add"}
        type="add"
        onClose={() =>
          setModalVisible({
            visible: false,
            type: "",
            data: null,
          })
        }
        onRefresh={() => {
          setPage(1);
          setCategories([]);
          fetchCategories(true);
        }}
      />

      <AddEditCategory
        isOpen={modalVisible.visible && modalVisible.type === "edit"}
        type="edit"
        category={modalVisible.data}
        onClose={() =>
          setModalVisible({
            visible: false,
            type: "",
            data: null,
          })
        }
        onRefresh={() => {
          setPage(1);
          setCategories([]);
          fetchCategories(true);
        }}
      />

      <DeleteCategory
        category={modalVisible.data}
        isOpen={modalVisible.visible && modalVisible.type === "delete"}
        onClose={() =>
          setModalVisible({
            visible: false,
            type: "",
            data: null,
          })
        }
      />
    </section>
  );
};

export default Categories;
