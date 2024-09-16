'use client'
import React from "react";
import Header from "@/Components/Header";
import { ToastContainer } from "react-toastify";
import RightSidebar from "@/Components/RightSidebar";
import Sidebar from "@/Components/SideBar";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ToastContainer />
      <SessionProvider>
        <div className='main' style={{ height: '100vh', width: '100%' }}>
          <Header />
          <div className='dashboard'>
            <Sidebar />
            <main className="mainContainer">{children}</main>
            <RightSidebar />
          </div>
        </div>
      </SessionProvider>
    </>
  );
}
