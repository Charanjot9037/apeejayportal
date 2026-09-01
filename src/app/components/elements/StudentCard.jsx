// "use client";

// import Link from "next/link";
// import { getSkillList } from "@/utils/skillHandler";

// import { BriefcaseBusiness, CheckCircle2 } from "lucide-react";

// const StudentCard = ({ student, onSave }) => {
//   const {
//     _id,
//     fullName,
//     profileImage,
//     program,
//     currentSemester,
//     skills = [],
//   } = student;


//   const skillList = getSkillList(skills);

//   return (
//     <div
//       className="
//         group
//         w-75
//         overflow-hidden
//         rounded-xl
//         border
//         border-slate-200
//         bg-white
//         shadow-sm

//         transition-all
//         duration-300
//         ease-out

//         hover:-translate-y-1
//         hover:border-slate-300
//         hover:shadow-lg
//       "
//     >
//       <div
//         className="
//     relative
//     overflow-hidden
//     bg-slate-100
//      h-75
//      w-75
//      flex
//   "
//       >
//         {profileImage ? (
//           <img
//             src={profileImage}
//             alt={fullName || "Student"}
//             sizes="(max-width: 768px) 100vw, 33vw"
//             className="
//       object-fill
//       h-full
//       w-full
//         transition-transform
//         duration-500
//         ease-out
//         group-hover:scale-[1.03]
//       "
//           />
//         ) : (
//           <div className="flex h-full w-full items-center justify-center text-slate-400">
//             No profile image
//           </div>
//         )}

//         <div
//           className="
//       pointer-events-none
//       absolute
//       inset-0
//       bg-gradient-to-t
//       from-black/10
//       via-transparent
//       to-transparent
//     "
//         />
//       </div>

//       {/* ================= Content ================= */}

//       <div className="p-4">
//         {/* Name */}

//         <div className="flex items-center gap-1.5">
//           <p
//             className="
//               truncate
//               text-lg
//               font-semibold
//               text-[#064a82]

//               transition-colors
//               duration-200

//               group-hover:text-[#053b68]
//             "
//           >
//             {fullName}
//           </p>

//           <CheckCircle2
//             className="
//               h-3.5
//               w-3.5
//               shrink-0
//               fill-[#064a82]
//               text-white
//             "
//           />
//         </div>

//         {/* Course */}

//         <p
//           className="
//             mt-1
//             truncate
//             text-sm
//             text-slate-500
//           "
//         >
//           {program} • Semester {currentSemester}
//         </p>
//         {/* ================= Skills ================= */}

// <div className="mt-3 flex h-7 w-full items-center gap-1.5 overflow-hidden">
//   {skillList.slice(0, 4).map((skill, index) => (
//     <span
//       key={`${skill}-${index}`}
//       className="
//         shrink-0
//         max-w-[75px]
//         truncate
//         rounded-full
//         border
//         border-slate-200
//         bg-slate-50
//         px-2.5
//         py-1
//         text-xs
//         font-medium
//         text-slate-600
//       "
//       title={skill}
//     >
//       {skill}
//     </span>
//   ))}

//   {skillList.length > 4 && (
//     <span
//       className="
//         shrink-0
//         rounded-full
//         border
//         border-[#064a82]/10
//         bg-[#064a82]/5
//         px-2.5
//         py-1
//         text-xs
//         font-medium
//         text-[#064a82]
//       "
//     >
//       +{skillList.length - 4}
//     </span>
//   )}
// </div>

//         {/* ================= Actions ================= */}

//         <div className="pt-3">
//           <Link
//             href={`/view-profile/${_id}`}
//             className="
//               flex
//               h-10
//               w-full
//               items-center
//               justify-center
//               rounded-md
//               bg-[#064a82]
//               px-3
//               text-sm
//               font-semibold
//               text-white

//               transition-all
//               duration-300
//               ease-out

//               hover:bg-[#053b68]
//               hover:shadow-md

//               active:scale-[0.98]

//               focus:outline-none
//               focus:ring-2
//               focus:ring-[#064a82]/20
//             "
//           >
//             View Profile
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentCard;




"use client";

import Link from "next/link";
import { getSkillList } from "@/utils/skillHandler";

import {
  CheckCircle2,
  GraduationCap,
  MapPin,
  CalendarDays,
  Hash,
  BriefcaseBusiness,
} from "lucide-react";

