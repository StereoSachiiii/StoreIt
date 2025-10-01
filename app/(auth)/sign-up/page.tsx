"use client"
import AuthForm, { formType } from '@/components/AuthForm'
import React, { useContext, useEffect } from 'react'
import { useFormContext } from '../FormContext'


const Signup = () => {
  const {formType,setFormType} = useFormContext();
  useEffect(()=>{
    setFormType("sign-up");
  },[])
  return (
    <div >
      <AuthForm type={formType} />
    </div>
  )
}

export default Signup