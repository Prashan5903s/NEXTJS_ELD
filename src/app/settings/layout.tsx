'use-client'
import React from "react";
import Header from "@/Components/Header";
import RightSidebar from "@/Components/RightSidebar";
import Sidebar from "@/Components/SideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className='main' style={{ height: '100vh', width: '100%' }}>
        <Header />
        <div className='dashboard'>
          <Sidebar />
          <main className="mainContainer">{children}</main>
          <RightSidebar />
        </div>
      </div>
    </>
  );
}
