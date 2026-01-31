"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch inline-flex shrink-0 items-center rounded-full transition-all outline-none",
        "border border-border/70",
        "data-[state=unchecked]:bg-muted/90",
        "data-[state=checked]:bg-primary",
        "dark:data-[state=unchecked]:bg-input/80",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[size=default]:h-[1.25rem] data-[size=default]:w-9",
        "data-[size=sm]:h-4 data-[size=sm]:w-7",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full transition-transform",
          "bg-background shadow-md ring-1 ring-border/70",
          "dark:data-[state=unchecked]:bg-foreground",
          "dark:data-[state=checked]:bg-primary-foreground",
          "group-data-[size=default]/switch:size-4.5",
          "group-data-[size=sm]/switch:size-3.5",
          "data-[state=checked]:translate-x-[calc(100%-2px)]",
          "data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
