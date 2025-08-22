"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, Settings, User, Lock } from "lucide-react"
import Link from "next/link"

interface UserProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserProfileModal({ open, onOpenChange }: UserProfileModalProps) {
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
    avatar: "/placeholder.svg?height=100&width=100",
    company: "InceptionX",
    department: "Maintenance",
  })

  const [quickSettings, setQuickSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    maintenanceAlerts: true,
  })

  const handleQuickSettingChange = (setting: string, value: boolean) => {
    setQuickSettings((prev) => ({ ...prev, [setting]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Quick access to your profile and settings. For full settings, visit the settings page.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="quick-settings">Quick Settings</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <div className="text-sm font-medium">{user.name}</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <div className="text-sm font-medium">{user.email}</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <div className="text-sm font-medium">{user.company}</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <div className="text-sm font-medium">{user.department}</div>
                      </div>
                    </div>
                    <Link href="/settings?tab=account">
                      <Button variant="outline" className="w-full">
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quick-settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Settings
                </CardTitle>
                <CardDescription>
                  Quickly toggle common settings. For more options, visit the full settings page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <Label htmlFor="quick-email">Email Notifications</Label>
                    </div>
                    <Switch
                      id="quick-email"
                      checked={quickSettings.emailNotifications}
                      onCheckedChange={(checked) => handleQuickSettingChange("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <Label htmlFor="quick-push">Push Notifications</Label>
                    </div>
                    <Switch
                      id="quick-push"
                      checked={quickSettings.pushNotifications}
                      onCheckedChange={(checked) => handleQuickSettingChange("pushNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <Label htmlFor="quick-maintenance">Maintenance Alerts</Label>
                    </div>
                    <Switch
                      id="quick-maintenance"
                      checked={quickSettings.maintenanceAlerts}
                      onCheckedChange={(checked) => handleQuickSettingChange("maintenanceAlerts", checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Link href="/settings?tab=display" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Display Settings
                    </Button>
                  </Link>
                  <Link href="/settings?tab=notifications" className="flex-1">
                    <Button variant="outline" className="w-full">
                      All Notifications
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Password</div>
                      <div className="text-sm text-muted-foreground">Last changed 30 days ago</div>
                    </div>
                    <Link href="/settings?tab=account">
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Active Sessions</div>
                      <div className="text-sm text-muted-foreground">Manage your active login sessions</div>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      View Sessions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4">
          <Link href="/settings">
            <Button variant="outline">Full Settings Page</Button>
          </Link>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
