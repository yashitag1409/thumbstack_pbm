"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, BookOpen, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSingleBook, updateBook } from "@/utils/apis/booksApi";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import CustomDropdown from "../CustomElementsTag/CustomDropdown";

const BookReader = ({ id }) => {
  const router = useRouter();

  const [book, setBook] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [status, setStatus] = useState("loading");
  const [bookStatus, setBookStatus] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  // loading | success | empty | error

  const fetchBook = async () => {
    try {
      setStatus("loading");

      const data = await getSingleBook(id);

      if (!data) {
        setStatus("empty");
        return;
      }

      setBook(data);
      setBookStatus(data?.status);
      if (!data.pages || data.pages.length === 0) {
        setStatus("empty");
      } else {
        setStatus("success");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      setStatusLoading(true);

      await updateBook(id, {
        status: newStatus,
      });

      setBookStatus(newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const pages = book?.pages || [];

  const nextPage = () => {
    if (pageIndex < pages.length - 1) {
      setPageIndex((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
    }
  };

  // keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [pageIndex]);

  const progress = pages.length ? ((pageIndex + 1) / pages.length) * 100 : 0;

  const statusOptions = [
    { label: "Want to Read", value: "want_to_read" },
    { label: "Reading", value: "reading" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* HEADER */}
      <div className="border-b border-card-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="cursor-pointer flex items-center gap-1 text-sm text-muted hover:text-foreground transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* Breadcrumb */}
          <div className="text-xs text-muted">
            Books /{" "}
            <span className="text-foreground">{book?.title || "Reader"}</span>
          </div>
        </div>
      </div>

      {status === "success" && (
        <div className="flex items-center gap-4 mt-2 ml-2">
          <div className="w-44">
            <CustomDropdown
              options={statusOptions}
              value={bookStatus}
              labelKey="label"
              valueKey="value"
              placeholder="Select Status"
              disabled={statusLoading}
              onChange={(val) => updateStatus(val)}
            />
          </div>

          <div className="text-xs text-muted whitespace-nowrap">
            Page {pageIndex + 1} / {pages.length}
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center px-6 py-5">
        {/* LOADING */}
        {status === "loading" && (
          <div className="max-w-xl w-full animate-pulse space-y-4">
            <div className="h-[500px] bg-card border border-card-border rounded-xl" />
            <div className="h-4 bg-card-border rounded w-1/3 mx-auto" />
          </div>
        )}

        {/* EMPTY */}
        {status === "empty" && (
          <div className="text-center bg-card border border-card-border rounded-xl p-10 max-w-md">
            <BookOpen className="mx-auto text-muted mb-4" size={40} />

            <h2 className="text-lg font-semibold mb-2">No Pages Available</h2>

            <p className="text-sm text-muted">
              This book does not contain readable pages yet.
            </p>

            <button
              onClick={() => router.back()}
              className="cursor-pointer mt-4 px-4 py-2 rounded-lg bg-primary text-white text-sm hover:opacity-90"
            >
              Go Back
            </button>
          </div>
        )}

        {/* ERROR */}
        {status === "error" && (
          <div className="text-center bg-card border border-red-500/30 rounded-xl p-10 max-w-md">
            <h2 className="text-lg font-semibold text-red-400 mb-2">
              Failed to Load Book
            </h2>

            <p className="text-sm text-muted">
              Something went wrong while loading this book.
            </p>

            <button
              onClick={fetchBook}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-white text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* READER */}
        {status === "success" && (
          <div className="relative w-full flex flex-col md:flex-row items-center justify-center">
            {/* PREV */}
            <button
              onClick={prevPage}
              disabled={pageIndex === 0}
              className="
    hidden md:flex
    absolute left-4
    items-center justify-center
    bg-card border border-card-border
    p-3 rounded-full shadow
    hover:bg-primary hover:text-white
    transition
    disabled:opacity-30 disabled:cursor-not-allowed
    cursor-pointer
  "
            >
              <ChevronLeft size={22} />
            </button>

            {/* MOBILE NAVIGATION */}

            {/* PAGE VIEWER */}
            <div className="max-w-3xl w-full flex justify-center">
              <div className="max-h-[75vh] w-full flex items-center justify-center bg-card border border-card-border rounded-xl shadow-lg p-2 ">
                {pages[pageIndex]?.page_url?.endsWith(".pdf") ? (
                  <iframe
                    src={pages[pageIndex]?.page_url}
                    className="w-full h-[70vh] rounded-lg"
                  />
                ) : (
                  <TransformWrapper
                    initialScale={1}
                    minScale={1}
                    maxScale={5}
                    wheel={{ step: 0.2 }}
                    doubleClick={{ mode: "zoomIn" }}
                    centerOnInit
                  >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                      <>
                        {/* Zoom Controls */}
                        <div className="absolute top-4 right-4 z-10 flex gap-2 bg-black/40 backdrop-blur rounded-lg p-1">
                          <button
                            onClick={zoomIn}
                            className="cursor-pointer px-2 py-1 text-white text-xs hover:bg-white/20 rounded"
                          >
                            +
                          </button>

                          <button
                            onClick={zoomOut}
                            className="cursor-pointer px-2 py-1 text-white text-xs hover:bg-white/20 rounded"
                          >
                            -
                          </button>

                          <button
                            onClick={resetTransform}
                            className=" cursor-pointer px-2 py-1 text-white text-xs hover:bg-white/20 rounded"
                          >
                            reset
                          </button>
                        </div>

                        <TransformComponent wrapperClass="flex items-center justify-center w-full">
                          <img
                            src={pages[pageIndex]?.page_url}
                            alt={`Page ${pageIndex + 1}`}
                            className="max-h-[75vh] max-w-full object-contain cursor-grab"
                          />
                        </TransformComponent>
                      </>
                    )}
                  </TransformWrapper>
                )}
              </div>
            </div>
            <div className="flex md:hidden items-center justify-between w-full max-w-sm mx-auto mb-4 bg-card border border-card-border rounded-xl shadow-lg px-4 py-2">
              <button
                onClick={prevPage}
                disabled={pageIndex === 0}
                className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg hover:bg-primary/20 disabled:opacity-30"
              >
                <ChevronLeft size={20} />
                Prev
              </button>

              <span className="text-xs text-muted font-medium">
                {pageIndex + 1} / {pages.length}
              </span>

              <button
                onClick={nextPage}
                disabled={pageIndex === pages.length - 1}
                className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg hover:bg-primary/20 disabled:opacity-30"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
            {/* NEXT */}
            <button
              onClick={nextPage}
              disabled={pageIndex === pages.length - 1}
              className="
    hidden md:flex
    absolute right-4
    items-center justify-center
    bg-card border border-card-border
    p-3 rounded-full shadow
    hover:bg-primary hover:text-white
    transition
    disabled:opacity-30 disabled:cursor-not-allowed
    cursor-pointer
  "
            >
              <ChevronRight size={22} />
            </button>
          </div>
        )}
      </div>

      {/* FOOTER */}
      {status === "success" && (
        <div className="hidden md:block text-center pb-6 text-sm text-muted">
          {pageIndex + 1} of {pages.length}
        </div>
      )}
    </div>
  );
};

export default BookReader;
