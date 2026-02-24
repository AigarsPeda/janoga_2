import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log the callback for now (no database)
    console.log("KLIX payment callback received:", JSON.stringify(body, null, 2));

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("KLIX callback error:", error);
    return NextResponse.json({ error: "Callback processing failed" }, { status: 500 });
  }
}
