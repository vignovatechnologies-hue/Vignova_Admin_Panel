import { Resend } from "resend";

// SERVER-ONLY. Requires RESEND_API_KEY in .env.local (get one free at resend.com).
// Requires EMAIL_FROM in .env.local, e.g. "Vignova <onboarding@yourdomain.com>"
// Resend requires the "from" domain to be verified in your Resend dashboard
// before you can send to real inboxes other than your own test address.

let resendClient = null;
function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing from .env.local. Get one at https://resend.com/api-keys");
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function sendEmployeeCredentialsEmail({ to, name, email, password, loginUrl }) {
  const resend = getResend();
  const from = process.env.EMAIL_FROM || "Vignova <onboarding@resend.dev>";

  const html = `
  <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
    <h2 style="color:#1c1b2e; margin-bottom: 4px;">Welcome to Vignova, ${escapeHtml(name)}</h2>
    <p style="color:#555; font-size: 14px;">Your admin panel account has been created. Use the credentials below to log in.</p>
    <div style="background:#f5f6fb; border:1px solid #ececf3; border-radius:10px; padding:16px; margin:20px 0;">
      <p style="margin:0 0 8px; font-size:13px; color:#1c1b2e;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin:0; font-size:13px; color:#1c1b2e;"><strong>Temporary password:</strong> <code style="background:#efeaff; color:#5636d6; padding:2px 8px; border-radius:6px;">${escapeHtml(password)}</code></p>
    </div>
    <p style="color:#555; font-size:13px;">Please log in and change your password as soon as possible.</p>
    ${loginUrl ? `<a href="${escapeHtml(loginUrl)}" style="display:inline-block; background:#6c4ff5; color:#fff; text-decoration:none; padding:10px 18px; border-radius:8px; font-size:13px; font-weight:600; margin-top:8px;">Go to login</a>` : ""}
    <p style="color:#9a9aa8; font-size:11px; margin-top:28px;">If you weren't expecting this email, please contact your admin.</p>
  </div>`;

  const text = `Welcome to Vignova, ${name}

Your admin panel account has been created.

Email: ${email}
Temporary password: ${password}

Please log in and change your password as soon as possible.
${loginUrl ? `Login: ${loginUrl}` : ""}`;

  return resend.emails.send({
    from,
    to,
    subject: "Your Vignova admin panel login credentials",
    html,
    text,
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
