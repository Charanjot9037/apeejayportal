import Image from "next/image";
import Signup from "../components/signup"

export default function Page() {
  return (
 <div className="flex justify-center items-center h-screen ">
    <div className="w-1/2 h-full flex flex-col gap-5 justify-center items-center bg-blue-950">
        <Image src="/logo.png" className="rounded-full" alt="Logo" width={200} height={200} />
        <span className="text-2xl text-white font-inter ">Soaring High Is My Nature</span>
    </div>
    <div className="w-1/2 h-full ">
      <Signup/>
    </div>
 </div>  
    )}