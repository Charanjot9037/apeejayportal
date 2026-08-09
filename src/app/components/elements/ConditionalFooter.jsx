"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Only show Navbar on the landing page
  if (pathname !== "/" && pathname!=='/studentSearch') return null;

  return <Footer />;
}