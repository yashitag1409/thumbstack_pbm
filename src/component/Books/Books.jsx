"use client";

import React from "react";
import { useSelector } from "react-redux";

const Books = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // fetch all books by this user

  const fetchAllBooks = async () => {};

  return <div>Books</div>;
};

export default Books;
