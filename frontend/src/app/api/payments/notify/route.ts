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
  items: OrderItem[];
  totalPrice: number;
}

export async function POST(request: Request) {
  try {
    const body: NotifyBody = await request.json();

    if (!body.notificationEmail || !body.items?.length) {
      return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
    }

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

    await transporter.sendMail({
      to: body.notificationEmail,
      from: process.env.NEXT_GMAIL_SENDER_EMAIL,
      subject: `New Order — ${body.totalPrice.toFixed(2)} €`,
      text: `New order received!\n\n${itemsText}\n\nTotal: ${body.totalPrice.toFixed(2)} €`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #333;">New Order Received</h2>
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send payment notification:", error);
    return NextResponse.json({ success: false, message: "Failed to send notification" }, { status: 500 });
  }
}
