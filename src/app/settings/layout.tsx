'use-client'
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
  return (
   <>
    <div className='main' style={{height:'100vh',width:'100%'}}>
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
