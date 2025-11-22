import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { HistoryItem } from "@/lib/types";

export async function GET(_req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const docs = await db
      .collection("history")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const items: HistoryItem[] = docs.map((doc) => ({
      id: (doc._id as ObjectId).toHexString(),
      prompt: doc.prompt,
      code: doc.code,
      language: doc.language,
      createdAt: doc.createdAt?.toISOString?.() ?? new Date().toISOString()
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load history" },
      { status: 500 }
    );
  }
}
