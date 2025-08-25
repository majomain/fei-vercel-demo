"use client"

import type { FC } from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  ArrowUp,
  ArrowDown,
  Wrench,
} from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isPast,
} from "date-fns"

import type { MaintenanceEvent } from "@/components/unified-maintenance-scheduler"
import { MaintenanceSchedule } from "@/components/maintenance-schedule"

/* ---------- types / constants ---------- */

/* ---------- helper utilities ---------- */

const getStatusInfo = (event: MaintenanceEvent): { text: string; className: string } => {
  const isEventOverdue = event.status !== "completed" && isPast(new Date(event.date)) && !isToday(new Date(event.date))
  if (isEventOverdue) {
    return {
      text: "OVERDUE",
      className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300",
    }
  }
  switch (event.status) {
    case "pending":
      return {
        text: "SCHEDULED",
        className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
      }
    case "completed":
      return {
        text: "COMPLETED",
        className: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300",
      }
    case "overdue":
      return {
        text: "OVERDUE",
        className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300",
      }
    default:
      return { text: "UNKNOWN", className: "bg-gray-100 text-gray-800" }
  }
}

/* ---------- main component ---------- */

export default function MaintenancePage() {
  /* ----- local state ----- */

  const [maintenanceEvents, setMaintenanceEvents] = useState<MaintenanceEvent[]>([
    {
      id: "1",
      equipmentId: "1",
      equipmentName: "Display Freezer 1",
      date: new Date(new Date().setDate(15)).toISOString(),
      description: "Replace worn conveyor belt and inspect alignment",
      priority: "high",
      status: "pending",
      assignedStaff: "John Smith",
      impact: 15,
      cost: 500,
    },
    {
      id: "2",
      equipmentId: "2",
      equipmentName: "Ice Cream Maker 1",
      date: new Date(new Date().setDate(22)).toISOString(),
      description: "Change hydraulic fluid and replace filters",
      priority: "medium",
      status: "pending",
      assignedStaff: "Sarah Johnson",
      impact: 10,
      cost: 200,
    },
  ])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showScrollButtons, setShowScrollButtons] = useState(false)

  /* filters / dialogs / UI state */
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterEquipment, setFilterEquipment] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  /* dialog toggles */
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<MaintenanceEvent | null>(null)

  /* ----- scroll detection ----- */

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setShowScrollButtons(scrollTop > 300)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (pos: "top" | "bottom") => {
    if (pos === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      )
      window.scrollTo({ top: documentHeight, behavior: "smooth" })
    }
  }

  /* ----- calendar helpers ----- */

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const getCalendarDays = () => eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) })



  /* ----- CRUD & EVENT HANDLERS ----- */
  const handleSaveEvent = (eventData: Omit<MaintenanceEvent, "id">) => {
    if (editingEvent) {
      // Update existing event
      setMaintenanceEvents(maintenanceEvents.map((e) => (e.id === editingEvent.id ? { ...eventData, id: e.id } : e)))
    } else {
      // Add new event
      setMaintenanceEvents([...maintenanceEvents, { ...eventData, id: Date.now().toString() }])
    }
    setIsFormOpen(false)
    setEditingEvent(null)
  }

  const handleOpenForm = (event: MaintenanceEvent | null) => {
    setEditingEvent(event)
    setIsFormOpen(true)
  }

  const handleDeleteEvent = (eventId: string) => {
    setMaintenanceEvents(maintenanceEvents.filter((e) => e.id !== eventId))
  }

  /* ---------- UI ---------- */

  return (
    <div className="space-y-6">
        {/* calendar first */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
                <CalendarIcon className="h-6 w-6 text-primary" />
                Maintenance Calendar
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="min-w-[140px] text-center font-medium">{format(currentMonth, "MMMM yyyy")}</span>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="rounded bg-muted p-2 text-center text-sm font-semibold">
                  {d}
                </div>
              ))}

              {getCalendarDays().map((day) => {
                const events = maintenanceEvents.filter((e) => isSameDay(new Date(e.date), day))
                const today = isToday(day)
                return (
                  <div
                    key={day.toString()}
                    className={`min-h-[110px] rounded border p-2 ${
                      today ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    <div className={`mb-1 text-sm font-medium ${today && "text-primary"}`}>{format(day, "d")}</div>
                    {events.slice(0, 3).map((e) => (
                      <div
                        key={e.id}
                        className={`truncate rounded border px-1 text-xs ${getStatusInfo(e).className}`}
                        title={e.equipmentName}
                      >
                        {e.equipmentName}
                      </div>
                    ))}
                    {events.length > 3 && (
                      <div className="text-xs text-muted-foreground">+{events.length - 3} more</div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>



        {/* Maintenance Schedule Workflow - WORKING VERSION */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Wrench className="h-5 w-5 text-primary" />
              Maintenance Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MaintenanceSchedule />
          </CardContent>
        </Card>

        {/* floating scroll buttons */}
        {showScrollButtons && (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <Button
              onClick={() => scrollTo("top")}
              className="h-12 w-12 rounded-full bg-primary shadow-lg hover:bg-primary/90"
              title="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollTo("bottom")}
              className="h-12 w-12 rounded-full bg-background shadow-lg"
              title="Scroll to bottom"
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
  )
}


