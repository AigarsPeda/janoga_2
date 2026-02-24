// Server-only module — never import from client components

export interface KlixProduct {
  name: string;
  price: number; // price in cents (minor units)
  quantity: number;
}

export interface KlixPurchaseResponse {
  id: string;
  checkout_url: string;
}

export async function createKlixPurchase(
  products: KlixProduct[],
  options: {
    language?: string;
    reference?: string;
    email?: string;
    successRedirect: string;
    failureRedirect: string;
    callbackUrl: string;
  },
): Promise<KlixPurchaseResponse> {
  const brandId = process.env.KLIX_BRAND_ID;
  const secretKey = process.env.KLIX_SECRET_KEY;
  const apiUrl = process.env.KLIX_API_URL;

  if (!brandId || !secretKey || !apiUrl) {
    throw new Error("KLIX environment variables are not configured");
  }

  // KLIX only accepts callback URLs on standard ports (80/443).
  // Skip callback for local development.
  const callbackUrl = options.callbackUrl;
  const isLocalCallback = callbackUrl.includes("localhost") || callbackUrl.includes("127.0.0.1");

  const body: Record<string, unknown> = {
    brand_id: brandId,
    success_redirect: options.successRedirect,
    failure_redirect: options.failureRedirect,
    cancel_redirect: options.failureRedirect,
    reference: options.reference || `order-${Date.now()}`,
    purchase: {
      language: options.language || "lv",
      products,
    },
    client: {
      email: options.email || "test@test.com",
    },
  };

  if (!isLocalCallback) {
    body.success_callback = callbackUrl;
  }

  const response = await fetch(`${apiUrl}/purchases/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("KLIX API error:", response.status, errorText);
    throw new Error(`KLIX API returned ${response.status}: ${errorText}`);
  }

  return response.json();
}
