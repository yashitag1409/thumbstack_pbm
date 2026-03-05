"use client";

import BookReader from "@/component/Books/BookReader";
import ProtectedPage from "@/component/ProtectedPage/protectPage";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const { id } = useParams();

  return (
    <ProtectedPage>
      <BookReader id={id} />{" "}
    </ProtectedPage>
  );
};

export default page;
