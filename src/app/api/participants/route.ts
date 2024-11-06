import { DatabaseError } from "@/definitions";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await query("SELECT name, email FROM participants");
    return NextResponse.json(result.rows);
  } catch (err: unknown) {
    if (isDatabaseError(err) && err.code === "23505") {
      return NextResponse.json({ error: err.code }, { status: 409 });
    } else {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 },
      );
    }
  }
}

// Type guard to check if error is a DatabaseError
function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof Error && "code" in error;
}
