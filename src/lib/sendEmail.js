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
export async function sendMentorStatusUpdateEmail({
  email,
  studentName,
  projectTitle,
  mentorName,
  status,
}) {
  await transporter.sendMail({
    from: `"Apeejay Student Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Project Status Updated - ${projectTitle}`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        background-color: #ffffff;
      ">

        <h2 style="
          color: #1d4ed8;
          margin-bottom: 20px;
        ">
          Project Status Updated
        </h2>

        <p>
          Hello <strong>${studentName || "Student"}</strong>,
        </p>

        <p>
  Your mentor 
  <strong>${mentorName}</strong>
  has updated the status of your project.
</p>

        <div style="
          margin: 24px 0;
          padding: 18px;
          background-color: #f8fafc;
          border-radius: 8px;
        ">

          <p style="margin: 0 0 10px;">
            <strong>Project:</strong>
            ${projectTitle}
          </p>

          <p style="margin: 0;">
            <strong>Status:</strong>
            <span style="
              color: #f2792a;
              font-weight: 600;
            ">
              ${status}
            </span>
          </p>
           <p style="margin: 0 0 10px;">
    <strong>Mentor:</strong>
    ${mentorName}
  </p>

        </div>


        <hr style="
          border: none;
          border-top: 1px solid #e2e8f0;
          margin: 25px 0;
        " />

        <p style="
          font-size: 12px;
          color: #777;
        ">
          Apeejay Student Portal
        </p>

      </div>
    `,
  });
}
export async function sendMentorFeedbackEmail({
  email,
  studentName,
  projectTitle,
  mentorName,
  comment,
}) {
  await transporter.sendMail({
    from: `"Apeejay Student Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `New Mentor Feedback - ${projectTitle}`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        background-color: #ffffff;
      ">

        <h2 style="
          color: #1d4ed8;
          margin-bottom: 20px;
        ">
          New Mentor Feedback
        </h2>

        <p>
          Hello <strong>${studentName || "Student"}</strong>,
        </p>

       <p>
  Your mentor 
  <strong>${mentorName}</strong>
  has submitted new feedback for your project.
</p>

        <div style="
          margin: 24px 0;
          padding: 20px;
          background-color: #fff7ed;
          border-left: 4px solid #f2792a;
          border-radius: 6px;
        ">

          <p style="
            margin: 0 0 10px;
            font-weight: 600;
            color: #334155;
          ">
            Project
          </p>

          <p style="
            margin: 0 0 18px;
            color: #475569;
          ">
            ${projectTitle}
          </p>
          <p style="
    margin: 0 0 10px;
    font-weight: 600;
    color: #334155;
  ">
    Mentor
  </p>

  <p style="
    margin: 0 0 18px;
    color: #475569;
  ">
    ${mentorName}
  </p>

          <p style="
            margin: 0 0 10px;
            font-weight: 600;
            color: #334155;
          ">
            Mentor Feedback
          </p>

          <p style="
            margin: 0;
            color: #475569;
            line-height: 1.6;
          ">
            ${comment}
          </p>

        </div>


        <hr style="
          border: none;
          border-top: 1px solid #e2e8f0;
          margin: 25px 0;
        " />

        <p style="
          font-size: 12px;
          color: #777;
        ">
          Apeejay Student Portal
        </p>

      </div>
    `,
  });
}