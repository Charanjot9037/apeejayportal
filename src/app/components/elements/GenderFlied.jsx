import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Label } from "@/components/ui";
const GenderField=({
  value,
  editing,
  onChange,
  onBlur,
  error,
}) =>{
  return (
    <div>

      <Label
        htmlFor="gender"
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        GENDER
      </Label>

      {editing ? (
        <>
       <Select value={value} onValueChange={onChange} > 
        <SelectTrigger id="gender" className={`h-9 w-full bg-white text-sm text-gray-700 ${ error ? "border-red-500 focus:ring-red-500/20" : "border-gray-300 focus:border-orange-500 focus:ring-orange-500/20" }`} >
         <SelectValue placeholder="Select gender" /> </SelectTrigger>
          <SelectContent> <SelectItem value="Male">Male</SelectItem> 
          <SelectItem value="Female">Female</SelectItem> 
          <SelectItem value="Other">Other</SelectItem> 
          </SelectContent> </Select>
           {error && ( <p className="mt-1 text-sm text-red-500"> {error} </p> )}
        </>
      ) : (
        <p className="min-h-[20px] text-sm leading-5 text-gray-700">
          {value || "-"}
        </p>
      )}

    </div>
  );
}

export default GenderField;