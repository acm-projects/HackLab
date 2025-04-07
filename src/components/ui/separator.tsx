"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-[#e5e7eb] shrink-0",
        "data-[orientation=horizontal]:h-[1px] data-[orientation=horizontal]:w-[100%]",
        "data-[orientation=vertical]:h-[100%] data-[orientation=vertical]:w-[1px]",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
