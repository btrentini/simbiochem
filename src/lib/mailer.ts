import "server-only";

import nodemailer from "nodemailer";

import { serverEnv } from "@/lib/server-env";

/**
 * SMTP delivery for form notifications.
 *
 * Everything official goes to one address (SPONSOR_NOTIFY_TO, in practice
 * workshop@simbiochem.com). The domain's MX already points at Hostinger, so
 * the natural transport is Hostinger's own SMTP with that mailbox's
 * credentials — no third-party service, no extra DNS.
 */
export function mailConfigured(): boolean {
  return Boolean(
    serverEnv.SMTP_HOST && serverEnv.SMTP_USER && serverEnv.SMTP_PASSWORD,
  );
}

function transport() {
  const port = serverEnv.SMTP_PORT;
  return nodemailer.createTransport({
    host: serverEnv.SMTP_HOST,
    port,
    // 465 is implicit TLS; 587 upgrades with STARTTLS.
    secure: port === 465,
    auth: { user: serverEnv.SMTP_USER, pass: serverEnv.SMTP_PASSWORD },
  });
}

/** Escape anything that goes into the HTML body of an email. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendSponsorEnquiry(enquiry: {
  name: string;
  company: string;
  contact: string;
  message: string;
}) {
  if (!mailConfigured()) {
    throw new Error("SMTP is not configured.");
  }

  const to = serverEnv.SPONSOR_NOTIFY_TO ?? serverEnv.SMTP_USER!;
  const rows: [string, string][] = [
    ["Name", enquiry.name],
    ["Company", enquiry.company],
    ["Contact", enquiry.contact],
  ];

  await transport().sendMail({
    // From must be the authenticated mailbox or Hostinger rejects it; the
    // enquirer goes in Reply-To so replying reaches them directly.
    from: `"SIMBIOCHEM website" <${serverEnv.SMTP_USER}>`,
    to,
    replyTo: enquiry.contact.includes("@") ? enquiry.contact : undefined,
    subject: `Sponsorship enquiry — ${enquiry.company}`,
    text:
      rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
      `\n\nMessage:\n${enquiry.message}\n`,
    html:
      `<h2 style="font:600 16px system-ui;margin:0 0 12px">Sponsorship enquiry</h2>` +
      `<table style="font:14px system-ui;border-collapse:collapse">` +
      rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#626a73">${k}</td>` +
            `<td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`,
        )
        .join("") +
      `</table>` +
      `<p style="font:14px/1.6 system-ui;margin:16px 0 0;white-space:pre-wrap">${esc(enquiry.message)}</p>`,
  });
}
