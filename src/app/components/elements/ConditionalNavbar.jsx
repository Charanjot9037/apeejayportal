"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Only show Navbar on the landing page
  if (pathname !== "/" && pathname!=="/studentSearch") return null;

  return <Navbar />;
}