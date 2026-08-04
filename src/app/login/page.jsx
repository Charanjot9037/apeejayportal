import Image from "next/image";
export default function Login() {
  return (
 <div className="flex justify-center items-center h-screen ">
    <div className="w-1/2 h-full flex flex-col gap-2 justify-center items-center">
        <Image src="/logo.png" alt="Logo" width={200} height={200} />
        <span className="text-2xl font-medium italic">Soaring High Is My Nature</span>
    </div>
    <div className="w-1/2 h-full border">
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
    </div>
 </div>  
    )}