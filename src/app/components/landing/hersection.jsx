"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";


const HeroSection = ({
  backgroundImage = "/landing-page/image.png",

  title = "Discover the Next Generation of Talent",

  description = (
    <>
      Access a curated portfolio of rigorous, mentor-verified academic projects.
      <br />
      Connect with industry-ready graduates from Apeejay Institute of Management &
      <br />
      Engineering.
    </>
  ),

  primaryButtonText = "Discover Student Talent",
  secondaryButtonText = "Explore Verified Projects",

  searchPlaceholder =
    "Search by skill, project title, or department...",

  onPrimaryClick,
  onSecondaryClick,
  onSearch,
}) => {
  const [search, setSearch] = useState("");

  const router = useRouter();

  // Discover Student Talent

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
      return;
    }

    router.push("/studentSearch");
  };

  // Explore Verified Projects

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
      return;
    }

    const section = document.getElementById("projects");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };


  const handleSearch = () => {
    const searchValue = search.trim();

    if (!searchValue) {
      router.push("/studentSearch");
      return;
    }

    if (onSearch) {
      onSearch(searchValue);
    }

    router.push(
      `/studentSearch?search=${encodeURIComponent(searchValue)}`
    );
  };


   

  return (
    <div className="relative w-full  min-h-screen bg-cover bg-center"  style={{
          backgroundImage: `url(${backgroundImage})`,
        }}>


      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 gap-0 lg:gap-2 backdrop-blur-sm/10 flex  flex-col items-center justify-center px-6  py-20 lg:py-40  text-center">

   <div className="max-w-3xl">
  <div className="animate-typing-wrapper">
    <p
      className="
        text-3xl
        font-semibold
        leading-tight
        tracking-tight
        text-white
        md:text-4xl
      "
    >
      {title}
    </p>
  </div>
</div>

        {/* Description */}
        <div className="mt-4 max-w-3xl">
          <p className="text-sm font-light leading-6 text-white/90 md:text-base">
            {description}
          </p>
        </div>

        {/* CTA Buttons */}
        
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">

  {/* Primary Button */}
  <Button
    onClick={handlePrimaryClick}
    className="
      h-10
      rounded-none
      bg-orange-500
      px-7
      text-sm
      font-medium
      text-white
      shadow-md

      cursor-pointer

      transition-all
      duration-500
      ease-out

      hover:scale-105
      hover:bg-orange-600
      hover:shadow-lg

      animate-button-left
    "
  >
    {primaryButtonText}
  </Button>

  {/* Secondary Button */}
  <Button
    onClick={handleSecondaryClick}
    className="
      h-10
      rounded-none
      bg-primary
      px-7
      text-sm
      font-medium
      text-white
      shadow-md

      cursor-pointer

      transition-all
      duration-500
      ease-out

      hover:scale-105
      hover:bg-primary/90
      hover:shadow-lg

      animate-button-right
    "
  >
    {secondaryButtonText}
  </Button>

</div>

        {/* Search Container */}
        <div className="mt-7 w-full max-w-[470px] hover:scale-105 transition-all duration-500 ease-in-out delay-75">

          <div className="flex h-11 items-center rounded-full bg-white p-1.5 shadow-xl">

            {/* Input */}
            <div className="relative flex-1">

              <Search
                size={17}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder={searchPlaceholder}
                className="
                  h-8
                  border-0
                  bg-transparent
                  pl-9
                  pr-2
                  text-xs
                  text-slate-700
                  shadow-none
                  focus-visible:ring-0
                "
              />

            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="
                h-8
                rounded-full
                bg-primary
                hover-cursor-pointer
                px-5
                text-xs
                font-medium
                text-white
                hover:bg-primary/90
              "
            >
              Search
            </Button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default HeroSection;
