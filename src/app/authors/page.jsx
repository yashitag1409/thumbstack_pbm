import Authors from "@/component/Authors/Authors";
import ProtectedPage from "@/component/ProtectedPage/protectPage";
import React from "react";

const page = () => {
  return (
    <ProtectedPage>
      <Authors />
    </ProtectedPage>
  );
};

export default page;
