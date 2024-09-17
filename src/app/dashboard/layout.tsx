'use client'
import React, { useState } from "react";
import Header from "@/Components/Header";
import RightSidebar from "@/Components/RightSidebar";
import Sidebar from "@/Components/SideBar";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isToggled, setIsToggled] = useState(true);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setIsToggled(!isToggled);
  };
  const handleMouseEnter = () => {
    if (!isToggled) {
      setIsCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    if (!isToggled) {
      setIsCollapsed(true);
    }
  };

  const setSidebarToggle = (state) => {
    setIsToggled(state);
  };

  return (
    <>
      <SessionProvider>
        <div className='main' style={{ height: '100vh', width: '100%' }}>
          <Header toggle={toggleSidebar} />
          <div className='dashboard'>
            <Sidebar isCollapsed={isCollapsed}
              mouseEnter={handleMouseEnter}
              mouseLeave={handleMouseLeave}
              setSidebarToggle={setSidebarToggle} />
            <main className='mainContainer'>{children}</main>
            <RightSidebar />
          </div>
        </div>
      </SessionProvider>
    </>
  );
}
