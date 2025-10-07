"use client";
import { useEffect, useState } from "react";
import Welcome from "../components/Welcome";


export default function RootPage() {
  const [showWelcome, setShowWelcome] = useState(true);


  if (showWelcome) {
    return <Welcome />; 
  }

  return (
    <div className="flex-1 p-4">
      <h1 className="text-3xl font-bold">Welcome to the App!</h1>
      <p>This is your main content after the welcome screen.</p>
    </div>
  );
}
