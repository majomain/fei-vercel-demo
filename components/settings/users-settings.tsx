"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Shield, SettingsIcon, Eye, Plus, Edit, Trash2, UserCheck, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface UserRole {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  color: string
}

interface UserAccount {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive" | "pending"
  lastLogin: string
  createdAt: string
}

const mockRoles: UserRole[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full system access with all permissions",
    permissions: ["view_all", "edit_all", "manage_users", "system_settings", "generate_reports"],
    userCount: 2,
    color: "bg-red-100 text-red-800",
  },
  {
    id: "operator",
    name: "Operator",
    description: "Equipment management and maintenance operations",
    permissions: ["view_equipment", "edit_equipment", "view_maintenance", "create_maintenance"],
    userCount: 8,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to equipment and reports",
    permissions: ["view_equipment", "view_reports", "view_maintenance"],
    userCount: 15,
    color: "bg-gray-100 text-gray-800",
  },
]

const mockUsers: UserAccount[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Administrator",
    status: "active",
    lastLogin: "2024-01-15",
    createdAt: "2023-06-15",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    role: "Operator",
    status: "active",
    lastLogin: "2024-01-14",
    createdAt: "2023-08-22",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "Viewer",
    status: "pending",
    lastLogin: "Never",
    createdAt: "2024-01-10",
  },
]

export function UsersSettings() {
  const [roles, setRoles] = useState<UserRole[]>(mockRoles)
  const [users, setUsers] = useState<UserAccount[]>(mockUsers)
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)

  const [userSettings, setUserSettings] = useState({
    requireEmailVerification: true,
    allowSelfRegistration: false,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    sessionTimeout: 60,
    requireTwoFactor: false,
  })

  const getStatusBadge = (status: UserAccount["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "administrator":
        return <Shield className="h-4 w-4" />
      case "operator":
        return <SettingsIcon className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    if (dateString === "Never") return "Never"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">User Settings</h1>
        <p className="text-muted-foreground mt-1">Manage user accounts, roles, and access permissions.</p>
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">User Accounts</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="security">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">User Accounts</h3>
              <p className="text-sm text-muted-foreground">Manage individual user accounts and their access.</p>
            </div>
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account with appropriate permissions.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-name">Full Name</Label>
                      <Input id="user-name" placeholder="Enter full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email Address</Label>
                      <Input id="user-email" type="email" placeholder="user@company.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddUserDialogOpen(false)}>Create User</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          {user.role}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {formatDate(user.lastLogin)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.createdAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Reset Password
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Roles & Permissions</h3>
              <p className="text-sm text-muted-foreground">Define user roles and their associated permissions.</p>
            </div>
            <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>Define a new user role with specific permissions.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input id="role-name" placeholder="Enter role name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-description">Description</Label>
                    <Input id="role-description" placeholder="Brief description of this role" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddRoleDialogOpen(false)}>Create Role</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={role.color}>{role.name}</Badge>
                      <div>
                        <CardTitle className="text-base">{role.name}</CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{role.userCount} users</Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Permissions:</Label>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Security Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure security policies and authentication requirements.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Authentication Settings</CardTitle>
              <CardDescription>Configure how users authenticate and access the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require email verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Users must verify their email before accessing the system
                  </p>
                </div>
                <Switch
                  checked={userSettings.requireEmailVerification}
                  onCheckedChange={(checked) =>
                    setUserSettings((prev) => ({ ...prev, requireEmailVerification: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow self-registration</Label>
                  <p className="text-sm text-muted-foreground">Users can create accounts without admin approval</p>
                </div>
                <Switch
                  checked={userSettings.allowSelfRegistration}
                  onCheckedChange={(checked) =>
                    setUserSettings((prev) => ({ ...prev, allowSelfRegistration: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require two-factor authentication</Label>
                  <p className="text-sm text-muted-foreground">Enforce 2FA for all user accounts</p>
                </div>
                <Switch
                  checked={userSettings.requireTwoFactor}
                  onCheckedChange={(checked) => setUserSettings((prev) => ({ ...prev, requireTwoFactor: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password & Session Policies</CardTitle>
              <CardDescription>Set password requirements and session management rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password-expiry">Password expiry (days)</Label>
                  <Input
                    id="password-expiry"
                    type="number"
                    value={userSettings.passwordExpiry}
                    onChange={(e) =>
                      setUserSettings((prev) => ({ ...prev, passwordExpiry: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-attempts">Max login attempts</Label>
                  <Input
                    id="max-attempts"
                    type="number"
                    value={userSettings.maxLoginAttempts}
                    onChange={(e) =>
                      setUserSettings((prev) => ({ ...prev, maxLoginAttempts: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={userSettings.sessionTimeout}
                  onChange={(e) =>
                    setUserSettings((prev) => ({ ...prev, sessionTimeout: Number.parseInt(e.target.value) }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>Save Security Settings</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
