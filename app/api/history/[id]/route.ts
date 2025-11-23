import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface RouteParams {
  params: { id: string };
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db
      .collection("history")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "History item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete history item" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const body = await req.json();

    const { isFavorite } = body as { isFavorite?: boolean };

    if (typeof isFavorite !== "boolean") {
      return NextResponse.json(
        { error: "isFavorite must be boolean" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("history");

    const filter: any = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { _id: id };


    const updateResult = await collection.updateOne(filter, {
      $set: { isFavorite }
    });


    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: "History item not found" },
        { status: 404 }
      );
    }

    const updated = await collection.findOne(filter);

    if (!updated) {
      return NextResponse.json(
        { error: "History item not found after update" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: updated._id.toString(),
      prompt: updated.prompt,
      code: updated.code,
      language: updated.language,
      isFavorite: updated.isFavorite ?? false,
      createdAt: updated.createdAt?.toISOString?.() ?? new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating favorite:", error);
    return NextResponse.json(
      { error: "Failed to update history item" },
      { status: 500 }
    );
  }
}