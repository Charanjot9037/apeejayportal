"use client";
import HeroSection from "./components/landing/hersection";
import VerifiedProjects from "./components/landing/VerifiedProjects";
// import { useRouter } from "next/navigation";

export default function Home() {
  // const router=useRouter();
  //   const handleDiscover = () => {
  //     router.push("/studentSearch");
   
  // };
  //  const handleExplore = () => {
  //     document.getElementById("projects")?.scrollIntoView({
  //       behaviour:"smooth",
  //     });
   
  // };
  return (

    <main className="w-full">
      <HeroSection />
      <VerifiedProjects />
    </main>
  );
}