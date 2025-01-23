import { Resend } from "resend";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY ?? "");
  await resend.emails.send({
    from: "team@pulserseo.com",
    to,
    subject,
    html,
  });
};
