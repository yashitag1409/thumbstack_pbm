"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

import { Heart, Trash2, Plus, Ghost, Edit2, Pencil, Globe } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/Button";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/helper/format";
// --- Sub-Components for Different Types ---

export const BookCard = ({ item, onEdit, onDelete, onToggleFavorite }) => {
  const router = useRouter();
  const authorName =
    item.author?.name || item.customAuthor || "Independent Author";

  const categoryName =
    item.category?.name || item.customCategory || "Uncategorized";

  const statusStyles = {
    reading: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    want_to_read: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    completed: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  return (
    <div className="group cursor-pointer transition-transform duration-300 hover:-translate-y-2 w-full max-w-sm ">
      <div className="relative flex flex-col overflow-hidden rounded-xl bg-card border border-card-border shadow-lg">
        {/* Image */}
        <div className="relative h-56 md:h-80 overflow-hidden">
          <Image
            src={item.thumbNail || "/thumbnail.jpg"}
            alt={item.title}
            fill
            className=" w-full transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 300px"
          />

          {/* Favorite */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item._id);
            }}
            className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md border transition
            ${
              item.isFavorite
                ? "bg-red-500 border-red-500 text-white"
                : "bg-black/40 border-white/20 text-white hover:bg-red-500 hover:border-red-500"
            }`}
          >
            <Heart
              size={16}
              className={item.isFavorite ? "fill-white stroke-white" : ""}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 p-4">
          {/* Title */}
          <h3 className="font-semibold text-base text-foreground line-clamp-2">
            {item.title}
          </h3>

          {/* Author */}
          <p className="text-base text-muted line-clamp-1">{authorName}</p>

          {/* Category + Pages */}
          <div className="flex items-center justify-between text-base text-muted">
            <span className="truncate">{categoryName}</span>

            {item.numberOfPages && <span>{item.numberOfPages} pages</span>}
          </div>

          {/* Status */}
          <div className="pt-1">
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full border capitalize ${
                statusStyles[item.status] ||
                "bg-gray-500/20 text-gray-400 border-gray-500/30"
              }`}
            >
              {item.status?.replaceAll("_", " ") || "unknown"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              size="sm"
              onClick={() => router.push(`/books/${item._id}`)}
              className="cursor-pointer flex items-center gap-1 bg-primary hover:bg-primary/90 text-white"
            >
              <Plus size={14} />
              Read
            </Button>

            <div className="flex gap-2">
              {/* Edit */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-md border border-card-border text-muted hover:text-primary hover:border-primary transition"
              >
                <Edit2 size={14} />
              </button>

              {/* Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item._id);
                }}
                className=" cursor-pointer flex h-8 w-8 items-center justify-center rounded-md border border-card-border text-muted hover:text-red-500 hover:border-red-500 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AuthorCardHome = ({ item }) => (
  <div className="group cursor-pointer flex flex-col items-center transition-transform duration-300 hover:-translate-y-2">
    {/* Added lift here */}
    <div className="w-full aspect-square rounded-full overflow-hidden border-2 border-card-border group-hover:border-primary transition-all duration-300 shadow-xl">
      <Image
        src={item.profileImage || "/placeholder-user.png"}
        alt={item.name}
        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
        width={100}
        height={100}
      />
    </div>
    <p className="mt-3 font-bold text-base text-foreground group-hover:text-primary transition-colors text-center line-clamp-1">
      {item.name}
    </p>
    <p className="text-base text-muted line-clamp-1">Author</p>
  </div>
);

export const AuthorCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="group relative border border-card-border rounded-xl p-4 bg-card hover:border-primary/30 transition">
      {/* Actions */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={() => onEdit(item)}
          className="cursor-pointer p-1 rounded-md hover:bg-card-border"
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={() => onDelete(item)}
          className="cursor-pointer p-1 rounded-md hover:bg-red-500/20"
        >
          <Trash2 size={16} className="text-red-400" />
        </button>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={
            item?.profileImage ||
            `https://ui-avatars.com/api/?name=${item?.name}`
          }
          alt={item?.name}
          className="w-12 h-12 rounded-full object-cover border border-card-border"
        />

        <div>
          <h3 className="font-semibold text-sm">{item?.name}</h3>

          {item?.website && (
            <a
              href={item.website}
              target="_blank"
              className="text-xs text-primary flex items-center gap-1"
            >
              <Globe size={12} />
              Website
            </a>
          )}
        </div>
      </div>

      {/* Bio */}
      <p className="text-xs text-muted line-clamp-3">
        {item?.biography || "No biography available"}
      </p>

      {/* Footer */}
      <div className="mt-3 text-[11px] text-muted flex flex-row justify-between gap-1">
        <span>Created: {formatDate(item?.createdAt)}</span>
        <span>Updated: {formatDate(item?.updatedAt)}</span>
      </div>
    </div>
  );
};

