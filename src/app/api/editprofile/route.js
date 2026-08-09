// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import StudentProfile from "@/models/StudentProfile";
// //need updation
// export async function PATCH(req) {
//   try {
//     await connectDB();

//     const { section, data } = await req.json();

//     // Get this from your JWT middleware
//     const userId = req.user.id;

//     if (!section || !data) {
//       return NextResponse.json(
//         { message: "Section and data are required" },
//         { status: 400 }
//       );
//     }

//     let updateData = {};

//     switch (section) {
//       case "personal":
//         updateData = {
//           fullName: data.fullName,
//           phone: data.phone,
//           dateOfBirth: data.dateOfBirth,
//           gender: data.gender,
//           address: data.address,
//         };
//         break;

//       case "skills":
//         updateData = {
//           skills: data.skills,
//           interests: data.interests,
//         };
//         break;

//       case "academic":
//         updateData = {
//           academic: data,
//         };
//         break;

//       case "onlineProfiles":
//         updateData = {
//           onlineProfiles: data,
//         };
//         break;

//       default:
//         return NextResponse.json(
//           { message: "Invalid profile section" },
//           { status: 400 }
//         );
//     }

//     const profile = await StudentProfile.findOneAndUpdate(
//       { userId },
//       { $set: updateData },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!profile) {
//       return NextResponse.json(
//         { message: "Profile not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         message: `${section} updated successfully`,
//         profile,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { message: "Failed to update profile" },
//       { status: 500 }
//     );
//   }
// }