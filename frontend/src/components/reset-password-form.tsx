"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import { resetPasswordAction } from "@/lib/actions/auth";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ZodErrors } from "@/components/zod-errors";
import { StrapiErrors } from "@/components/strapi-errors";
import { SubmitButton } from "@/components/submit-button";

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  data: null,
  message: null,
  success: false,
};

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";

  const [formState, formAction] = useFormState(
    resetPasswordAction,
    INITIAL_STATE
  );

  if (!code) {
    return (
      <div className="w-full max-w-md">
        <Card className="border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Invalid Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col">
            <Link href="forgot-password" className="underline">
              Request a new reset link
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form action={formAction}>
        <Card className="border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formState?.success ? (
              <div className="text-green-600 text-center py-4">
                {formState.message}
                <div className="mt-4">
                  <Link href="signin" className="underline">
                    Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <input type="hidden" name="code" value={code} />

                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                  />
                  <ZodErrors error={formState?.zodErrors?.password} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                  <Input
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    type="password"
                    placeholder="Confirm new password"
                  />
                  <ZodErrors error={formState?.zodErrors?.passwordConfirmation} />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            {!formState?.success && (
              <SubmitButton
                className="w-full"
                text="Reset Password"
                loadingText="Resetting..."
              />
            )}
            <StrapiErrors error={formState?.strapiErrors} />
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Remember your password?
          <Link className="underline ml-2" href="signin">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
