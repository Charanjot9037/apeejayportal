import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/config/db";
import FooterLink from "@/app/lib/models/footerLinkModel";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid link ID",
        },
        { status: 400 }
      );
    }

    const link = await FooterLink.findById(id);

    if (!link) {
      return NextResponse.json(
        {
          success: false,
          message: "Footer link not found",
        },
        { status: 404 }
      );
    }

    const {
      label,
      href,
      parentId,
      order,
      isActive,
      openInNewTab,
    } = body;

    // Prevent link from becoming its own parent
    if (parentId && parentId === id) {
      return NextResponse.json(
        {
          success: false,
          message: "A link cannot be its own parent",
        },
        { status: 400 }
      );
    }

    link.label = label?.trim() ?? link.label;
    link.href = href?.trim() ?? link.href;
    link.parentId = parentId || null;
    link.order = order ?? link.order;
    link.isActive = isActive ?? link.isActive;
    link.openInNewTab = openInNewTab ?? link.openInNewTab;

    await link.save();

    return NextResponse.json({
      success: true,
      message: "Footer link updated successfully",
      link,
    });
  } catch (error) {
    console.error("PUT footer link error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update footer link",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid link ID",
        },
        { status: 400 }
      );
    }

    // Delete children as well
    await FooterLink.deleteMany({
      $or: [{ _id: id }, { parentId: id }],
    });

    return NextResponse.json({
      success: true,
      message: "Footer link deleted successfully",
    });
  } catch (error) {
    console.error("DELETE footer link error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete footer link",
      },
      { status: 500 }
    );
  }
}