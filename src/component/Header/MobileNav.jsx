"use client";

import React from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Book, User, Library, BookUser, Heart } from "lucide-react";

const MobileNav = ({ openAuthModal }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Favourites", icon: Heart, path: "/favourites" },
    { name: "Books", icon: Book, path: "/books" },
    { name: "Categories", icon: Library, path: "/categories" },
    { name: "Authors", icon: BookUser, path: "/authors" },
  ];

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 1) || "Y"
    );
  };

  // 🔥 Triggered on Profile Section Click
  const handleProfileClick = () => {
    if (!isAuthenticated || !user) {
      openAuthModal(); // Open Login Modal if guest
    } else {
      router.push("/profile"); // Navigate to Profile if logged in
    }
  };

  return (
    /* Added bottom-4 for margin, rounded-2xl for a floating look, and the glass class */
    <nav className="fixed bottom-2 left-8 right-8 h-12 glass rounded-full flex items-center justify-around px-2 z-[60] md:hidden shadow-2xl border-white/10">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;

        return (
          <Link
            href={item.path}
            key={item.name}
            className={`flex flex-col items-center justify-center transition-all duration-300 relative ${
              isActive
                ? "text-primary scale-110"
                : "text-muted hover:text-foreground"
            }`}
          >
            {/* Active Glow Indicator */}
            {isActive && (
              <span className="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_var(--primary)]" />
            )}

            <div
              className={`p-1 ${isActive ? "drop-shadow-[0_0_5px_var(--primary)]" : ""}`}
            >
              <Icon
                size={isActive ? 20 : 18}
                strokeWidth={isActive ? 2.2 : 1.5}
              />
            </div>
            {/* <span
              className={`text-[10px] font-bold mt-0.5 tracking-wide ${isActive ? "opacity-100" : "opacity-70"}`}
            >
              {item.name}
            </span> */}
          </Link>
        );
      })}

      {/* Profile Section */}
      {/* Profile Section (Converted to div for conditional logic) */}
      <div
        onClick={handleProfileClick}
        className={`flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
          pathname === "/profile" ? "scale-110" : ""
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent p-[2px] shadow-lg ${
            pathname === "/profile"
              ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
              : ""
          }`}
        >
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
            {isAuthenticated && user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-foreground text-[10px] font-bold">
                {isAuthenticated ? getInitials(user?.name) : <User size={14} />}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;
