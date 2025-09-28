// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  console.log("Received request");

  try {
    const body = await request.json();
    console.log("Form submission:", body);

    // Create email transporter
    const transporter = nodemailer.createTransport({
      port: 465,
      secure: true,
      host: "smtp.gmail.com",
      auth: {
        user: process.env.NEXT_GMAIL_SENDER_EMAIL,
        pass: process.env.NEXT_GMAIL_SENDER_PASSWORD,
      },
    });

    const emailText = Object.entries(body)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n\n");

    const senderEmail = body["e-mail"]?.trim() || body["email"]?.trim() || body["e-pasts"]?.trim();

    const recipientEmail = body?.recipientEmail;
    delete body.recipientEmail;

    await transporter.sendMail({
      to: recipientEmail,
      from: senderEmail,
      subject: "JANOGA 2.0",
      text: emailText,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="margin-top: 20px;">
          ${Object.entries(body)
            .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
            .join("")}
        </div>
      </div>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });
  }
}
