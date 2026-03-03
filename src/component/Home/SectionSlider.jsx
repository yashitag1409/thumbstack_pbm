"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

const SectionSlider = ({ title, type, isLoading, data = [] }) => {
  return (
    <section className="px-4 md:px-8">
      <h3 className="text-xl font-bold text-foreground mb-4 ml-1 border-l-4 border-primary pl-3">
        {title}
      </h3>

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
        className="mySwiper overflow-visible"
      >
        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <SwiperSlide key={i}>
                  <SkeletonCard type={type} />
                </SwiperSlide>
              ))
          : data.map((item) => (
              <SwiperSlide key={item._id}>
                {/* Render your specific card components here */}
                <div className="glass h-48 rounded-xl flex items-center justify-center">
                  {item.name || item.title}
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
    </section>
  );
};

const SkeletonCard = ({ type }) => (
  <div className="bg-card/50 border border-card-border rounded-2xl p-4 animate-pulse">
    <div
      className={`bg-muted/20 w-full rounded-xl mb-4 ${type === "author" ? "aspect-square rounded-full" : "aspect-[3/4]"}`}
    ></div>
    <div className="h-4 bg-muted/20 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-muted/20 rounded w-1/2"></div>
  </div>
);

export default SectionSlider;
