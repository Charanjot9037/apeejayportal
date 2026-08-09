"use client";

const ProjectHeader = () => {
  return (
    <div className="group flex cursor-default flex-col items-center">
      <h2
        className="
          text-4xl
          font-bold
          text-primary
          transition-all
          duration-500
          ease-out
          group-hover:-translate-y-0.5
        "
      >
        Verified Projects
      </h2>

      <div
        className="
          mt-2
          h-0.5
          w-9
          origin-center
          bg-orange-500
          transition-all
          duration-500
          ease-out
          group-hover:w-16
        "
      />
    </div>
  );
};

export default ProjectHeader;