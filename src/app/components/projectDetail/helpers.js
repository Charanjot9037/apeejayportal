/* =========================================================
   STATUS STYLES
========================================================= */

export const statusStyles = {
  "Pending Approval": "bg-yellow-100 text-yellow-700",

  Approved: "bg-green-100 text-green-700",

  Rejected: "bg-red-100 text-red-700",

  Draft: "bg-slate-100 text-slate-600",
};

/* =========================================================
   DATE FORMAT
========================================================= */

export function formatDate(date) {
  if (!date) {
    return "Not available";
  }

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Not available";
  }
}