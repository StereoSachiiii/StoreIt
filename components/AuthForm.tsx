"use client"
import React, { useEffect, useState } from "react"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signUpWithPassword, signInWithPassword, sendSignInOTP } from "@/lib/actions/user.actions"
import { OTPModal } from "./OTPModal"
import { useRouter } from "next/navigation"

// schemas
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const signUpSchema = z
  .object({
    username: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// OTP schema only needs email (user already exists)
const otpSchema = z.object({
  email: z.string().email(),
})

export type formType = "sign-in" | "sign-up" | "otp"

const AuthForm = ({ type }: { type: formType }) => {
  const router = useRouter()
  const schema =
    type === "sign-up" ? signUpSchema : type === "sign-in" ? signInSchema : otpSchema

  const [isLoading, setIsLoading] = useState(false)
  const [error, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isOTPModalActive, setIsOTPModalActive] = useState(false)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState("")

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues:
      type === "sign-up"
        ? { username: "", email: "", password: "", confirmPassword: "" }
        : type === "sign-in"
        ? { email: "", password: "" }
        : { email: "" },
  })

  async function onSubmit(values: any) {
    console.log("\n🚀 [AuthForm] Form submitted with type:", type);
    console.log("📝 [AuthForm] Form values:", values);
    
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      if (type === "sign-up") {
        console.log("📧 [AuthForm] Password sign-up...");
        
        // Sign up with password
        await signUpWithPassword({
          email: values.email,
          password: values.password,
          fullName: values.username,
        })
        
        console.log("✅ [AuthForm] Sign-up successful!");
        setSuccessMessage("Account created successfully!")
        
        // Redirect to home after successful sign up
        setTimeout(() => {
          router.push("/")
        }, 1000)
        
      } else if (type === "sign-in") {
        console.log("🔐 [AuthForm] Password sign-in...");
        
        // Sign in with password
        await signInWithPassword({
          email: values.email,
          password: values.password,
        })
        
        console.log("✅ [AuthForm] Sign-in successful!");
        setSuccessMessage("Signed in successfully!")
        
        // Redirect to home after successful sign in
        setTimeout(() => {
          router.push("/")
        }, 1000)
        
      } else if (type === "otp") {
        console.log("📧 [AuthForm] Sending OTP for passwordless sign-in...");
        
        // Send OTP for existing user
        const result = await sendSignInOTP(values.email)
        
        console.log("✅ [AuthForm] OTP sent:", result);
        
        // Store data for OTP verification
        setAccountId(result.accountId)
        setUserEmail(result.email)
        setIsOTPModalActive(true)
        setSuccessMessage("Check your email for a 6-digit OTP code!")
      }
    } catch (error: any) {
      console.error("💥 [AuthForm] Error during submission:", error);
      console.error("💥 [AuthForm] Error message:", error?.message);
      setErrorMessage(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      console.log("🏁 [AuthForm] Form submission completed");
    }
  }

  useEffect(() => {
    console.log("🔄 [AuthForm] Form type changed to:", type)
  }, [type])

  return (
    <div className="w-full h-full justify-center items-center text-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* username for sign-up */}
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="your name" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          {/* email (always present) */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  {type === "otp" 
                    ? "We'll send you a one-time password" 
                    : "We'll never share your email."}
                </FormDescription>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          {/* password fields only for sign-in and sign-up */}
          {(type === "sign-in" || type === "sign-up") && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormDescription>Use at least 6 characters.</FormDescription>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormDescription>Re-enter your password to confirm.</FormDescription>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              <p className="font-medium">Success!</p>
              <p className="text-sm">{successMessage}</p>
            </div>
          )}

          {/* buttons */}
          <div className="flex flex-col gap-2">
            <Button 
              className="bg-amber-500 w-full rounded-2xl" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : (
                type === "sign-up" ? "Sign Up" : 
                type === "sign-in" ? "Sign In" : 
                "Send OTP"
              )}
            </Button>

            {type !== "otp" && (
              <Link href="/otp-sign-in">
                <Button type="button" className="bg-purple-600 w-full rounded-2xl">
                  Sign In with OTP
                </Button>
              </Link>
            )}

            <Link
              href={
                type === "sign-up"
                  ? "/sign-in"
                  : type === "sign-in"
                  ? "/sign-up"
                  : "/sign-in"
              }
            >
              <Button type="button" className="bg-black w-full rounded-2xl">
                {type === "sign-up"
                  ? "Already have an account?"
                  : type === "sign-in"
                  ? "Don't have an account?"
                  : "Back to Sign In"}
              </Button>
            </Link>
          </div>
        </form>
      </Form>
      
      {/* OTP Modal - only for OTP sign-in flow */}
      {isOTPModalActive && accountId && type === "otp" && (
        <OTPModal 
          email={userEmail}
          accountId={accountId}
        />
      )}
    </div>
  )
}

export default AuthForm