import { PaymentResult } from "@/components/payment-result";

export default async function PaymentSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <PaymentResult variant="success" locale={locale} />;
}
