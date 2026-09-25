import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FooterLink from "@/models/footerLinkModel";

// GET
export async function GET() {
  try {
    await connectDB();

    const links = await FooterLink.find({
      isActive: true,
    })
      .sort({ parentId: 1, order: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      links,
    });
  } catch (error) {
    console.error("GET footer links error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch footer links",
      },
      { status: 500 }
    );
  }
}

// POST
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      label,
      href,
      parentId = null,
      order = 0,
      isActive = true,
      openInNewTab = false,
    } = body;

    if (!label?.trim() || !href?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Label and URL are required",
        },
        { status: 400 }
      );
    }

    // Prevent duplicate links under same parent
    const existingLink = await FooterLink.findOne({
      label: label.trim(),
      parentId: parentId || null,
    });

    if (existingLink) {
      return NextResponse.json(
        {
          success: false,
          message: "A link with this name already exists",
        },
        { status: 409 }
      );
    }

    const link = await FooterLink.create({
      label: label.trim(),
      href: href.trim(),
      parentId: parentId || null,
      order,
      isActive,
      openInNewTab,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Footer link added successfully",
        link,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST footer link error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add footer link",
      },
      { status: 500 }
    );
  }
}