
import { Label,Input } from "@/components/ui";
const InformationField=({
  label,
  name,
  value,
  editing,
  onChange,
  onBlur,
  error,
  type = "text",
}) =>{
  return (
    <div>

      <Label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        {label}
      </Label>

      {editing ? (
        <>
          <Input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`h-9 w-full  border bg-white px-3 text-sm text-gray-700 outline-none transition focus:ring-1 ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-orange-500 focus:ring-orange-500/20"
            }`}
          />

          {error && (
            <p className="mt-1 text-sm text-red-500">
              {error}
            </p>
          )}
        </>
      ) : (
        <p className="min-h-[20px] text-sm leading-5 text-gray-700">
          {value || "-"}
        </p>
      )}

    </div>
  );
}
export default InformationField




