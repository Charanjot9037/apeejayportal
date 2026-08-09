export function SectionCard({
  title,
  children,
  className = "",
}) {
  return (
    <section
      className={`
        rounded-md
        border border-[#e1e4e8]
        bg-white
        p-4
        shadow-[0_1px_3px_rgba(0,0,0,0.04)]
        ${className}
      `}
    >
      <h2 className="mb-4 text-[11px] font-semibold text-[#1d456f]">
        {title}
      </h2>

      {children}
    </section>
  );
}