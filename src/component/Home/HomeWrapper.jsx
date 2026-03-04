"use client";

import React, { useState } from "react";
// import Sidebar from "@/components/layout/Sidebar";
// import MobileNav from "@/components/layout/MobileNav";
import AuthModal from "../Auth/AuthModal";
import Sidebar from "../Header/Sidebar";
import MobileNav from "../Header/MobileNav";

const HomeWrapper = ({ children }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuth = () => setIsAuthOpen(true);
  const closeAuth = () => setIsAuthOpen(false);

  // We use React.cloneElement to inject the prop into the children (MainPage)
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { openAuthModal: openAuth });
    }
    return child;
  });

  console.log("isAuthOpen", isAuthOpen);

  return (
    <div className="flex h-screen bg-background w-screen overflow-hidden ">
      {/* 1. Navigation with Auth Trigger */}
      <Sidebar openAuthModal={() => setIsAuthOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 max-w-full overflow-x-hidden ">
        <main className=" container mx-auto flex-1  pb-10 pt-0  md:py-2  transition-all duration-300">
          {childrenWithProps}
        </main>

        <MobileNav openAuthModal={() => setIsAuthOpen(true)} />
      </div>

      {/* 3. Global Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default HomeWrapper;
