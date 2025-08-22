"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

interface Label {
  id: string
  name: string
  color: string
}

interface Equipment {
  id: string
  name: string
  model: string
  location: string
  status: "operational" | "warning" | "critical" | "maintenance"
  label?: Label
}

export function EditEquipmentForm({ equipment, onSave }: { equipment: Equipment | null; onSave: () => void }) {
  const [editedEquipment, setEditedEquipment] = useState(equipment)
  const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false)
  const [newLabelName, setNewLabelName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#3b82f6")
  const [availableLabels, setAvailableLabels] = useState<Label[]>([
    { id: "1", name: "Front of House", color: "#3b82f6" },
    { id: "2", name: "Back of House", color: "#10b981" },
    { id: "3", name: "Kitchen", color: "#f97316" },
  ])

  if (!editedEquipment) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedEquipment({ ...editedEquipment, [name]: value })
  }

  const handleStatusChange = (value: string) => {
    setEditedEquipment({ ...editedEquipment, status: value as Equipment["status"] })
  }

  const handleLabelChange = (value: string) => {
    if (value === "add-new") {
      setIsLabelDialogOpen(true)
    } else {
      const selectedLabel = availableLabels.find((label) => label.id === value)
      setEditedEquipment({ ...editedEquipment, label: selectedLabel })
    }
  }

  const handleSaveNewLabel = () => {
    if (newLabelName.trim()) {
      const newLabel: Label = {
        id: Date.now().toString(),
        name: newLabelName.trim(),
        color: selectedColor,
      }
      setAvailableLabels([...availableLabels, newLabel])
      setEditedEquipment({ ...editedEquipment, label: newLabel })
      setNewLabelName("")
      setSelectedColor("#3b82f6")
      setIsLabelDialogOpen(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Updated equipment:", editedEquipment)
    onSave()
  }

  const predefinedColors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f97316", // orange
    "#8b5cf6", // purple
    "#ef4444", // red
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f59e0b", // amber
  ]

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name">Name</label>
          <Input id="name" name="name" value={editedEquipment.name} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="model">Model</label>
          <Input id="model" name="model" value={editedEquipment.model} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="location">Location</label>
          <Input id="location" name="location" value={editedEquipment.location} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <Select value={editedEquipment.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="label" className="text-sm font-medium">
            Label
          </label>
          <Select value={editedEquipment.label?.id || ""} onValueChange={handleLabelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a label">
                {editedEquipment.label && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: editedEquipment.label.color }} />
                    {editedEquipment.label.name}
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableLabels.map((label) => (
                <SelectItem key={label.id} value={label.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: label.color }} />
                    {label.name}
                  </div>
                </SelectItem>
              ))}
              <SelectItem value="add-new">
                <div className="flex items-center gap-2 text-blue-600">
                  <Plus className="w-3 h-3" />
                  Add new label
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Save Changes</Button>
      </form>

      <Dialog open={isLabelDialogOpen} onOpenChange={setIsLabelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Label</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="labelName" className="text-sm font-medium">
                Label Name
              </label>
              <Input
                id="labelName"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="Enter label name"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Color</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? "border-gray-900" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsLabelDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNewLabel} disabled={!newLabelName.trim()}>
                Save Label
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
