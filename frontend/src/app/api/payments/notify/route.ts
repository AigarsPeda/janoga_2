import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface OrderItem {
  description: string;
  kind: string;
  price: string | number;
  quantity: number;
}

interface NotifyBody {
  notificationEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes: string;
  items: OrderItem[];
  totalPrice: number;
}

async function saveOrderToStrapi(body: NotifyBody) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const strapiToken = process.env.STRAPI_ORDER_TOKEN;

  if (!strapiUrl || !strapiToken) {
    console.error("STRAPI_ORDER_TOKEN not configured, skipping order save");
    return;
  }

  const payload = {
    data: {
      reference: `order-${Date.now()}`,
      totalPrice: body.totalPrice,
      items: body.items,
      customerName: body.customerName || null,
      customerEmail: body.customerEmail || null,
      customerPhone: body.customerPhone || null,
      customerAddress: body.customerAddress || null,
      customerNotes: body.customerNotes || null,
      orderDate: new Date().toISOString().split("T")[0],
    },
  };

  console.log("Saving order to Strapi:", JSON.stringify(payload, null, 2));

  const response = await fetch(`${strapiUrl}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${strapiToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to save order to Strapi:", response.status, errorText);
  } else {
    console.log("Order saved to Strapi successfully");
  }
}

export async function POST(request: Request) {
  try {
    const body: NotifyBody = await request.json();

    if (!body.items?.length) {
      return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
    }

    // Save order to Strapi (don't block the response on failure)
    saveOrderToStrapi(body).catch((err) => {
      console.error("Order save error:", err);
    });

    // Send email notification if email is configured
    if (body.notificationEmail) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        port: 465,
        secure: true,
        host: "smtp.gmail.com",
        auth: {
          user: process.env.NEXT_GMAIL_SENDER_EMAIL,
          pass: process.env.NEXT_GMAIL_SENDER_PASSWORD,
        },
      });

      const itemRows = body.items
        .map(
          (item) =>
            `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.description}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.kind}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${(parseFloat(String(item.price)) * item.quantity).toFixed(2)} €</td>
          </tr>`,
        )
        .join("");

      const itemsText = body.items
        .map((item) => `${item.description} (${item.kind}) x${item.quantity} — ${(parseFloat(String(item.price)) * item.quantity).toFixed(2)} €`)
        .join("\n");

      const customerSection = [
        body.customerName && `Name: ${body.customerName}`,
        body.customerEmail && `Email: ${body.customerEmail}`,
        body.customerPhone && `Phone: ${body.customerPhone}`,
        body.customerAddress && `Address: ${body.customerAddress}`,
        body.customerNotes && `Notes: ${body.customerNotes}`,
      ]
        .filter(Boolean)
        .join("\n");

      const customerHtml = [
        body.customerName && `<p><strong>Name:</strong> ${body.customerName}</p>`,
        body.customerEmail && `<p><strong>Email:</strong> ${body.customerEmail}</p>`,
        body.customerPhone && `<p><strong>Phone:</strong> ${body.customerPhone}</p>`,
        body.customerAddress && `<p><strong>Address:</strong> ${body.customerAddress}</p>`,
        body.customerNotes && `<p><strong>Notes:</strong> ${body.customerNotes}</p>`,
      ]
        .filter(Boolean)
        .join("");

      await transporter.sendMail({
        to: body.notificationEmail,
        from: process.env.NEXT_GMAIL_SENDER_EMAIL,
        subject: `New Order — ${body.totalPrice.toFixed(2)} €`,
        text: `New order received!\n\nCustomer:\n${customerSection}\n\nItems:\n${itemsText}\n\nTotal: ${body.totalPrice.toFixed(2)} €`,
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #333;">New Order Received</h2>
          ${customerHtml ? `<div style="margin-bottom: 16px; padding: 12px; background: #f9f9f9; border-radius: 8px;">${customerHtml}</div>` : ""}
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 8px; text-align: left;">Dish</th>
                <th style="padding: 8px; text-align: left;">Type</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
          <p style="margin-top: 16px; font-size: 18px; font-weight: bold;">
            Total: ${body.totalPrice.toFixed(2)} €
          </p>
        </div>
      `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send payment notification:", error);
    return NextResponse.json({ success: false, message: "Failed to send notification" }, { status: 500 });
  }
}
