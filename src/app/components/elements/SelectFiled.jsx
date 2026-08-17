import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SelectField({ label, name, value, onChange, onBlur, error, options }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-primary"
      >
        {label}
      </label>

      <Select
        className="rounded-md h-10"
        value={value}
        onValueChange={(selectedValue) => {
          onChange(selectedValue);
          onBlur?.();
        }}
      >
        <SelectTrigger
          id={name}
          className={`h-10 w-full bg-slate-100 text-sm text-gray-700 ${
            error
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:border-main-blue focus:ring-main-blue/20"
          }`}
        >
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default SelectField;
