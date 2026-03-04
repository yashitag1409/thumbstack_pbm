"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

import { Heart, Pencil, Trash2, Plus, Ghost } from "lucide-react";
import Image from "next/image";

// --- Sub-Components for Different Types ---

export const BookCard = ({ item, onEdit, onDelete, onToggleFavorite }) => {
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
    <div className="group cursor-pointer transition-transform duration-300 hover:-translate-y-2 overflow-hidden">
      <div className="relative flex flex-col overflow-hidden rounded-xl glass border border-card-border shadow-lg">
        {/* Book Cover */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white">
          <Image
            src={item.thumbNail || "/thumbnail.jpg"}
            alt={item.title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 300px"
          />

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item._id);
            }}
            className={`absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md border transition-all
            ${
              item.isFavorite
                ? "bg-red-500 border-red-500 text-white shadow-md"
                : "bg-black/40 border-white/30 text-white hover:bg-red-500 hover:border-red-500"
            }`}
          >
            <Heart
              size={16}
              className={item.isFavorite ? "fill-white stroke-white" : ""}
            />
          </button>
        </div>

        {/* Book Info */}
        <div className="p-3 space-y-2">
          {/* Title */}
          <h4 className="text-sm font-bold text-foreground line-clamp-1">
            {item.title}
          </h4>

          {/* Author */}
          <p className="text-xs text-muted line-clamp-1">{authorName}</p>

          {/* Category + Pages */}
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span className="truncate">{categoryName}</span>

            {item.numberOfPages && <span>{item.numberOfPages} pages</span>}
          </div>

          {/* Status Badge */}
          <div>
            <span
              className={`px-2 py-0.5 text-[10px] rounded-full border capitalize ${
                statusStyles[item.status] ||
                "bg-gray-500/20 text-gray-400 border-gray-500/30"
              }`}
            >
              {item.status?.replaceAll("_", " ") || "unknown"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            {/* Read Button */}
            <button className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-primary text-white hover:opacity-90 transition">
              <Plus size={14} />
              Read
            </button>

            <div className="flex gap-2">
              {/* Edit */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-full border border-card-border text-muted hover:text-primary hover:border-primary transition"
              >
                <Pencil size={14} />
              </button>

              {/* Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item._id);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-full border border-card-border text-muted hover:text-red-500 hover:border-red-500 transition"
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
export const AuthorCard = ({ item }) => (
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
    <p className="mt-3 font-bold text-sm text-foreground group-hover:text-primary transition-colors text-center line-clamp-1">
      {item.name}
    </p>
    <p className="text-[10px] text-muted line-clamp-1">Author</p>
  </div>
);

export const CategoryCard = ({ item }) => (
  <div className="group cursor-pointer transition-transform duration-300 hover:-translate-y-2">
    {" "}
    {/* Added lift here */}
    <div className="h-40 rounded-2xl glass border border-card-border p-5 flex flex-col justify-between transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/30 shadow-md">
      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-2">
        <span className="text-lg font-bold">{item.name?.charAt(0)}</span>
      </div>
      <div>
        <h4 className="font-bold text-sm text-foreground line-clamp-1">
          {item.name}
        </h4>
        <p className="text-[10px] text-muted line-clamp-2 mt-1">
          {item.description || "Browse collection"}
        </p>
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
      <button className="mt-4 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider px-4 py-2 rounded-full bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer">
        <Plus size={12} /> Add {type}
      </button>
    </div>
  );

  const renderCard = (item) => {
    switch (type) {
      case "book":
        return <BookCard item={item} />;
      case "author":
        return <AuthorCard item={item} />;
      case "category":
        return <CategoryCard item={item} />;
      default:
        return (
          <div className="glass h-48 rounded-xl flex items-center justify-center text-xs">
            {item.name || item.title}
          </div>
        );
    }
  };

  return (
    <section className="px-4 md:px-8 w-full overflow-hidden">
      <div className="relative mb-4 ml-1 pl-4 flex items-center">
        {/* The Gradient Border Bar */}
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
      <Swiper
        slidesPerView={1.5}
        spaceBetween={16}
        freeMode={true}
        modules={[FreeMode, Navigation]}
        breakpoints={{
          640: { slidesPerView: 2.5 },
          1024: { slidesPerView: 4.5 },
          1280: { slidesPerView: 5.5 },
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
