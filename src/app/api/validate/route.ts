import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

interface DatabaseError extends Error {
  code?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();
    const uuid = uuidv4();

    try {
      // Insert into database
      await query(
        "INSERT INTO participants (id, name, email) VALUES ($1, $2, $3) RETURNING *",
        [uuid, name, email],
      );
      return NextResponse.json({ success: true });
    } catch (error: unknown) {
      // Check if error is a database error
      if (isDatabaseError(error) && error.code === "23505") {
        return NextResponse.json(
          { error: "Account already participated" },
          { status: 409 },
        );
      } else {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Something went wrong" },
          { status: 500 },
        );
      }
    }
  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 },
    );
  }
}

// Type guard to check if error is a DatabaseError
function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof Error && "code" in error;
}
