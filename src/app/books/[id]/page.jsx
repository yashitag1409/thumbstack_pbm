"use client";

import BookReader from "@/component/Books/BookReader";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const { id } = useParams();

  return <BookReader id={id} />;
};

export default page;
