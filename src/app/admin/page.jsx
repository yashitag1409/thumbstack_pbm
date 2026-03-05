import Admin from "@/component/Admin/Admin";
import ProtectedPage from "@/component/ProtectedPage/protectPage";
import React from "react";

const page = () => {
  return (
    <ProtectedPage allowedRoles={["admin"]}>
      <Admin />
    </ProtectedPage>
  );
};

export default page;
