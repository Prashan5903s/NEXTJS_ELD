'use client'
import { Inter } from "next/font/google";
import Header from "./Header";
import Sidebar from "./SideBar";
import { SessionProvider } from "next-auth/react";
import RightSidebar from "./RightSidebar";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

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
            <main className='mainContainer'>{children}</main>
            <RightSidebar />
          </div>
        </div>
      </SessionProvider>
    </>
  );
}
