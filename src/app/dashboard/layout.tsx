<<<<<<< HEAD
'use client'
=======
'use-client'
>>>>>>> origin/main
import React, { useEffect, useState } from "react";
import Header from "@/Components/Header";
import RightSidebar from "@/Components/RightSidebar";
import Sidebar from "@/Components/SideBar";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
<<<<<<< HEAD
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
    <div className='main' style={{height:'100vh',width:'100%'}}>
      <Header toggle={toggleSidebar} />
     <div className='dashboard'>
      <Sidebar  isCollapsed={isCollapsed}
            mouseEnter={handleMouseEnter}
            mouseLeave={handleMouseLeave}
            setSidebarToggle={setSidebarToggle}/>
=======
  return (
   <>
    <div className='main' style={{height:'100vh',width:'100%'}}>
      <Header />
     <div className='dashboard'>
      <Sidebar />
>>>>>>> origin/main
      <main className='mainContainer'>{children}</main>
      <RightSidebar />
     </div>
    </div>
    </>
  );
}
