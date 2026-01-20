import { draftMode } from "next/headers";

export async function fetchData(url: string, authToken?: string) {
  // Check if Next.js draft mode is enabled
  // Wrap in try-catch because draftMode() throws during static generation (generateStaticParams)
  let isDraftMode = false;
  try {
    const draft = await draftMode();
    isDraftMode = draft.isEnabled;
  } catch {
    // draftMode() is not available during static generation, default to false
    isDraftMode = false;
  }

  // Add status=draft parameter when draft mode is enabled
  const urlWithDraft = new URL(url);
  if (isDraftMode) {
    urlWithDraft.searchParams.set("status", "draft");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    // Enable content source maps in preview mode (for Live Preview)
    "strapi-encode-source-maps": isDraftMode ? "true" : "false",
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(urlWithDraft.toString(), {
      method: "GET",
      headers,
    });
    const data = await response.json();

    if (!response.ok) throw new Error("Failed to fetch data");

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // or return null;
  }
}
