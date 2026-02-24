import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PaymentSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Payment Successful</h1>
        <p className="text-muted-foreground">
          Thank you for your order. Your payment has been processed successfully.
        </p>
        <Button asChild>
          <Link href={`/${locale}`}>Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
