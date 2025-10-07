"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifySignInOTP, resendOTP } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface OTPModalProps {
  email: string;
  accountId: string | null;
}

export const OTPModal = ({ email, accountId }: OTPModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!accountId) {
      setError("Account ID is missing");
      return;
    }

    if (password.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("🔐 [OTPModal] Verifying OTP...");
      console.log("📧 [OTPModal] Email:", email);
      console.log("🆔 [OTPModal] AccountId:", accountId);

      const session = await verifySignInOTP({
        accountId,
        otp: password,
      });

      console.log("✅ [OTPModal] Session created:", session);

      if (session?.sessionId) {
        console.log("✅ [OTPModal] Redirecting to home...");
        setIsOpen(false);
        router.push("/");
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error("❌ [OTPModal] OTP verification failed:", error);
      setError(error?.message || "Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!accountId) {
      setError("Cannot resend OTP: Account ID is missing");
      return;
    }

    try {
      setError("");
      console.log("🔄 [OTPModal] Resending OTP...");
      await resendOTP({ email, accountId });
      setPassword("");
      console.log("✅ [OTPModal] New OTP sent successfully");
    } catch (error: any) {
      console.error("❌ [OTPModal] Failed to resend OTP:", error);
      setError(error?.message || "Failed to resend OTP. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    router.push("/sign-in");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-md mx-auto p-6 sm:p-8">
        <AlertDialogHeader className="space-y-3 text-center sm:text-left">
          <div className="mx-auto sm:mx-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-slate-800">
            Enter Your OTP
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base text-slate-600">
            We've sent a 6-digit verification code to{" "}
            <span className="font-semibold text-slate-800">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center py-4">
          <InputOTP maxLength={6} value={password} onChange={setPassword}>
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot 
                  key={i} 
                  index={i}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-lg sm:text-xl font-semibold border-2 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Cancel
          </button>

          <AlertDialogAction
            onClick={handleSubmit}
            disabled={isLoading || password.length !== 6}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Submit"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>

        <div className="text-center pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOTP}
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Resend OTP
            </button>
          </p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};