"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Label({
  className,
  required = false,
  children,
  ...props
}) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-1 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}

      {required && (
        <span
          className=" text-orange-500 font-bold text-base" >
          *
        </span>
      )}
    </label>
  );
}

export { Label };