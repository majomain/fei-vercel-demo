"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, Plus, Edit, Trash2, Building, Users, Wrench } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  status: "active" | "inactive" | "maintenance"
  equipmentCount: number
}

const mockLocations: Location[] = [
  {
    id: "1",
    name: "Main Production Facility",
    address: "1234 Industrial Parkway",
    city: "Manufacturing City",
    state: "Michigan",
    status: "active",
    equipmentCount: 45,
  },
  {
    id: "2",
    name: "Warehouse Distribution Center",
    address: "5678 Distribution Ave",
    city: "Logistics Town",
    state: "Ohio",
    status: "active",
    equipmentCount: 28,
  },
  {
    id: "3",
    name: "Quality Control Lab",
    address: "9012 Research Blvd",
    city: "Tech Valley",
    state: "California",
    status: "maintenance",
    equipmentCount: 12,
  },
]

export function LocationManagementSettings() {
  const [locations, setLocations] = useState<Location[]>(mockLocations)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)

  const getStatusBadge = (status: Location["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Maintenance</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const LocationForm = ({
    location,
    onSave,
    onCancel,
  }: {
    location?: Location | null
    onSave: (location: Partial<Location>) => void
    onCancel: () => void
  }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location-name">Location Name *</Label>
        <Input id="location-name" defaultValue={location?.name} placeholder="Enter location name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location-address">Address *</Label>
        <Input id="location-address" defaultValue={location?.address} placeholder="Street address" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location-city">City *</Label>
          <Input id="location-city" defaultValue={location?.city} placeholder="City" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location-state">State/Province *</Label>
          <Input id="location-state" defaultValue={location?.state} placeholder="State" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location-status">Status</Label>
        <Select defaultValue={location?.status || "active"}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location-description">Description</Label>
        <Textarea id="location-description" placeholder="Brief description of this location..." rows={3} />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave({})}>{location ? "Update Location" : "Add Location"}</Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Location Management</h1>
          <p className="text-muted-foreground mt-1">Manage your facilities, sites, and operational locations.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>
                Create a new location to manage equipment and staff across your organization.
              </DialogDescription>
            </DialogHeader>
            <LocationForm onSave={() => setIsAddDialogOpen(false)} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Locations Overview
          </CardTitle>
          <CardDescription>View and manage all your operational locations and facilities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{location.address}</div>
                        <div className="text-muted-foreground">
                          {location.city}, {location.state}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(location.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                        {location.equipmentCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            •••
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingLocation(location)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-muted-foreground">
              {locations.filter((l) => l.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {locations.reduce((sum, location) => sum + location.equipmentCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>
      </div>

      {editingLocation && (
        <Dialog open={!!editingLocation} onOpenChange={() => setEditingLocation(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Location</DialogTitle>
              <DialogDescription>Update the details for {editingLocation.name}.</DialogDescription>
            </DialogHeader>
            <LocationForm
              location={editingLocation}
              onSave={() => setEditingLocation(null)}
              onCancel={() => setEditingLocation(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
