"use client";

import React from "react";
import { useSelector } from "react-redux";

const Authors = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return <div>Authors</div>;
};

export default Authors;
