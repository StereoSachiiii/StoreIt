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
    // Validate account ID
    if (!accountId) {
      setError("Account ID is missing");
      return;
    }

    // Validate OTP length
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

      // Verify OTP for sign in (user already exists)
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
      <AlertDialogContent className="space-y-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Enter Your OTP</AlertDialogTitle>
          <AlertDialogDescription>
            We have sent a code to {email}.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm rounded-md border hover:bg-gray-100"
            disabled={isLoading}
          >
            Cancel
          </button>

          <AlertDialogAction
            onClick={handleSubmit}
            disabled={isLoading || password.length !== 6}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Verifying..." : "Submit"}
          </AlertDialogAction>
        </AlertDialogFooter>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Didn't get an OTP?{" "}
            <button
              type="button"
              onClick={handleResendOTP}
              className="text-blue-500 hover:underline font-medium"
              disabled={isLoading}
            >
              Click to resend
            </button>
          </p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};