

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/projects";
import { authenticateUser } from "@/lib/authentication";
import {
  sendMentorFeedbackEmail,
  sendMentorStatusUpdateEmail,
} from "@/lib/sendEmail";

const ALLOWED_STATUSES = [
  "Approved",
  "Rejected",
  "Pending Approval",
];

export async function PATCH(request, context) {
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
        { status: auth.status }
      );
    }

    // =====================================================
    // LOGGED-IN USER
    // auth.user._id is the User ID of the logged-in mentor
    // =====================================================

    const loggedInUserId = auth.user._id;



    // =====================================================
    // FIND PROJECT
    //
    // Project.mentor stores User._id
    // Therefore mentor is populated directly as User
    // =====================================================

    const project = await Project.findById(id)
      .populate({
        path: "student",
        select: "name email",
      })
      .populate({
        path: "mentor",
        select: "name email",
      });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found.",
        },
        { status: 404 }
      );
    }

   
    // =====================================================

    if (
      !project.mentor ||
      project.mentor._id.toString() !==
        loggedInUserId.toString()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not assigned to this project.",
        },
        { status: 403 }
      );
    }

    // =====================================================
    // GET REQUEST BODY
    // =====================================================

    const body = await request.json();

    const { status, comment } = body;

    // =====================================================
    // VALIDATE STATUS
    // =====================================================

    if (
      status &&
      !ALLOWED_STATUSES.includes(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status value.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // VALIDATE REQUEST
    // =====================================================

    if (!status && comment === undefined) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Provide a status or comment to update.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // VALIDATE COMMENT
    // =====================================================

    if (
      comment !== undefined &&
      comment.trim() === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Comment cannot be empty.",
        },
        { status: 400 }
      );
    }

    const now = new Date();

    // =====================================================
    // CREATE REVIEW ENTRY
    //
    // reviewedBy stores User._id
    // =====================================================

    const reviewEntry = {
      reviewedBy: loggedInUserId,
      reviewedAt: now,
    };

    if (status) {
      reviewEntry.status = status;
    }

    if (comment !== undefined) {
      reviewEntry.comment = comment.trim();
    }

    // =====================================================
    // INITIALIZE REVIEWS
    // =====================================================

    if (!Array.isArray(project.mentorReviews)) {
      project.mentorReviews = [];
    }

    project.mentorReviews.push(reviewEntry);

    // =====================================================
    // UPDATE CURRENT PROJECT STATE
    // =====================================================

    if (status) {
      project.status = status;
    }

    if (comment !== undefined) {
      project.mentorComment = comment.trim();
    }

    project.mentorReviewedAt = now;

    // =====================================================
    // SAVE
    // =====================================================

    await project.save();

    // =====================================================
    // MENTOR NAME
    //
    // Project.mentor is populated User
    // =====================================================

    const mentorName =
      project.mentor?.name ||
      auth.user.name ||
      "Your Mentor";


    // =====================================================
    // STATUS EMAIL
    // =====================================================

    if (status) {     

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
            mentorName,
            status: project.status,
          });

          console.log(
            "STATUS EMAIL SENT SUCCESSFULLY to:",
            project.student.email
          );
        } catch (emailError) {
          console.error(
            "STATUS EMAIL FAILED:",
            emailError
          );
        }
      }
    }

    // =====================================================
    // FEEDBACK EMAIL
    // =====================================================

    if (comment?.trim()) {
      

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
            mentorName,
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

    // =====================================================
    // GET UPDATED PROJECT
    // =====================================================

    const updatedProject = await Project.findById(id)
      .populate({
        path: "student",
        select: "name email",
      })
      .populate({
        path: "mentor",
        select: "name email",
      })
      .populate({
        path: "teamMembers",
        select: "fullName profileImage",
        populate: {
          path: "userId",
          select: "name email",
        },
      });

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        message: "Review updated.",
        project: updatedProject,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "MENTOR_REVIEW_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to update review.",
      },
      { status: 500 }
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
        { status: auth.status }
      );
    }

    // =====================================================
    // FIND PROJECT
    // =====================================================

    const project = await Project.findById(id)
      .populate({
        path: "student",
        select: "name email",
      })
      .populate({
        path: "mentor",
        select: "name email",
      });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found.",
        },
        { status: 404 }
      );
    }

    // =====================================================
    // CHECK MENTOR ASSIGNMENT
    //
    // Project.mentor = User._id
    // auth.user._id = User._id
    // =====================================================

    if (
      !project.mentor ||
      project.mentor._id.toString() !==
        auth.user._id.toString()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not assigned to this project.",
        },
        { status: 403 }
      );
    }

    // =====================================================
    // GET REVIEW ID
    // =====================================================

    const body = await request.json();

    const { reviewId } = body;

    if (!reviewId) {
      return NextResponse.json(
        {
          success: false,
          message: "Review ID is required.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // CHECK REVIEWS
    // =====================================================

    if (!Array.isArray(project.mentorReviews)) {
      return NextResponse.json(
        {
          success: false,
          message: "No reviews found.",
        },
        { status: 404 }
      );
    }

    // =====================================================
    // FIND REVIEW
    // =====================================================

    const review = project.mentorReviews.find(
      (item) =>
        item._id.toString() === reviewId
    );

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found.",
        },
        { status: 404 }
      );
    }

    // =====================================================
    // REVIEWED BY = USER ID
    // =====================================================

    if (
      !review.reviewedBy ||
      review.reviewedBy.toString() !==
        auth.user._id.toString()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not allowed to delete this review.",
        },
        { status: 403 }
      );
    }

    // =====================================================
    // REMOVE REVIEW
    // =====================================================

    project.mentorReviews =
      project.mentorReviews.filter(
        (item) =>
          item._id.toString() !== reviewId
      );

    await project.save();

    // =====================================================
    // RETURN UPDATED PROJECT
    // =====================================================

    const updatedProject =
      await Project.findById(id)
        .populate({
          path: "student",
          select: "name email",
        })
        .populate({
          path: "mentor",
          select: "name email",
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
        message:
          "Review deleted successfully.",
        project: updatedProject,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "MENTOR_REVIEW_DELETE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to delete review.",
      },
      { status: 500 }
    );
  }
}