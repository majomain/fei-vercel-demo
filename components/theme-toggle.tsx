"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()

  const handleThemeChange = (newTheme: string) => {
    console.log('Changing theme to:', newTheme)
    console.log('Current theme:', theme)
    console.log('Resolved theme:', resolvedTheme)
    setTheme(newTheme)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Debug info - remove this later */}
      <div className="text-xs text-muted-foreground hidden sm:block">
        {theme} / {resolvedTheme}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="theme-dropdown-item" onClick={() => handleThemeChange("light")}>Light</DropdownMenuItem>
          <DropdownMenuItem className="theme-dropdown-item" onClick={() => handleThemeChange("dark")}>Dark</DropdownMenuItem>
          <DropdownMenuItem className="theme-dropdown-item" onClick={() => handleThemeChange("system")}>System</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
