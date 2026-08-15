import { Label, Input } from "@/components/ui";
const InputField = ({
  label,
  name,
  required,
  disabled,
  type = "text",
  placeholder,
  formik,
  error,
}) => {
  return (
    <div>
      <Label
        htmlFor={name}
        className="mb-1.5 block text-xs font-medium text-gray-500"
      >
        {label}
        {required && <span className="ml-1 text-main-blue">*</span>}
      </Label>

      <Input
        id={name}
        name={name}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`h-9 w-full  border bg-white px-3 text-sm text-gray-700 outline-none transition focus:ring-1 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-gray-300 focus:border-main-blue focus:ring-main-blue/20"
        }`}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
