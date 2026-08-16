"use client";

import SideCard from "../SideCard";
import { formatDate } from "../../helpers";

/* =========================================================
   APPROVAL HISTORY SECTION
========================================================= */

export default function ApprovalHistorySection({ project }) {
  return (
    <SideCard title="Approval History">
      <div className="relative ml-1 border-l border-slate-200 pl-4">
        <div className="relative pb-4">
          <span className="absolute -left-[21px] top-0 h-2 w-2 rounded-full bg-blue-600" />

          <p className="text-[9px] font-medium text-slate-700">
            Project Submitted
          </p>

          <p className="mt-0.5 text-[8px] text-slate-400">
            {project.createdAt
              ? formatDate(project.createdAt)
              : "Date unavailable"}
          </p>
        </div>

        {project.status === "Approved" && (
          <div className="relative">
            <span className="absolute -left-[21px] top-0 h-2 w-2 rounded-full bg-green-500" />

            <p className="text-[9px] font-medium text-slate-700">
              Project Approved
            </p>

            <p className="mt-0.5 text-[8px] text-slate-400">Current Status</p>
          </div>
        )}

        {project.status === "Rejected" && (
          <div className="relative">
            <span className="absolute -left-[21px] top-0 h-2 w-2 rounded-full bg-red-500" />

            <p className="text-[9px] font-medium text-slate-700">
              Project Rejected
            </p>

            <p className="mt-0.5 text-[8px] text-slate-400">Current Status</p>
          </div>
        )}

        {project.status === "Pending Approval" && (
          <div className="relative">
            <span className="absolute -left-[21px] top-0 h-2 w-2 rounded-full bg-yellow-500" />

            <p className="text-[9px] font-medium text-slate-700">
              Awaiting Approval
            </p>

            <p className="mt-0.5 text-[8px] text-slate-400">Placement Cell</p>
          </div>
        )}
      </div>
    </SideCard>
  );
}