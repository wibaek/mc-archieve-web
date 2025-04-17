"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const SidebarContext = React.createContext<{
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}>({
  expanded: true,
  setExpanded: () => undefined,
})

export function SidebarProvider({
  children,
  defaultExpanded = true,
}: {
  children: React.ReactNode
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">{children}</div>
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = React.useContext(SidebarContext)

  return (
    <aside
      className={cn(
        "group relative flex h-full flex-col border-r bg-background p-2 transition-all duration-300",
        expanded ? "md:w-72" : "md:w-16",
        className,
      )}
    >
      {children}
    </aside>
  )
}

export function SidebarHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = React.useContext(SidebarContext)

  return (
    <div
      className={cn("flex h-14 items-center border-b px-4", expanded ? "justify-between" : "justify-center", className)}
    >
      {expanded ? children : null}
    </div>
  )
}

export function SidebarHeaderTitle({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-lg font-semibold tracking-tight", className)}>{children}</div>
}

export function SidebarContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-auto py-2", className)}>{children}</div>
}

export function SidebarGroup({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pb-4", className)}>{children}</div>
}

export function SidebarGroupLabel({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = React.useContext(SidebarContext)

  return expanded ? (
    <div className={cn("mb-2 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground", className)}>
      {children}
    </div>
  ) : null
}

export function SidebarGroupContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)}>{children}</div>
}

export function SidebarMenu({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)}>{children}</div>
}

export function SidebarMenuItem({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)}>{children}</div>
}

export function SidebarMenuSub({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pl-6", className)}>{children}</div>
}

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  asChild?: boolean
}

export function SidebarMenuButton({ className, children, isActive, ...props }: SidebarMenuButtonProps) {
  const { expanded } = React.useContext(SidebarContext)

  return (
    <Button
      variant="ghost"
      className={cn(
        "flex h-10 w-full items-center justify-start gap-2 rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-accent text-accent-foreground",
        !expanded && "justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

export interface SidebarMenuBadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenuBadge({ className, children }: SidebarMenuBadgeProps) {
  const { expanded } = React.useContext(SidebarContext)

  return expanded ? (
    <div
      className={cn(
        "ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground",
        className,
      )}
    >
      {children}
    </div>
  ) : null
}

export function SidebarRail({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded, setExpanded } = React.useContext(SidebarContext)

  return (
    <div
      className={cn(
        "absolute right-0 top-0 h-full w-1 -translate-x-1/2 bg-transparent transition-all duration-300 group-hover:w-1 group-hover:bg-accent",
        className,
      )}
    >
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-8 h-6 w-6 -translate-x-1/2 rotate-0 scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:focus-visible:ring-1 group-hover:focus-visible:ring-ring"
        onClick={() => setExpanded(!expanded)}
      >
        <ChevronLeft className={cn("h-3 w-3 transition-transform", expanded ? "rotate-0" : "rotate-180")} />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    </div>
  )
}

export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { expanded, setExpanded } = React.useContext(SidebarContext)

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("h-9 w-9", className)}
      onClick={() => setExpanded(!expanded)}
      {...props}
    >
      <ChevronLeft className={cn("h-4 w-4 transition-transform", expanded ? "rotate-0" : "rotate-180")} />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

export function SidebarInset({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex h-full flex-col", className)}>{children}</div>
}
