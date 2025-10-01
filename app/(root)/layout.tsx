"use client";
import React, { useEffect, useState } from "react";
import Welcome from "../../components/Welcome";
import Header from "../../components/Header";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex  h-screen flex-col  relative ">
       <div className="w-full z-50  ">
    <Header />
    </div>
    <div className="  flex flex-1 w-full h-full">
      <Sidebar />
      {children}
    </div>
    
    </div>
    
   
  );
}
