
"use client";

const ProjectHeader = ({
  title = "Verified Projects",
  subtitle = "",
  titleSize = "text-4xl",
  subtitleSize = "text-base",
}) => {
  return (
    <div className="group flex cursor-default flex-col items-center">
      <h2
        className={`
          ${titleSize}
          text-md 
          md:text-3xl
          font-bold
          text-secondary
          transition-all
          duration-500
          ease-out
          group-hover:-translate-y-0.5
        `}
      >
        {title}
      </h2>

      {subtitle && (
        <p className={`${subtitleSize} mt-2 text-sm md:text-lg  text-slate-500`}>
          {subtitle}
        </p>
      )}

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