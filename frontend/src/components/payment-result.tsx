"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface PaymentTexts {
  successTitle: string;
  successText: string;
  failureTitle: string;
  failureText: string;
  backButtonText: string;
}

const defaults: PaymentTexts = {
  successTitle: "Payment Successful",
  successText: "Thank you for your order. Your payment has been processed successfully.",
  failureTitle: "Payment Failed",
  failureText: "Something went wrong with your payment. Please try again.",
  backButtonText: "Back to Home",
};

export function PaymentResult({
  variant,
  locale,
}: {
  variant: "success" | "failure";
  locale: string;
}) {
  // Start with defaults (matches SSR), then read sessionStorage after mount
  const [texts, setTexts] = useState<PaymentTexts>(defaults);
  const [mounted, setMounted] = useState(false);
  const notifiedRef = useRef(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("paymentTexts");
      if (stored) {
        setTexts({ ...defaults, ...JSON.parse(stored) });
      }
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (variant !== "success" || notifiedRef.current) return;
    notifiedRef.current = true;

    try {
      const stored = sessionStorage.getItem("paymentOrder");
      if (!stored) return;

      const order = JSON.parse(stored);
      if (!order.notificationEmail) return;

      fetch("/api/payments/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: stored,
      }).finally(() => {
        sessionStorage.removeItem("paymentOrder");
      });
    } catch {}
  }, [variant]);

  const isSuccess = variant === "success";
  const title = isSuccess ? texts.successTitle : texts.failureTitle;
  const text = isSuccess ? texts.successText : texts.failureText;

  return (
    <div className="flex min-h-[82vh] items-center justify-center px-4">
      <div
        className={`text-center space-y-6 max-w-md transition-opacity duration-200 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        <div
          className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
            isSuccess ? "bg-green-500/20" : "bg-red-500/20"
          }`}
        >
          <svg
            className={`w-8 h-8 ${isSuccess ? "text-green-500" : "text-red-500"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {isSuccess ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{text}</p>
        <Button asChild>
          <Link href={`/${locale}`}>{texts.backButtonText}</Link>
        </Button>
      </div>
    </div>
  );
}
