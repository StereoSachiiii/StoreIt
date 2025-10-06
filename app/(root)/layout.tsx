"use client";
import React, { useState, useEffect } from "react";
import Welcome from "../../components/Welcome";
import Header from "../../components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider, useUser } from "@/app/context/userContext";

// Inner component that uses the context
function LayoutContent({ children }: { children: React.ReactNode }) {
  const userDetails = useUser();

  return (
    <div className="flex h-screen flex-col relative">
      <div className="w-full z-50">
        <Header />
      </div>

      <div className="flex flex-1 w-full h-full">
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

// Main layout that wraps with provider
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

  if (showWelcome) {
    return <Welcome />;
  }

  return (
    <UserProvider>
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  );
}