"use client"
import AuthForm from '@/components/AuthForm'
import React, { useEffect } from 'react'
import { useFormContext } from '../FormContext';



const Signin = () => {
  const {formType,setFormType} = useFormContext();
  useEffect(()=>{
    setFormType("otp");
  },[])
  return (
    <div >
      <AuthForm type={formType} />
    </div>
  )
}

export default Signin