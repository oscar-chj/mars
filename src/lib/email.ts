export async function sendEmail(params: {
  to: string
  subject: string
  html: string
}) {
  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })
    return await res.json()
  } catch (error) {
    console.error("Failed to send email:", error)
    return { error }
  }
}
