import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmployeeCredentialsEmail } from "@/lib/sendEmail";
import { randomUUID } from "crypto";

// Password rule: first 3 letters of the employee's name + "@" + the employee code admin typed in.
function generatePassword(name, employeeCode) {
  const namePart = (name || "").replace(/\s+/g, "").slice(0, 3).toLowerCase();
  return `${namePart}@${employeeCode}`;
}

export async function POST(request) {
  try {
    const { name, email, phone, role, employeeCode } = await request.json();
    if (!name || !email || !phone || !employeeCode) {
      return NextResponse.json({ error: "Name, email, phone and employee ID are required." }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const password = generatePassword(name, employeeCode);

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const { data: empRow, error: empError } = await supabaseAdmin
      .from("employees")
      .insert({
        auth_user_id: authData.user.id,
        employee_code: employeeCode,
        name,
        email,
        phone,
        role: role || "Employee",
        role_type: "employee",
        status: "Active",
      })
      .select()
      .single();

    if (empError) {
      // Roll back the auth user if the employees row failed, to avoid orphaned logins
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: empError.message }, { status: 400 });
    }

    let emailSent = true;
    let emailError = null;
    try {
      await sendEmployeeCredentialsEmail({
        to: email,
        name,
        email,
        password,
        loginUrl: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/login` : undefined,
      });
    } catch (err) {
      // Employee + login already created successfully — don't fail the whole
      // request just because the email didn't go out. Admin can still see
      // the password in the UI and share it manually.
      emailSent = false;
      emailError = err.message || "Failed to send credentials email.";
      console.error("Employee credentials email failed:", emailError);
    }

    return NextResponse.json({ employee: empRow, password, emailSent, emailError });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Something went wrong." }, { status: 500 });
  }
}


