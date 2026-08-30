export const getHODFilterConfig = (department) => {
  if (!department) return [];

  const normalizedDepartment = department.toUpperCase();

  const programs = programOptions[normalizedDepartment] || [];
  const specializations =
    specializationOptions[normalizedDepartment] || [];

  return {
    department: normalizedDepartment,
    programs,
    specializations,
  };
};