const StudentCard = ({ student, onSave }) => {
  const {
    _id,
    fullName,
    profileImage,
    program,
    department,
    specialization,
    academicBatch,
    lastYear,
    rollNumber,
    skills = [],
    interests = [],
  } = student;

  const skillList = getSkillList(skills);

  return (
    <div
      className="
        group
        w-[96%]
        md:w-75
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        shadow-sm

        transition-all
        duration-300
        ease-out

        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-lg
      "
    >
      {/* =====================================================
          PROFILE IMAGE
      ===================================================== */}

      <div
        className="
          relative
          h-80 md:h-75
          w-full md:w-75
          overflow-hidden
          bg-slate-100
        "
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt={fullName || "Student"}
            className="
              h-full
              w-full
              object-fill

              transition-transform
              duration-500
              ease-out

              group-hover:scale-[1.03]
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              bg-slate-50
            "
          >
            <span
              className="
                text-4xl
                font-semibold
                uppercase
                text-[#064a82]
              "
            >
              {fullName?.charAt(0) || "S"}
            </span>
          </div>
        )}

        {/* Image Overlay */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/10
            via-transparent
            to-transparent
          "
        />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="p-4">

        {/* ===================================================
            NAME
        =================================================== */}

        <div className="flex items-center gap-1.5">
          <p
            className="
              truncate
              text-lg
              font-semibold
              text-[#064a82]

              transition-colors
              duration-200

              group-hover:text-[#053b68]
            "
          >
            {fullName || "Unknown Student"}
          </p>

          <CheckCircle2
            className="
              h-3.5
              w-3.5
              shrink-0
              fill-[#064a82]
              text-white
            "
          />
        </div>

        {/* ===================================================
            PROGRAM + SPECIALIZATION
        =================================================== */}

        <div className="mt-1 flex items-center gap-1.5">
          <GraduationCap
            className="
              h-3.5
              w-3.5
              shrink-0
              text-slate-400
            "
          />

          <p
            className="
              truncate
              text-sm
              font-medium
              text-slate-600
            "
          >
            {program || "Program not specified"}
          </p>

          {specialization && (
            <>
              <span className="text-slate-300">•</span>

              <p
                className="
                  truncate
                  text-sm
                  text-slate-500
                "
              >
                {specialization.replaceAll("_", " ")}
              </p>
            </>
          )}
        </div>

        {/* ===================================================
            ACADEMIC INFORMATION
        =================================================== */}

        <div
          className="
            mt-3
            grid
            grid-cols-2
            gap-2
          "
        >

          {/* Roll Number */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-1.5
              rounded-md
              bg-slate-50
              px-2
              py-1.5
            "
          >
            <Hash
              className="
                h-3.5
                w-3.5
                shrink-0
                text-[#064a82]
              "
            />

            <div className="min-w-0">
              <p
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Roll No.
              </p>

              <p
                className="
                  truncate
                  text-[11px]
                  font-medium
                  text-slate-700
                "
              >
                {rollNumber || "N/A"}
              </p>
            </div>
          </div>

          {/* Graduation */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-1.5
              rounded-md
              bg-slate-50
              px-2
              py-1.5
            "
          >
            <GraduationCap
              className="
                h-3.5
                w-3.5
                shrink-0
                text-[#064a82]
              "
            />

            <div className="min-w-0">
              <p
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Graduation
              </p>

              <p
                className="
                  truncate
                  text-[11px]
                  font-medium
                  text-slate-700
                "
              >
                {lastYear || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            SKILLS
        =================================================== */}

        <div className="mt-3">
          <p
            className="
              mb-1.5
              text-[10px]
              font-semibold
              uppercase
              tracking-wide
              text-slate-400
            "
          >
            Technologies
          </p>

          <div
            className="
              flex
              h-7
              w-full
              items-center
              gap-1.5
              overflow-hidden
            "
          >
            {skillList.length > 0 ? (
              skillList.slice(0, 4).map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  title={skill}
                  className="
                    max-w-[75px]
                    shrink-0
                    truncate
                    rounded-full
                    border
                    border-slate-200
                    bg-slate-50
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    text-slate-600
                  "
                >
                  {skill}
                </span>
              ))
            ) : (
              <span
                className="
                  text-xs
                  text-slate-400
                "
              >
                No technologies added
              </span>
            )}

            {skillList.length > 4 && (
              <span
                className="
                  shrink-0
                  rounded-full
                  border
                  border-[#064a82]/10
                  bg-[#064a82]/5
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-[#064a82]
                "
              >
                +{skillList.length - 4}
              </span>
            )}
          </div>
        </div>


        {/* ===================================================
            ACTION
        =================================================== */}

        <div className="pt-3">
          <Link
            href={`/view-profile/${_id}`}
            className="
              flex
              h-10
              w-full
              items-center
              justify-center
              rounded-md
              bg-[#064a82]
              px-3
              text-sm
              font-semibold
              text-white

              transition-all
              duration-300
              ease-out

              hover:bg-[#053b68]
              hover:shadow-md

              active:scale-[0.98]

              focus:outline-none
              focus:ring-2
              focus:ring-[#064a82]/20
            "
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
