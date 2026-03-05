"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * @param {Array} allowedRoles - Array of strings e.g., ["admin", "user"]
 */
const ProtectedPage = ({ children, allowedRoles = ["user", "admin"] }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // 1. Check for Authentication
      if (!isAuthenticated || !user) {
        router.push("/unauthorized");
        return;
      }

      // 2. Check for Role Permission (if roles are specified)
      if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        toast.error(
          "Access Denied: You do not have permission for this vault section.",
        );
        router.push("/"); // Redirect to home or a specific 403 page
      }
    }
  }, [user, isAuthenticated, loading, router, allowedRoles]);

  // --- Loading State: Themed Skeleton ---
  if (
    loading ||
    !isAuthenticated ||
    !user ||
    (allowedRoles.length > 0 && !allowedRoles.includes(user?.role))
  ) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-card-border rounded-lg"></div>
          <div className="h-4 w-40 bg-card-border/50 rounded-lg"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="glass h-64 rounded-2xl border border-card-border flex flex-col p-4 space-y-4"
            >
              <div className="flex-1 bg-card-border/30 rounded-xl"></div>
              <div className="h-4 w-3/4 bg-card-border/50 rounded"></div>
              <div className="h-3 w-1/2 bg-card-border/30 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedPage;
