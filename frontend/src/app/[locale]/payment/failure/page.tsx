import { PaymentResult } from "@/components/payment-result";

export default async function PaymentFailurePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <PaymentResult variant="failure" locale={locale} />;
}
