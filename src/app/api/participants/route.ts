import { DatabaseError } from "@/definitions";
import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await query(
      "SELECT id, name, email, created_at FROM participants WHERE status=1 ORDER BY created_at ASC",
    );
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

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const { id, status } = data;
  try {
    const result = await query(
      "UPDATE participants SET status = $1 WHERE id = $2 RETURNING *",
      [status, id],
    );
    return NextResponse.json(result.rows[0]);
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
