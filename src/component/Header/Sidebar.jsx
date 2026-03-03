"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Home,
  Heart,
  Book,
  LayoutGrid,
  Users,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import { logout } from "@/utils/redux/slices/authSlice";

const Sidebar = ({ openAuthModal }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    { name: "Home", icon: <Home size={24} />, path: "/" },
    { name: "Search", icon: <Search size={24} />, path: "/search" },
    { name: "Favorites", icon: <Heart size={24} />, path: "/favorites" },
    { name: "All Books", icon: <Book size={24} />, path: "/books" },
    { name: "Categories", icon: <LayoutGrid size={24} />, path: "/categories" },
    { name: "Authors", icon: <Users size={24} />, path: "/authors" },
  ];

  return (
    <aside
      className="hidden group fixed left-0 top-0 h-screen w-20 hover:w-64 bg-[#0F1014] text-gray-400 transition-all duration-300 ease-in-out z-50 md:flex flex-col items-start overflow-hidden border-r border-gray-800 
      hover:border-transparent relative"
    >
      {/* DYNAMNIC GRADIENT BORDER: 
          This absolute div acts as the glowing border on hover.
      */}
      <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-[#a78bfa] via-[#3b82f6] to-[#f472b6] opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_15px_rgba(167,139,250,0.5)]" />

      {/* 1. AksharVault Logo */}
      <div className="p-6 mb-8 ml-2 flex items-center justify-start w-full">
        <div className="min-w-[32px] flex justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 text-[#a78bfa] fill-current animate-pulse drop-shadow-[0_0_8px_#a78bfa]"
          >
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>
        <span className="ml-6 text-xl font-bold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
          AksharVault
        </span>
      </div>

      {/* 2. Navigation Menu */}
      <nav className="flex-1 w-full px-4">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <Link href={item.path} key={item.name}>
              <li className="flex items-center p-3 mb-2 rounded-xl hover:bg-white/10 hover:text-[#a78bfa] cursor-pointer transition-all duration-200 group/item">
                <div className="min-w-[40px] flex justify-center group-hover/item:scale-110 transition-transform group-hover/item:drop-shadow-[0_0_5px_#3b82f6]">
                  {item.icon}
                </div>
                <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                  {item.name}
                </span>
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      {/* 3. Improved User Profile (My Space) */}
      <div className="p-4 w-full border-t border-gray-800 bg-[#0F1014] group-hover:border-t-[#3b82f6]/30 transition-colors duration-500">
        <div className="flex items-center cursor-pointer group/user">
          <div className="relative shrink-0">
            <div
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal();
                }
              }}
              className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#a78bfa] via-[#3b82f6] to-[#f472b6] flex items-center justify-center text-white border-2 border-transparent group-hover/user:border-white transition-all duration-300 overflow-hidden shadow-lg"
            >
              {isAuthenticated && user ? (
                user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold tracking-wider">
                    {getInitials(user.name)}
                  </span>
                )
              ) : (
                <User size={22} className="text-white/80" />
              )}
            </div>

            {/* Online Dot */}
            {isAuthenticated && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0F1014] rounded-full"></div>
            )}
          </div>

          {/* Text Section */}
          <div className="ml-4 flex flex-col opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap overflow-hidden">
            <p className="text-sm font-bold text-white tracking-tight">
              {isAuthenticated ? user?.name : "Guest User"}
            </p>

            {/* ACTION BUTTON */}
            {!isAuthenticated ? (
              <div
                onClick={openAuthModal}
                className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-widest group-hover:text-accent transition-colors cursor-pointer"
              >
                Sign In
              </div>
            ) : (
              <div
                onClick={() => dispatch(logout())}
                className="text-[11px] font-medium text-red-400 uppercase tracking-widest hover:text-red-500 transition-colors cursor-pointer"
              >
                Logout
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
