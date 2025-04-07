import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[6px] border px-[8px] py-[2px] text-[12px] font-[500] w-fit whitespace-nowrap shrink-0 [&>svg]:w-[12px] [&>svg]:h-[12px] gap-[4px] [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#385773] text-[#ffffff] hover:bg-[#2d445f]",
        secondary:
          "border-transparent bg-[#EEF2F7] text-[#1e293b] hover:bg-[#e2e8f0]",
        destructive:
          "border-transparent bg-[#dc2626] text-[#ffffff] hover:bg-[#b91c1c]",
        outline:
          "border-[#cbd5e1] text-[#1e293b] hover:bg-[#f8fafc] hover:text-[#0f172a]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
