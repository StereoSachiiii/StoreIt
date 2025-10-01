"use client";
import React, { useEffect, useState } from "react";
import Welcome from "../../components/Welcome";
import Header from "../../components/Header";
import Sidebar from "@/components/Sidebar";
import { getUserDetails } from "@/lib/actions/user.actions";


interface userDetailsInterface {
  username :string ,
  email :string
}


export default  function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [userDetails,setUserDetails] = useState<userDetailsInterface>()
  useEffect( () => {
    
    getUserDetails().then((res)=>(setUserDetails({
      username : res?.name,
      email : res?.email
    }))).catch((err)=>(console.log(err,"error fetching user details")))
    

    const timer = setTimeout(() => setShowWelcome(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex  h-screen flex-col  relative ">
       <div className="w-full z-50  ">
    <Header />
    </div>
    <div className="  flex flex-1 w-full h-full">
      <Sidebar username={userDetails?.username} email={userDetails?.email}/>
      {children}
    </div>
    
    </div>
    
   
  );
}
const fetchUser = async () =>{

