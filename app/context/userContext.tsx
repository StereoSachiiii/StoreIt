"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserDetails } from "@/lib/actions/user.actions";
//interface for user details
interface UserDetails {
  username: string;
  email: string;
  accountId: string;
  ownerId: string;
}
//for the whole app . userdetails
export const UserContext = createContext<UserDetails | null>(null);


//custom hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};


//provider
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    getUserDetails()
      .then((res) => {
        setUserDetails({
          username: res?.name,
          email: res?.email,
          accountId: res?.accountId,
          ownerId: res?.$id,
        });
      })
      .catch((err) => console.error("error fetching user details", err));
  }, []);
  if (!userDetails) {
    return <div>Loading...</div>; 
  }

  return (
    <UserContext.Provider value={userDetails}>
      {children}
    </UserContext.Provider>
  );
};