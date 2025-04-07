import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[8px] whitespace-nowrap rounded-[6px] text-[14px] font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(59,130,246,0.5)] aria-invalid:ring-[rgba(239,68,68,0.2)] dark:aria-invalid:ring-[rgba(239,68,68,0.4)] aria-invalid:border-[#ef4444]",
  {
    variants: {
      variant: {
        default: "bg-[#3B82F6] text-[#ffffff] shadow-sm hover:bg-[#2563eb]",
        destructive:
          "bg-[#ef4444] text-[#ffffff] shadow-sm hover:bg-[#dc2626] focus-visible:ring-[rgba(239,68,68,0.2)] dark:focus-visible:ring-[rgba(239,68,68,0.4)]",
        outline:
          "border border-[#d1d5db] bg-[#ffffff] shadow-sm hover:bg-[#f3f4f6] dark:bg-[#374151] dark:border-[#4b5563] dark:hover:bg-[#4b5563]",
        secondary:
          "bg-[#e5e7eb] text-[#111827] shadow-sm hover:bg-[#d1d5db]",
        ghost:
          "hover:bg-[#f3f4f6] text-[#1f2937] dark:hover:bg-[#374151]",
        link: "text-[#3B82F6] underline underline-offset-[4px] hover:opacity-80",
      },
      size: {
        default: "h-[36px] px-[16px] py-[8px]",
        sm: "h-[32px] rounded-[6px] gap-[6px] px-[12px] py-[6px]",
        lg: "h-[40px] rounded-[8px] px-[24px] py-[10px]",
        icon: "w-[36px] h-[36px] p-[6px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
