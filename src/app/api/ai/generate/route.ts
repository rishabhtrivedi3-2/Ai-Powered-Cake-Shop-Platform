import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await fetch(
      "https://router.huggingface.co/nebius/v1/images/generations",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: "black-forest-labs/flux-schnell", // Must specify model for Router
          prompt: prompt,
          response_format: "b64_json", // Request base64 string
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.error || "Failed to generate" }, { status: response.status });
    }

    const result = await response.json();
    
    // Nebius/OpenAI format: result.data[0].b64_json
    const base64 = result.data[0].b64_json;

    return NextResponse.json({
      image: `data:image/png;base64,${base64}`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}