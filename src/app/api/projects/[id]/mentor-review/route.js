// app/api/projects/[id]/mentor-review/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/projects";
import Mentor from "@/models/mentor";
import { authenticateUser } from "@/lib/authentication";
import { sendMentorFeedbackEmail,sendMentorStatusUpdateEmail } from "@/lib/sendEmail";

const ALLOWED_STATUSES = ["Approved", "Rejected", "Pending Approval"];

export async function PATCH(request, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const project = await Project.findById(id).populate({
  path: "student",
  select: "name email",
});

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found." },
        { status: 404 },
      );
    }

    const mentorProfile = await Mentor.findOne({ userId: auth.user._id });

    if (
      !mentorProfile ||
      !project.mentor ||
      project.mentor.toString() !== mentorProfile._id.toString()
    ) {
      return NextResponse.json(
        { success: false, message: "You are not assigned to this project." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { status, comment } = body;

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value." },
        { status: 400 },
      );
    }

    if (!status && comment === undefined) {
      return NextResponse.json(
        { success: false, message: "Provide a status or comment to update." },
        { status: 400 },
      );
    }

    // comment, if provided, must be non-empty after trimming —
    // otherwise we'd log empty history entries
    if (comment !== undefined && comment.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Comment cannot be empty." },
        { status: 400 },
      );
    }

    const now = new Date();

    // build the history entry from whatever was actually sent
    const reviewEntry = {
      reviewedBy: mentorProfile._id,
      reviewedAt: now,
    };
    if (status) reviewEntry.status = status;
    if (comment !== undefined) reviewEntry.comment = comment.trim();

if (!Array.isArray(project.mentorReviews)) {
  project.mentorReviews = [];
}

project.mentorReviews.push(reviewEntry);
    // keep the "current state" fields in sync
    if (status) project.status = status;
    if (comment !== undefined) project.mentorComment = comment.trim();
    project.mentorReviewedAt = now;

await project.save();


console.log("========================================");
console.log("MENTOR REVIEW SAVED");
console.log("Project ID:", project._id);
console.log("Project Title:", project.title);
console.log("Student Name:", project.student?.name);
console.log("Student Email:", project.student?.email);
console.log("Status:", status);
console.log("Comment:", comment);
console.log("========================================");

// ========================================
// STATUS EMAIL
// ========================================

if (status) {
  console.log("STATUS EMAIL: Preparing to send...");
  console.log("STATUS EMAIL: Recipient:", project.student?.email);
  console.log("STATUS EMAIL: Status:", project.status);

  if (!project.student?.email) {
    console.error(
      "STATUS EMAIL ERROR: Student email not found."
    );
  } else {
    try {
      await sendMentorStatusUpdateEmail({
        email: project.student.email,
        studentName: project.student.name,
        projectTitle: project.title,
        mentorName: project.mentor?.userId?.name || "Your Mentor",
        status: project.status,
      });

      console.log(
        "STATUS EMAIL SENT SUCCESSFULLY to:",
        project.student.email

      );
      console.log(" mentor name : ",project.mentor?.userId?.name);
    } catch (emailError) {
      console.error(
        "STATUS EMAIL FAILED:",
        emailError
      );
    }
  }
}

// ========================================
// FEEDBACK EMAIL
// ========================================

if (comment?.trim()) {
  console.log("FEEDBACK EMAIL: Preparing to send...");
  console.log("FEEDBACK EMAIL: Recipient:", project.student?.email);
  console.log("FEEDBACK EMAIL: Comment:", comment.trim());

  if (!project.student?.email) {
    console.error(
      "FEEDBACK EMAIL ERROR: Student email not found."
    );
  } else {
    try {
      await sendMentorFeedbackEmail({
        email: project.student.email,
        studentName: project.student.name,
        projectTitle: project.title,
         mentorName: project.mentor?.userId?.name || "Your Mentor",
        comment: comment.trim(),
      });

      console.log(
        "FEEDBACK EMAIL SENT SUCCESSFULLY to:",
        project.student.email
      );
    } catch (emailError) {
      console.error(
        "FEEDBACK EMAIL FAILED:",
        emailError
      );
    }
  }
}


const updatedProject = await Project.findById(id)
  .populate({
    path: "mentor",
    select: "userId designation",
    populate: {
      path: "userId",
      select: "name email",
    },
  })
  .populate({
    path: "teamMembers",
    select: "fullName profileImage",
    populate: {
      path: "userId",
      select: "name email",
    },
  });

return NextResponse.json(
  {
    success: true,
    message: "Review updated.",
    project: updatedProject,
  },
  { status: 200 },
);
  } catch (error) {
    console.error("MENTOR_REVIEW_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update review." },
      { status: 500 },
    );
  }
}

export async function DELETE(request, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: auth.status },
      );
    }

    // const project = await Project.findById(id);
    const project = await Project.findById(id)
  .populate({
    path: "student",
    select: "name email",
  })
  .populate({
    path: "mentor",
    select: "userId",
    populate: {
      path: "userId",
      select: "name email",
    },
  });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found.",
        },
        { status: 404 },
      );
    }

    // Find logged-in mentor
    const mentorProfile = await Mentor.findOne({
      userId: auth.user._id,
    });

    // Make sure this mentor is assigned to the project
    if (
      !mentorProfile ||
      !project.mentor ||
      project.mentor.toString() !== mentorProfile._id.toString()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not assigned to this project.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const { reviewId } = body;

    if (!reviewId) {
      return NextResponse.json(
        {
          success: false,
          message: "Review ID is required.",
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(project.mentorReviews)) {
      return NextResponse.json(
        {
          success: false,
          message: "No reviews found.",
        },
        { status: 404 },
      );
    }

    // Find the review
    const review = project.mentorReviews.find(
      (item) => item._id.toString() === reviewId,
    );

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found.",
        },
        { status: 404 },
      );
    }

    // Make sure this review belongs to the logged-in mentor
    if (
      !review.reviewedBy ||
      review.reviewedBy.toString() !== mentorProfile._id.toString()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to delete this review.",
        },
        { status: 403 },
      );
    }

    // Remove the review
    project.mentorReviews = project.mentorReviews.filter(
      (item) => item._id.toString() !== reviewId,
    );

    await project.save();

    // Return populated project, same as PATCH
    const updatedProject = await Project.findById(id)
      .populate({
        path: "mentor",
        select: "userId designation",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate({
        path: "teamMembers",
        select: "fullName profileImage",
        populate: {
          path: "userId",
          select: "name email",
        },
      });

    return NextResponse.json(
      {
        success: true,
        message: "Review deleted successfully.",
        project: updatedProject,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("MENTOR_REVIEW_DELETE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete review.",
      },
      { status: 500 },
    );
  }
}