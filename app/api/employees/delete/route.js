import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  try {
    const { id, authUserId } = await request.json();
    if (!id || !authUserId) {
      return NextResponse.json({ error: "id and authUserId are required." }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Delete the employees table row first.
    const { error: rowError } = await supabaseAdmin.from("employees").delete().eq("id", id);
    if (rowError) {
      return NextResponse.json({ error: rowError.message }, { status: 400 });
    }

    // Delete the actual Auth login so the email is free to reuse.
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(authUserId);
    if (authError) {
      // Row is already gone from the employees table; surface this so the
      // admin knows to clean up the orphaned auth user manually if needed.
      return NextResponse.json(
        { error: `Employee record removed, but the login could not be deleted: ${authError.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Something went wrong." }, { status: 500 });
  }
}
