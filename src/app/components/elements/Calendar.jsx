import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const YearField = ({
  label,
  name,
  required,
  placeholder = "Select year",
  formik,
  error,
}) => {
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: 50 },
    (_, index) => currentYear - index
  );

  return (
    <div className="w-full">
      <Label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>

      <Select
        value={formik.values[name] || ""}
        onValueChange={(value) => {
          formik.setFieldValue(name, value);
          formik.setFieldTouched(name, true);
        }}
      >
        <SelectTrigger
          id={name}
          className={`h-9 w-full bg-white text-sm ${
            error
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:border-main-blue focus:ring-main-blue/20"
          }`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default YearField;