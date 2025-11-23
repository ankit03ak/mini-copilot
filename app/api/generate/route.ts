import { NextRequest, NextResponse } from "next/server";
import { getMockCode } from "@/lib/mockSnippets";
import { connectToDatabase } from "@/lib/mongodb";
import { Language } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt: string | undefined = body?.prompt;
    const language: Language = body?.language ?? "python";

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const code = getMockCode(prompt, language);

    const { db } = await connectToDatabase();
    const result = await db.collection("history").insertOne({
      prompt,
      code,
      language,
      createdAt: new Date()
    });

    const doc = {
      id: (result.insertedId as ObjectId).toHexString(),
      prompt,
      code,
      language,
      isFavorite: false,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(doc);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
