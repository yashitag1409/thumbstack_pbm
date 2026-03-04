"use client";
import Books from "@/component/Books/Books";
import ProtectedPage from "@/component/ProtectedPage/protectPage";
import React from "react";
import { useSelector } from "react-redux";

const page = () => {
  return (
    <ProtectedPage>
      <Books />
    </ProtectedPage>
  );
};

export default page;
