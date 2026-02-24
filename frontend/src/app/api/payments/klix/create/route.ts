import { NextResponse } from "next/server";
import { createKlixPurchase, type KlixProduct } from "@/lib/payments/klix";

interface OrderItem {
  dishId: string;
  description: string;
  kind: string;
  price: string | number;
  quantity: number;
}

interface CreatePaymentBody {
  items: OrderItem[];
  totalPrice: number;
  locale?: string;
  customerEmail?: string;
}

export async function POST(request: Request) {
  try {
    const body: CreatePaymentBody = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ success: false, message: "No items provided" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const locale = body.locale || "lv";

    // Convert selections to KLIX products format (price in cents, quantity separate)
    const products: KlixProduct[] = body.items.map((item) => ({
      name: item.description,
      price: Math.round(parseFloat(String(item.price)) * 100),
      quantity: item.quantity,
    }));

    const result = await createKlixPurchase(products, {
      language: locale,
      email: body.customerEmail,
      reference: `order-${Date.now()}`,
      successRedirect: `${siteUrl}/${locale}/payment/success`,
      failureRedirect: `${siteUrl}/${locale}/payment/failure`,
      callbackUrl: `${siteUrl}/api/payments/klix/callback`,
    });

    return NextResponse.json({
      success: true,
      checkout_url: result.checkout_url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create payment";
    console.error("Failed to create KLIX purchase:", message);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
