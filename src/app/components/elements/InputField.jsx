import { Label, Input } from "@/components/ui";
const InputField = ({
  label,
  name,
  required,
  disabled,
  type = "text",
  placeholder,
  formik,
  icon,
  error,
}) => {
  return (
    <div>
      <Label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-primary"
      >
        {label}
        {required && <span className="ml-1 text-main-blue">*</span>}
      </Label>

      <div className="relative">
        {/* Icon */}
        {icon && (
          <span className="pointer-events-none absolute left-2.5 top-1/2 z-10 -translate-y-1/2 text-primary">
            {icon}
          </span>
        )}

        <Input
          id={name}
          name={name}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`h-10 w-full  border bg-slate-100 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:ring-1 ${
            icon ? "pl-8 pr-3" : "px-3"
          } ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:border-main-blue focus:ring-main-blue/20"
          }`}
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
