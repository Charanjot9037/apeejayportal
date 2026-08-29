import User from "@/models/user";
import Mentor from "@/models/mentor";
import { authenticateUser } from "@/lib/authentication";

export async function getHODContext() {
  const auth = await authenticateUser();

  if (!auth?.success || !auth?.user?._id) {
    return {
      success: false,
      response: {
        message: auth?.message || "Unauthorized",
        status: auth?.status || 401,
      },
    };
  }

  const user = await User.findById(auth.user._id).lean();

  if (!user) {
    return {
      success: false,
      response: {
        message: "User not found",
        status: 404,
      },
    };
  }

  if (user.role?.trim().toLowerCase() !== "mentor") {
    return {
      success: false,
      response: {
        message: "Access denied",
        status: 403,
      },
    };
  }

  const mentor = await Mentor.findOne({
    userId: user._id,
  }).lean();

  if (!mentor) {
    return {
      success: false,
      response: {
        message: "Mentor profile not found",
        status: 404,
      },
    };
  }

  if (
    mentor.designation?.trim().toLowerCase() !== "hod"
  ) {
    return {
      success: false,
      response: {
        message: "Only HODs can access this dashboard",
        status: 403,
      },
    };
  }

  const department = mentor.department?.trim();

  if (!department) {
    return {
      success: false,
      response: {
        message: "HOD department not found",
        status: 400,
      },
    };
  }

  return {
    success: true,
    user,
    mentor,
    department,
    normalizedDepartment: department.toLowerCase(),
  };
}