"use client"
import React from "react"

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
    path: ["confirmPassword"], // attach error to confirmPassword
  })

type formType = "sign-in" | "sign-up"

const AuthForm = ({ type }: { type: formType }) => {
  const schema = type === "sign-up" ? signUpSchema : signInSchema

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues:
      type === "sign-up"
        ? { username: "", email: "", password: "", confirmPassword: "" }
        : { email: "", password: "" },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    console.log("Form submitted:", values)
  }

  return (
    <div className="w-full h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* username only for sign-up */}
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
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          {/* email */}
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
                  We’ll never share your email.
                </FormDescription>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormDescription>
                  Use at least 6 characters.
                </FormDescription>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          {/* confirm password (sign-up only) */}
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
                  <FormDescription>
                    Re-enter your password to confirm.
                  </FormDescription>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          <Button type="submit">
            {type === "sign-up" ? "Sign Up" : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default AuthForm
