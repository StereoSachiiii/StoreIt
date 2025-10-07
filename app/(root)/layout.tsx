"use client";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider, useUser } from "@/app/context/userContext";


function LayoutContent({ children }: { children: React.ReactNode }) {
  const userDetails = useUser();

  return (
    <div className="flex h-screen flex-col relative">
      <div className="w-full z-50">
        <Header />
      </div>

      <div className="flex flex-1 w-full ">
        <Sidebar
          username={userDetails.username}
          email={userDetails.email}
        />
        {children}
      </div>

      <Toaster />
    </div>
  );
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return (
    <UserProvider>
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  );
}