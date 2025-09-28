// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  console.log("Received request");

  try {
    const body = await request.json();
    console.log("Form submission:", body);

    // Form submission: { name: 'John', message: 'Hi' }

    // Fetch email settings from Strapi
    // const path = `/global`;
    // const url =
    //   process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
    // const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

    // if (!token) {
    //   return NextResponse.json(
    //     { success: false, message: "Missing API token" },
    //     { status: 500 }
    //   );
    // }

    // const strapiRes = await fetch(`${url}/api${path}?populate=emailsettings`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   },
    // });

    // if (!strapiRes.ok) {
    //   console.error("Failed to fetch email config:", await strapiRes.text());
    //   return NextResponse.json(
    //     { success: false, message: "Failed to fetch email configuration" },
    //     { status: 500 }
    //   );
    // }

    // const configData = await strapiRes.json();
    // const emailSettings = configData.data.attributes.emailsettings;

    // if (!emailSettings) {
    //   return NextResponse.json(
    //     { success: false, message: "Email settings not found" },
    //     { status: 500 }
    //   );
    // }

    // console.log("Email settings found:", {
    //   email: emailSettings.email,
    // });

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

    // // Format email content nicely
    const emailText = Object.entries(body)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n\n");

    const senderEmail = body["e-mail"]?.trim() || body["email"]?.trim() || body["e-pasts"]?.trim();

    // const subjectFromForm = body.Subject?.trim();

    // let subject = "www.dentsu.lv contact form submission";
    // if (subjectFromForm && senderEmail) {
    //   subject = `${subjectFromForm} from ${senderEmail} - www.dentsu.lv website`;
    // } else if (subjectFromForm && !senderEmail) {
    //   subject = `www.dentsu.lv ${subjectFromForm} form`;
    // } else if (senderEmail && !subjectFromForm) {
    //   subject = `${senderEmail} - www.dentsu.lv website`;
    // }

    const recipientEmail = body?.recipientEmail;

    // const fromName = senderEmail
    //   ? `${senderEmail} - www.dentsu.lv contact form`
    //   : "www.dentsu.lv contact form";
    // const fromAddress = process.env.NEXT_GMAIL_SENDER_EMAIL;
    // const from = `"${fromName}" <${fromAddress}>`;

    // console.log("Sending email to:", recipientEmail);

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
