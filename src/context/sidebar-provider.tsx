
"use client"

import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { TooltipProvider } from "@/components/ui/tooltip"

export type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
  isHovering: boolean;
  setIsHovering: (hovering: boolean) => void;
}

export const SidebarContext = React.createContext<SidebarContext | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = false,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)
    const [isHovering, setIsHovering] = React.useState(false);

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    
    // For hover-based sidebar, we determine 'open' by hover state on desktop
    const open = isMobile ? (openProp ?? _open) : isHovering;

    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value;

        if (isMobile) {
            if (setOpenProp) {
              setOpenProp(openState);
            } else {
              _setOpen(openState);
            }
        }
      },
      [setOpenProp, open, isMobile]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
        if (isMobile) {
            setOpenMobile((open) => !open);
        } else {
            // On desktop, click can pin the sidebar. For now, it does nothing with hover.
        }
    }, [isMobile, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === "b" &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
        isHovering,
        setIsHovering,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar, isHovering, setIsHovering]
    )

    return (
        <SidebarContext.Provider value={contextValue}>
          <TooltipProvider delayDuration={0}>
              <div
                  className="group/sidebar-wrapper"
                  ref={ref}
                  {...props}
              >
                  {children}
              </div>
          </TooltipProvider>
        </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"
