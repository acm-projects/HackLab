"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-[8px]", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-[#f1f5f9] text-[#64748b] inline-flex h-[36px] w-fit items-center justify-center rounded-[8px] p-[3px]",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "text-[#1e293b] dark:text-[#94a3b8] inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-[6px] rounded-[6px] border border-transparent px-[8px] py-[6px] text-[14px] font-medium whitespace-nowrap transition-all focus-visible:ring-[3px] focus-visible:ring-[#60a5fa] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[#ffffff] data-[state=active]:text-[#0f172a] data-[state=active]:shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
