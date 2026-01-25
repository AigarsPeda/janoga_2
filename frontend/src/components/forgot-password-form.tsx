"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { forgotPasswordAction } from "@/lib/actions/auth";

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

export function ForgotPasswordForm() {
  const [formState, formAction] = useFormState(
    forgotPasswordAction,
    INITIAL_STATE
  );

  return (
    <div className="w-full max-w-md">
      <form action={formAction}>
        <Card className="border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we&apos;ll send you a link to reset
              your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formState?.success ? (
              <div className="text-green-600 text-center py-4">
                {formState.message}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                />
                <ZodErrors error={formState?.zodErrors?.email} />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            {!formState?.success && (
              <SubmitButton
                className="w-full"
                text="Send Reset Link"
                loadingText="Sending..."
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
