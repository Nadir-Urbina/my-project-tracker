import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { feedback, wishlist, rating } = await req.json();

  if (!feedback?.trim() && !wishlist?.trim()) {
    return NextResponse.json({ error: "No content provided" }, { status: 400 });
  }

  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

  try {
    await resend.emails.send({
      from: "FolioGTD Feedback <feedback@foliogtd.com>",
      to: "nurbinabr@gmail.com",
      subject: `FolioGTD Feedback — ${stars} (${rating}/5)`,
      html: `
        <h2>New Feedback from FolioGTD</h2>
        <p><strong>Rating:</strong> ${stars} (${rating}/5)</p>
        <hr />
        <h3>General Feedback</h3>
        <p style="white-space: pre-wrap">${feedback || "—"}</p>
        <h3>Wish List</h3>
        <p style="white-space: pre-wrap">${wishlist || "—"}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send feedback email:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
