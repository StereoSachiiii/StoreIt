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
        
        await signUpWithPassword({
          email: values.email,
          password: values.password,
          fullName: values.username,
        })
        
        console.log("✅ [AuthForm] Sign-up successful!");
        setSuccessMessage("Account created successfully!")
        
        setTimeout(() => {
          router.push("/")
        }, 1000)
        
      } else if (type === "sign-in") {
        console.log("🔐 [AuthForm] Password sign-in...");
        
        await signInWithPassword({
          email: values.email,
          password: values.password,
        })
        
        console.log("✅ [AuthForm] Sign-in successful!");
        setSuccessMessage("Signed in successfully!")
        
        setTimeout(() => {
          router.push("/")
        }, 1000)
        
      } else if (type === "otp") {
        console.log("📧 [AuthForm] Sending OTP for passwordless sign-in...");
        
        const result = await sendSignInOTP(values.email)
        
        console.log("✅ [AuthForm] OTP sent:", result);
        
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
    <div className="w-full h-screen flex justify-center items-center max-w-md mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-amber-200 p-4 sm:p-10">
        <div className="text-center mb-3">
          
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
            {type === "sign-up" ? "Create Account" : type === "sign-in" ? "Welcome Back" : "Sign In with OTP"}
          </h2>
          <p className="text-slate-600">
            {type === "sign-up" 
              ? "Join StoreIT and start storing your files securely" 
              : type === "sign-in" 
              ? "Enter your credentials to access your account"
              : "We'll send you a one-time password to your email"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {type === "sign-up" && (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <Input 
                          placeholder="Your name" 
                          className="pl-10 h-10 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-slate-500">This is your public display name.</FormDescription>
                    <FormMessage className="text-red-600 text-sm" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <Input 
                        type="email" 
                        placeholder="you@example.com" 
                        className="pl-10 h-10 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500">
                    {type === "otp" ? "We'll send you a one-time password" : "We'll never share your email."}
                  </FormDescription>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )}
            />

            {(type === "sign-in" || type === "sign-up") && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <svg className="w-5 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10 h-10 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-slate-500">Use at least 6 characters.</FormDescription>
                    <FormMessage className="text-red-600 text-sm" />
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
                    <FormLabel className="text-slate-700 font-semibold">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10 h-10 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-slate-500">Re-enter your password to confirm.</FormDescription>
                    <FormMessage className="text-red-600 text-sm" />
                  </FormItem>
                )}
              />
            )}

            {error && (
              <div className="flex items-start gap-3 bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
            
            {successMessage && (
              <div className="flex items-start gap-3 bg-green-50 border-2 border-green-200 text-green-800 px-4 py-3 rounded-xl">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold">Success!</p>
                  <p className="text-sm">{successMessage}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Button 
                className="h-10 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  type === "sign-up" ? "Create Account" : 
                  type === "sign-in" ? "Sign In" : 
                  "Send OTP"
                )}
              </Button>

              {type !== "otp" && (
                <Link href="/otp-sign-in" className="w-full">
                  <Button type="button" className="h-10 w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
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
                className="w-full"
              >
                <Button type="button" className="h-12 w-full bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
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
      </div>
      
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