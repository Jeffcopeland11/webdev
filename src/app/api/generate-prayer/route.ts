import Anthropic from "@anthropic-ai/sdk";
import { buildPrayerPrompt } from "@/lib/prayer-prompt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const prompt = buildPrayerPrompt({
      clientName: body.clientName,
      primarySymptom: body.primarySymptom,
      symptomArea: body.symptomArea,
      findings: body.findings,
    });

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const prayer = textBlock ? textBlock.text : "";

    return NextResponse.json({ prayer });
  } catch (error) {
    console.error("Prayer generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate prayer" },
      { status: 500 }
    );
  }
}
