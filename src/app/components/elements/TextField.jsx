
import { Textarea } from "@/components/ui/textarea";

function TextAreaField({
  label,
  name,
  placeholder,
  formik,
  error,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-medium text-gray-500"
      >
        {label}
      </label>

      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`min-h-[100px] resize-none bg-white text-sm text-gray-700 outline-none focus:ring-1 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-gray-300 focus:border-main-blue focus:ring-main-blue/20"
        }`}
      />

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default TextAreaField;
