"use client";

export async function callApi(action: string, data: any) {
  let res: Response;
  try {
    res = await fetch("/api/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...data }),
    });
  } catch {
    throw new Error("Network error. Please check your connection and try again.");
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new Error("Invalid response from server. Please try again.");
  }

  if (!res.ok) throw new Error(json.error || "Request failed");
  return json;
}
