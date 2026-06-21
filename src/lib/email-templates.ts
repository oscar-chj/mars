/**
 * Email HTML template generators for the MARS Portal.
 * Each template follows the EmailBodyFrame styling conventions:
 * - Professional header with MARS branding
 * - Structured body content
 * - Signature footer from MARS Registrar
 */

const wrapTemplate = (bodyContent: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;font-family:'Inter',Arial,sans-serif;background-color:#f4f4f5;color:#18181b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e4e4e7;">
          <!-- Header Banner -->
          <tr>
            <td style="background-color:#18181b;color:#fafafa;text-align:center;padding:20px 24px;font-size:16px;font-weight:700;letter-spacing:0.05em;">
              MARS Student Administration
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding:28px 24px;font-size:14px;line-height:1.7;color:#27272a;">
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer Signature -->
          <tr>
            <td style="padding:0 24px 24px;border-top:1px solid #e4e4e7;">
              <div style="padding-top:16px;font-size:12px;color:#71717a;">
                <p style="margin:0;font-weight:600;">MARS Registrar</p>
                <p style="margin:2px 0 0;">MARS Office of Records</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

/**
 * Generates HTML for a claim submission confirmation email sent to the student.
 */
export function generateSubmissionConfirmationHtml(
  studentName: string,
  eventName: string,
  date: string
): string {
  return wrapTemplate(`
    <p style="margin:0 0 12px;font-weight:600;">Dear ${studentName},</p>
    <p style="margin:0 0 12px;">
      We have received your community merit claim and it is currently awaiting review by the Office of Student Affairs.
    </p>
    <div style="background-color:#f4f4f5;border:1px solid #e4e4e7;border-radius:6px;padding:16px;margin:16px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr>
          <td style="color:#71717a;padding-bottom:6px;">Event:</td>
          <td style="font-weight:600;padding-bottom:6px;text-align:right;">${eventName}</td>
        </tr>
        <tr>
          <td style="color:#71717a;">Date:</td>
          <td style="font-weight:600;text-align:right;">${date}</td>
        </tr>
      </table>
    </div>
    <p style="margin:0 0 12px;">
      Once the review process is complete, you will receive another update detailing the outcome of your claim.
    </p>
    <p style="margin:0;">
      Thank you for your active participation and contributions to our community!
    </p>
  `)
}

/**
 * Generates HTML for an admin notification email when a new claim is submitted.
 */
export function generateAdminNotificationHtml(
  studentName: string,
  eventName: string,
  category: string
): string {
  return wrapTemplate(`
    <p style="margin:0 0 12px;font-weight:600;">Dear Administrator,</p>
    <p style="margin:0 0 12px;">
      A new community merit claim has been submitted and requires your review.
    </p>
    <div style="background-color:#f4f4f5;border:1px solid #e4e4e7;border-radius:6px;padding:16px;margin:16px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr>
          <td style="color:#71717a;padding-bottom:6px;">Student:</td>
          <td style="font-weight:600;padding-bottom:6px;text-align:right;">${studentName}</td>
        </tr>
        <tr>
          <td style="color:#71717a;padding-bottom:6px;">Event:</td>
          <td style="font-weight:600;padding-bottom:6px;text-align:right;">${eventName}</td>
        </tr>
        <tr>
          <td style="color:#71717a;">Category:</td>
          <td style="font-weight:600;text-align:right;">${category}</td>
        </tr>
      </table>
    </div>
    <p style="margin:0;">
      Please log in to the MARS Portal to review this claim at your earliest convenience.
    </p>
  `)
}

/**
 * Generates HTML for a claim approval notification email sent to the student.
 */
export function generateApprovalHtml(
  studentName: string,
  eventName: string,
  pointsAwarded: number,
  newBalance: number
): string {
  return wrapTemplate(`
    <p style="margin:0 0 12px;font-weight:600;">Dear ${studentName},</p>
    <p style="margin:0 0 12px;">
      Congratulations! Your merit claim has been approved.
    </p>
    <div style="background-color:#f4f4f5;border:1px solid #e4e4e7;border-radius:6px;padding:16px;margin:16px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr>
          <td style="color:#71717a;padding-bottom:6px;">Event:</td>
          <td style="font-weight:600;padding-bottom:6px;text-align:right;">${eventName}</td>
        </tr>
        <tr>
          <td style="color:#71717a;padding-bottom:6px;">Points Awarded:</td>
          <td style="font-weight:700;color:#059669;padding-bottom:6px;text-align:right;">+${pointsAwarded} Points</td>
        </tr>
        <tr>
          <td style="color:#71717a;border-top:1px solid #e4e4e7;padding-top:8px;">New Points Balance:</td>
          <td style="font-weight:700;border-top:1px solid #e4e4e7;padding-top:8px;text-align:right;">${newBalance} Points</td>
        </tr>
      </table>
    </div>
    <p style="margin:0;">
      Thank you for your dedication to community involvement and excellence.
    </p>
  `)
}

/**
 * Generates HTML for a claim rejection notification email sent to the student.
 */
export function generateRejectionHtml(
  studentName: string,
  eventName: string,
  reason: string
): string {
  return wrapTemplate(`
    <p style="margin:0 0 12px;font-weight:600;">Dear ${studentName},</p>
    <p style="margin:0 0 12px;">
      Your merit claim has been reviewed. Unfortunately, it does not meet the guidelines for this category and has been rejected.
    </p>
    <div style="background-color:#f4f4f5;border:1px solid #e4e4e7;border-radius:6px;padding:16px;margin:16px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr>
          <td style="color:#71717a;padding-bottom:6px;">Event:</td>
          <td style="font-weight:600;padding-bottom:6px;text-align:right;">${eventName}</td>
        </tr>
      </table>
    </div>
    <div style="background-color:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:16px;margin:16px 0;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#dc2626;">
        Rejection Reason:
      </p>
      <p style="margin:0;font-size:14px;color:#dc2626;">
        ${reason}
      </p>
    </div>
    <p style="margin:0;">
      Please resubmit with correct documentation or review the claim guidelines if applicable.
    </p>
  `)
}

/**
 * Generates HTML for a resend/retry notification email.
 */
export function generateResendNotificationHtml(
  recipientEmail: string,
  subject: string,
  actionName: string
): string {
  return wrapTemplate(`
    <p style="margin:0 0 12px;font-weight:600;">Dear Student,</p>
    <p style="margin:0 0 12px;">
      This is a follow-up delivery of a previous notification. The action <strong>${actionName}</strong> was triggered for the following email:
    </p>
    <div style="background-color:#f4f4f5;border:1px solid #e4e4e7;border-radius:6px;padding:16px;margin:16px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr>
          <td style="color:#71717a;padding-bottom:6px;">Original Recipient:</td>
          <td style="font-weight:600;padding-bottom:6px;text-align:right;">${recipientEmail}</td>
        </tr>
        <tr>
          <td style="color:#71717a;">Original Subject:</td>
          <td style="font-weight:600;text-align:right;">${subject}</td>
        </tr>
      </table>
    </div>
    <p style="margin:0;">
      If you believe this was sent in error, please disregard this message.
    </p>
  `)
}
