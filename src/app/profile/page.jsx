import Profile from "@/component/Profile/Profile";
import ProtectedPage from "@/component/ProtectedPage/protectPage";
import React from "react";

const page = () => {
  return (
    <ProtectedPage>
      <Profile />
    </ProtectedPage>
  );
};

export default page;
