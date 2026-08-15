"use client";

import TeamInput from "../../TeamInput";

/* =========================================================
   TEAM MEMBER CARD
========================================================= */

export default function TeamMemberCard({
  member,
  index,
  canRemove,
  onRemove,
  getTeamError,
  onFieldChange,
  onFieldBlur,
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-700">
          Team Member {index + 1}
        </h4>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TeamInput
          label="Member Name"
          required
          value={member.name}
          placeholder="Enter member name"
          error={getTeamError(index, "name")}
          onChange={(value) => onFieldChange(index, "name", value)}
          onBlur={() => onFieldBlur(index, "name")}
        />

        <TeamInput
          label="Enrollment / Student ID"
          required
          value={member.enrollment}
          placeholder="Enter enrollment number"
          error={getTeamError(index, "enrollment")}
          onChange={(value) => onFieldChange(index, "enrollment", value)}
          onBlur={() => onFieldBlur(index, "enrollment")}
        />

        <TeamInput
          label="Email"
          type="email"
          value={member.email}
          placeholder="member@example.com"
          error={getTeamError(index, "email")}
          onChange={(value) => onFieldChange(index, "email", value)}
          onBlur={() => onFieldBlur(index, "email")}
        />

        <TeamInput
          label="Role / Contribution"
          value={member.role}
          placeholder="e.g. Frontend Developer"
          onChange={(value) => onFieldChange(index, "role", value)}
          onBlur={() => onFieldBlur(index, "role")}
        />
      </div>
    </div>
  );
}