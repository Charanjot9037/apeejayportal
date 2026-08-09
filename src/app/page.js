import HeroSection from "./components/landing/hersection";
import VerifiedProjects from "./components/landing/VerifiedProjects";

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />

      <VerifiedProjects />
    </main>
  );
}