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
  Settings,
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
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
import { DashboardLayout } from "@/components/dashboard-layout"
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
    case "scheduled":
      return {
        text: "SCHEDULED",
        className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
      }
    case "in-progress":
      return {
        text: "IN PROGRESS",
        className: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300",
      }
    case "completed":
      return {
        text: "COMPLETED",
        className: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300",
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

  /* ----- statistics ----- */
  const stats = useMemo(() => {
    let scheduled = 0,
      inProgress = 0,
      completed = 0,
      overdue = 0
    maintenanceEvents.forEach((event) => {
      const eventDate = new Date(event.date)
      const isEventOverdue = event.status !== "completed" && isPast(eventDate) && !isToday(eventDate)
      if (isEventOverdue) overdue++
      else if (event.status === "pending") scheduled++
      else if (event.status === "completed") completed++
    })
    return {
      scheduled,
      inProgress,
      completed,
      overdue,
      totalCost: maintenanceEvents.reduce((sum, event) => sum + event.cost, 0),
    }
  }, [maintenanceEvents])

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
    <DashboardLayout>
      <div className="min-h-full w-full space-y-8 p-6">
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

        {/* statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Settings className="h-5 w-5 text-primary" />
              Maintenance Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <StatCard count={stats.scheduled} label="Scheduled" Icon={Clock} color="blue" />
              <StatCard count={stats.inProgress} label="In Progress" Icon={Wrench} color="orange" />
              <StatCard count={stats.overdue} label="Overdue" Icon={AlertTriangle} color="red" />
              <StatCard count={stats.completed} label="Completed" Icon={CheckCircle} color="green" />
              <StatCard
                count={`$${stats.totalCost.toLocaleString()}`}
                label="Total Cost"
                Icon={XCircle}
                color="purple"
              />
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
          <div className="floating-scroll-buttons">
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
    </DashboardLayout>
  )
}

/* ---------- small sub-component ---------- */
function StatCard({
  count,
  label,
  Icon,
  color,
}: {
  count: number | string
  label: string
  Icon: FC<{ className?: string }>
  color: "blue" | "orange" | "green" | "red" | "purple"
}) {
  const colorMap: Record<typeof color, string> = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-950/40",
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-950/40",
    green: "text-green-600 bg-green-50 dark:bg-green-950/40",
    red: "text-red-600 bg-red-50 dark:bg-red-950/40",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-950/40",
  }
  return (
    <div className={`rounded-lg border p-4 text-center ${colorMap[color]}`}>
      <Icon className="mx-auto mb-2 h-8 w-8" />
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-sm font-medium">{label}</div>
    </div>
  )
}
