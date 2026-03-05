"use client";

import React, { useState } from "react";
// import Sidebar from "@/components/layout/Sidebar";
// import MobileNav from "@/components/layout/MobileNav";
import AuthModal from "../Auth/AuthModal";
import Sidebar from "../Header/Sidebar";
import MobileNav from "../Header/MobileNav";
import { useAuth } from "@/utils/redux/AuthContext";

const HomeWrapper = ({ children }) => {
  const { isAuthOpen, openAuthModal, closeAuthModal } = useAuth();

  console.log("isAuthOpen", isAuthOpen);

  return (
    <div className="flex h-screen bg-background w-screen overflow-hidden ">
      {/* 1. Navigation with Auth Trigger */}
      <Sidebar openAuthModal={openAuthModal} />

      <div className="flex-1 flex flex-col min-w-0 max-w-full overflow-x-hidden ">
        <main className=" container mx-auto flex-1  pb-10 pt-0  md:py-5 md:pb-10  transition-all duration-300">
          {children}
        </main>

        <MobileNav openAuthModal={openAuthModal} />
      </div>

      {/* 3. Global Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={closeAuthModal} />
    </div>
  );
};

export default HomeWrapper;
