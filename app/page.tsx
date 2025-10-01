"use client";
import { useEffect, useState } from "react";
import Welcome from "../components/Welcome";


export default function RootPage() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (showWelcome) {
    return <Welcome />; // Fullscreen splash
  }

  return (
    <div className="flex-1 p-4">
      {/* Your main homepage content goes here */}
      <h1 className="text-3xl font-bold">Welcome to the App!</h1>
      <p>This is your main content after the welcome screen.</p>
    </div>
  );
}
