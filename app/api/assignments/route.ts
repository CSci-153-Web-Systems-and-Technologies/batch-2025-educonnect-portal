import { NextResponse } from "next/server";
import { assignmentService } from "@/services/assignmentService";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const scope = url.searchParams.get("scope");

    // Default to published-only; teachers can pass ?scope=teacher
    const data = scope === "teacher"
      ? await assignmentService.getAll()
      : await assignmentService.getPublished();

    return NextResponse.json(data ?? [], { status: 200 });
  } catch (error) {
    console.error("API Error fetching assignments:", error);
    return NextResponse.json({ error: "Failed to retrieve assignments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await assignmentService.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("API Error creating assignment:", error);
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
  }
}
