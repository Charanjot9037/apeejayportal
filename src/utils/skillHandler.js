export const getSkillList = (skills) => {
  if (Array.isArray(skills)) {
    return skills
      .flatMap((skill) =>
        typeof skill === "string"
          ? skill.split(",")
          : []
      )
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
};