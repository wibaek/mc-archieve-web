import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MC Archieve",
  description: "마인크래프트 스크린샷과 창작물을 업로드하고 공유하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="light"> */}
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
