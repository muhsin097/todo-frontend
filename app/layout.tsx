"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("auth");
      if (auth !== "yes") {
        router.push("/login");
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", "");
      localStorage.setItem("username", "");
      localStorage.setItem("_id", "");
      localStorage.setItem("auth", "");
      router.push("/login");
    }
  };
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <div className="flex h-screen">
          <div className="w-1/5 bg-gray-800 p-4 text-white">
            <h1 className="text-3xl font-bold mb-6">TO DO LIST</h1>
            <nav>
              <ul>
                <li className="mb-4">
                  <Link href="/">
                    <p className="text-blue-500">Today&apos;s Tasks</p>
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/upcoming">
                    <p className="text-blue-500">Upcoming Tasks</p>
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/filters-&-labels">
                    <p className="text-blue-500">Filters & Labels</p>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-blue-500 cursor-pointer"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex-1 p-4">{children}</div>
        </div>
      </body>
    </html>
  );
}
