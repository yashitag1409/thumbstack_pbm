import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/utils/redux/Providers";
import HomeWrapper from "@/component/Home/HomeWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AksharVault: The Personal Book Manager",
  description: "Assignment Project by Yashit Agrawal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0F1014] text-white`}
      >
        <Providers>
          <HomeWrapper>{children}</HomeWrapper>
        </Providers>
      </body>
    </html>
  );
}
