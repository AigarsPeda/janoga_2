import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PaymentFailurePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Payment Failed</h1>
        <p className="text-muted-foreground">
          Something went wrong with your payment. Please try again.
        </p>
        <Button asChild>
          <Link href={`/${locale}`}>Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
