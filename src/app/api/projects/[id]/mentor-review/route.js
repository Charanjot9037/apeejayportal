import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/projects";
import Student from "@/models/student";
import { authenticateUser } from "@/lib/authentication";

import {
  sendMentorFeedbackEmail,
  sendMentorStatusUpdateEmail,
} from "@/lib/sendEmail";

const ALLOWED_STATUSES = [
  "Approved",
  "Rejected",
  "Pending Approval",
  "In Review",
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
        { status: auth.status },
      );
    }

    const loggedInUserId = auth.user._id.toString();

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
      })
      .populate({
        path: "mentor2",
        select: "name email",
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

    // =====================================================
    // FIND STUDENT DEPARTMENT
    //
    // Project.student = User._id
    // Student.userId = User._id
    // =====================================================

    const studentRecord = await Student.findOne({
      userId: project.student?._id,
    }).select("department");

    const projectDepartment = studentRecord?.department;

    // =====================================================
    // CHECK ASSIGNED MENTOR
    // =====================================================

    const isMentor =
      project.mentor?._id?.toString() === loggedInUserId;

    // =====================================================
    // CHECK SECOND MENTOR
    // =====================================================

    const isMentor2 =
      project.mentor2?._id?.toString() === loggedInUserId;

    // =====================================================
    // CHECK HOD
    // =====================================================

    const isHOD =
      auth.user?.role === "mentor" &&
      auth.user?.mentor?.designation?.toLowerCase() === "hod" &&
      auth.user?.mentor?.department === projectDepartment;

    // =====================================================
    // AUTHORIZATION
    //
    // Allowed:
    // 1. Assigned mentor
    // 2. Assigned mentor2
    // 3. HOD of student's department
    // =====================================================

    if (!isMentor && !isMentor2 && !isHOD) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to update this project.",
        },
        { status: 403 },
      );
    }

    // =====================================================
    // REQUEST BODY
    // =====================================================

    const body = await request.json();

    const { status, comment } = body;

    // =====================================================
    // VALIDATE STATUS
    // =====================================================

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status value.",
        },
        { status: 400 },
      );
    }

    // =====================================================
    // VALIDATE REQUEST
    // =====================================================

    if (!status && comment === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Provide a status or comment to update.",
        },
        { status: 400 },
      );
    }

    // =====================================================
    // VALIDATE COMMENT
    // =====================================================

    if (comment !== undefined && comment.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Comment cannot be empty.",
        },
        { status: 400 },
      );
    }

    const now = new Date();

    // =====================================================
    // CREATE REVIEW
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
    // ADD REVIEW
    // =====================================================

    if (!Array.isArray(project.mentorReviews)) {
      project.mentorReviews = [];
    }

    project.mentorReviews.push(reviewEntry);

    // =====================================================
    // UPDATE PROJECT
    // =====================================================

    if (status) {
      project.status = status;
    }

    if (comment !== undefined) {
      project.mentorComment = comment.trim();
    }

    project.mentorReviewedAt = now;

    await project.save();

    // =====================================================
    // PERSON WHO PERFORMED ACTION
    // =====================================================

    const reviewerName =
      auth.user?.name || "Mentor";

    // =====================================================
    // STATUS EMAIL
    // =====================================================

    if (status && project.student?.email) {
      try {
        await sendMentorStatusUpdateEmail({
          email: project.student.email,
          studentName: project.student.name,
          projectTitle: project.title,
          mentorName: reviewerName,
          status: project.status,
        });
      } catch (emailError) {
        console.error(
          "STATUS EMAIL FAILED:",
          emailError,
        );
      }
    }

    // =====================================================
    // FEEDBACK EMAIL
    // =====================================================

    if (comment?.trim() && project.student?.email) {
      try {
        await sendMentorFeedbackEmail({
          email: project.student.email,
          studentName: project.student.name,
          projectTitle: project.title,
          mentorName: reviewerName,
          comment: comment.trim(),
        });
      } catch (emailError) {
        console.error(
          "FEEDBACK EMAIL FAILED:",
          emailError,
        );
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
        path: "mentor2",
        select: "name email",
      })
      .populate({
        path: "teamMembers",
        select: "fullName profileImage",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate({
        path: "mentorReviews.reviewedBy",
        select: "name email",
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
    console.error(
      "MENTOR_REVIEW_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to update review.",
      },
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
        { status: 404 },
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
      project.mentor._id.toString() !== auth.user._id.toString()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not assigned to this project.",
        },
        { status: 403 },
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
        { status: 400 },
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
        { status: 404 },
      );
    }

    // =====================================================
    // FIND REVIEW
    // =====================================================

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

    // =====================================================
    // REVIEWED BY = USER ID
    // =====================================================

    if (
      !review.reviewedBy ||
      review.reviewedBy.toString() !== auth.user._id.toString()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to delete this review.",
        },
        { status: 403 },
      );
    }

    // =====================================================
    // REMOVE REVIEW
    // =====================================================

    project.mentorReviews = project.mentorReviews.filter(
      (item) => item._id.toString() !== reviewId,
    );

    await project.save();

    // =====================================================
    // RETURN UPDATED PROJECT
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
