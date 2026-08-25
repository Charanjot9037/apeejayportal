// app/api/projects/[id]/mentor-review/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/projects";
import Mentor from "@/models/mentor";
import { authenticateUser } from "@/lib/authentication";

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

    const project = await Project.findById(id);

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

    const project = await Project.findById(id);

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