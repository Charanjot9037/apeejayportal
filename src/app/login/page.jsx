import Image from "next/image";
import Login from "../components/login";
export default function Page() {
  return (

 <div className="flex  justify-center items-center h-screen ">
<div className="relative flex h-full w-1/2 items-center justify-center bg-gradient-to-br from-blue-950 via-light-primary to-primary px-6 overflow-hidden">

  <div className="flex flex-col px-15 gap-10 items-center justify text-center ">
   <p className="text-2xl  tracking-wide font-serif leading-8 font-bold  text-white">
      Apeejay Institute of Management &  
   Engineering Techincal campus , Jalandhar
    </p>
    {/* Logo */}
    <div >
       
      <Image
        src="/logo.png"
        alt="Apeejay Logo"
        width={200}
        height={200}
        className="rounded-full"
      />
    </div>

    {/* Description */}
    <p className="mt-8 text-xl leading-9 text-white font-serif">
      Join our community of innovators and leaders.
      Start your academic journey today.
    </p>

  </div>
</div>
  <div className="w-1/2 h-full ">     <Login/>
   </div>
   </div>
    )}