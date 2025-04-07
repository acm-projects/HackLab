import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-[#111827] placeholder:text-[#9ca3af] selection:bg-[#385773] selection:text-[#ffffff]",
        "dark:bg-[#1f2937]/30 border-[#d1d5db] flex h-[36px] w-full min-w-0 rounded-[8px] border bg-transparent px-[12px] py-[6px] text-[14px] shadow-sm transition-[color,box-shadow] outline-none",
        "file:inline-flex file:h-[28px] file:border-0 file:bg-transparent file:text-[13px] file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[#385773] focus-visible:ring-[#385773]/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-[#dc2626]/20 dark:aria-invalid:ring-[#dc2626]/40 aria-invalid:border-[#dc2626]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