export const CategoryCard = ({ item, onEdit, onDelete }) => (
  <div className="group relative cursor-pointer transition-transform duration-300 hover:-translate-y-2">
    {/* ACTION BUTTONS */}
    <div className="absolute top-3 right-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition z-20 pointer-events-auto">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(item);
        }}
        className="p-2 cursor-pointer rounded-lg bg-card border border-card-border hover:bg-primary/20 transition shadow-sm"
      >
        <Pencil size={16} className="text-primary" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(item);
        }}
        className="p-2 cursor-pointer rounded-lg bg-card border border-card-border hover:bg-red-500/20 transition shadow-sm"
      >
        <Trash2 size={16} className="text-red-400" />
      </button>
    </div>

    {/* CARD */}
    <div className="relative z-10 h-full rounded-2xl glass border border-card-border p-5 flex flex-col justify-between transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/30 shadow-md">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
          <span className="text-lg font-bold">
            {item?.name?.charAt(0)?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-2">
        <h4 className="font-bold text-base md:text-lg text-foreground line-clamp-1">
          {item?.name}
        </h4>

        <p className="text-sm md:text-base text-muted line-clamp-2 mt-1">
          {item?.description || "Browse collection"}
        </p>
      </div>

      {/* Footer */}
      <div className="text-[11px] text-muted mt-3 flex flex-row justify-between gap-1">
        <span>Created: {formatDate(item?.createdAt)}</span>
        <span>Updated: {formatDate(item?.updatedAt)}</span>
      </div>
    </div>
  </div>
);
// --- Main Slider Component ---

const SectionSlider = ({
  title,
  type,
  isLoading,
  data = [],
  emptyMessage = "No books found",
  tag = "favourite",
  onDeleteBook,
  onEditBook,
  onToggleFavoriteBook,
  onAdd, // this is for the add model open
  onDeleteAuthor,
  onEditAuthor,
  onDeleteCategory,
  onEditCategory,
}) => {
  // Extracting the list safely from the API response structure
  const list = Array.isArray(data) ? data : data?.data || [];

  // --- Empty State Component ---
  const EmptyState = () => (
    <div className="w-full py-10 flex flex-col items-center justify-center border-2 border-dashed border-card-border rounded-2xl bg-card/5 transition-colors hover:bg-card/10">
      <div className="p-4 rounded-full bg-primary/10 mb-4">
        <Ghost className="text-primary opacity-60" size={32} />
      </div>
      <p className="text-sm font-medium text-foreground">No {tag}s found</p>
      <p className="text-xs text-muted mt-1 px-4 text-center">{emptyMessage}</p>
      <button className="mt-4 flex items-center gap-1.5 text-sm uppercase font-bold tracking-wider px-4 py-2 rounded-full bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer">
        <Plus size={12} /> Add {type}
      </button>
    </div>
  );

  const renderCard = (item) => {
    switch (type) {
      case "book":
        return (
          <BookCard
            item={item}
            onDelete={() => onDeleteBook(item)}
            onEdit={() => onEditBook(item)}
            onToggleFavorite={() => onToggleFavoriteBook(item)}
          />
        );
      case "author":
        return (
          <AuthorCard
            item={item}
            onDelete={() => onDeleteAuthor(item)}
            onEdit={() => onEditAuthor(item)}
            // onToggleFavorite={onToggleFavoriteAuthor}
          />
        );
      case "category":
        return (
          <CategoryCard
            item={item}
            onDelete={() => onDeleteCategory(item)}
            onEdit={() => onEditCategory(item)}
          />
        );
      default:
        return (
          <div className="glass h-48 rounded-xl flex items-center justify-center text-xs">
            {item.name || item.title}
          </div>
        );
    }
  };

  return (
    <section className="px-4 md:px-8 w-full overflow-hidden ">
      <div className="flex items-center justify-between  mb-6">
        <SectionHeading title={title} />

        <button
          onClick={onAdd}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white text-sm font-semibold"
        >
          <Plus size={16} />
          Add{" "}
          <span className="capitalize">
            {tag == "favourite" ? "Book" : tag}
          </span>
        </button>
      </div>
      <Swiper
        spaceBetween={16}
        freeMode={true}
        modules={[FreeMode, Navigation]}
        breakpoints={{
          0: {
            slidesPerView: 1.2,
          },
          640: {
            slidesPerView: 2.2,
          },
          1024: {
            slidesPerView: 4.2,
          },
        }}
        className="mySwiper !overflow-visible"
      >
        {isLoading ? (
          Array(6)
            .fill(0)
            .map((_, i) => (
              <SwiperSlide key={i}>
                <SkeletonCard type={type} />
              </SwiperSlide>
            ))
        ) : list.length === 0 ? (
          <EmptyState />
        ) : (
          list.map((item) => (
            <SwiperSlide key={item._id}>{renderCard(item)}</SwiperSlide>
          ))
        )}
      </Swiper>
    </section>
  );
};

export const SkeletonCard = ({ type }) => (
  <div className="animate-pulse w-full">
    <div
      className={`bg-muted/10 border border-card-border mb-4 ${
        type === "author"
          ? "aspect-square rounded-full"
          : "aspect-[3/4] rounded-2xl"
      }`}
    ></div>
    <div className="h-3 bg-muted/10 rounded w-3/4 mx-auto mb-2"></div>
    <div className="h-2 bg-muted/10 rounded w-1/2 mx-auto"></div>
  </div>
);

export const SectionHeading = ({ title }) => {
  return (
    <div className="relative mb-4 ml-1 pl-4 flex items-center">
      {/* Gradient Border Bar */}
      <div
        className="absolute left-0 top-0 bottom-1 w-1.5 rounded-full"
        style={{
          background:
            "linear-gradient(to bottom, var(--primary), var(--secondary))",
        }}
      />

      <h3 className="text-base md:text-xl font-bold text-foreground">
        {title}
      </h3>
    </div>
  );
};

export default SectionSlider;
