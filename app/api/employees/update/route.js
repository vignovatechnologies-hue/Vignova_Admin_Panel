import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  try {
    const { id, name, phone, role, status } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Employee id is required." }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("employees")
      .update({ name, phone, role, status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ employee: data });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Something went wrong." }, { status: 500 });
  }
}
