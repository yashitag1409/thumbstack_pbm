"use client";

import MainPage from "@/component/Home/MainPage";
import Image from "next/image";

export default function Home({ openAuthModal }) {
  return <MainPage openAuthModal={openAuthModal} />;
}
