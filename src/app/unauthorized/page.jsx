"use client";

import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground px-6">
      <div className="glass-panel rounded-2xl border border-card-border bg-card p-10 text-center shadow-xl max-w-lg w-full">
        <h1 className="book-title text-4xl font-bold text-accent mb-4">
          Unauthorized Access
        </h1>

        <p className="text-muted mb-6">
          You do not have permission to access this page.
        </p>

        <button
          onClick={() => router.push("/")}
          className="
          cursor-pointer
          rounded-lg bg-secondary px-6 py-3 text-white font-medium transition hover:opacity-90"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
