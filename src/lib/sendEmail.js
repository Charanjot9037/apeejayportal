import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendPasswordResetEmail(email, resetUrl) {
  await transporter.sendMail({
    from: `"Apeejay Student Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password - Apeejay Student Portal",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        border: 1px solid #ddd;
        border-radius: 10px;
      ">

        <h2 style="color: #1d4ed8;">
          Password Reset Request
        </h2>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the button below to create a new password.
        </p>

        <div style="margin: 30px 0;">
          <a
            href="${resetUrl}"
            style="
              background-color: #f97316;
              color: white;
              padding: 12px 20px;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;
            "
          >
            Reset Password
          </a>
        </div>

        <p>
          This link will expire in <strong>5 minutes</strong>.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore
          this email.
        </p>

        <hr />

        <p style="font-size: 12px; color: #777;">
          Apeejay Student Portal
        </p>

      </div>
    `,
  });
}