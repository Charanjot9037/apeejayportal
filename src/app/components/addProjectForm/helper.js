/* =========================================================
   HELPERS
========================================================= */

export const isEmptyFile = (file) => {
  return !file || typeof file !== "object";
};