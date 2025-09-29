import AuthForm from '@/app/components/AuthForm'
import { sign } from 'crypto'
import React from 'react'


const Signup = () => {
  let formtype = 'sign-up'
  return (
    <div >
      <AuthForm type={formtype} />
    </div>
  )
}

export default Signup