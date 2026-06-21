import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { subject, html } = await request.json()
  try {
    const data = await resend.emails.send({
      from: "MARS Portal <onboarding@resend.dev>",
      to: ["onboarding@resend.dev"], // Testing domain per Resend docs
      subject,
      html,
    })
    return Response.json(data)
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
}
