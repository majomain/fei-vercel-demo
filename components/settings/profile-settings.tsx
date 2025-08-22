"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Globe, Shield, Store, User, Clock, Smartphone, Plus, Mail, ExternalLink } from "lucide-react"

export function ProfileSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account profile and preferences.</p>
      </div>

      {/* Details Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Details</h2>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                  <AvatarFallback className="text-lg bg-pink-100 text-pink-700">JO</AvatarFallback>
                </Avatar>
                <Button variant="outline">Upload photo</Button>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" defaultValue="John" />
                  <p className="text-sm text-muted-foreground">Use your first and last name as they appear on your government-issued ID.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" defaultValue="Favor" />
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">jacob@jotech.co</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                  <Button variant="link" className="p-0 h-auto">Update</Button>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Phone Number (optional)</Label>
                  <p className="text-sm text-muted-foreground">No phone number</p>
                </div>
                <Button variant="link" className="p-0 h-auto">Add</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Locations Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Locations</h2>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Locations</Label>
                <p className="text-sm text-muted-foreground">View and access locations connected to your account.</p>
              </div>
              <Button variant="outline">View all locations</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preferred Language Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Preferred language</h2>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">When you're logged in, this is the language you will see. It doesn't affect the language your customers see on your online store.</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Report language issues</Label>
                    <p className="text-sm text-muted-foreground">Give language feedback while using the platform</p>
                  </div>
                  <Switch />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">REGIONAL FORMAT</Label>
                    <p className="text-sm text-muted-foreground">Your number, time, date, and currency formats are set for <strong>American English</strong>.</p>
                    <Button variant="link" className="p-0 h-auto text-sm">Change regional format</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timezone Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Timezone</h2>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="pacific">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pacific">(GMT-08:00) Pacific Time (US & Canada)</SelectItem>
                    <SelectItem value="mountain">(GMT-07:00) Mountain Time (US & Canada)</SelectItem>
                    <SelectItem value="central">(GMT-06:00) Central Time (US & Canada)</SelectItem>
                    <SelectItem value="eastern">(GMT-05:00) Eastern Time (US & Canada)</SelectItem>
                    <SelectItem value="utc">(GMT+00:00) UTC</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">This is the timezone for your account. To set the timezone for your admin panel, go to the General section in Settings.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Security</h2>
        </div>
        
        {/* Secondary Email */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">Secondary email</Label>
                <p className="text-sm text-muted-foreground">A secondary email can be used to restore access to your account. Security notifications are also sent to this email.</p>
                <p className="text-sm text-muted-foreground">You do not have a secondary email.</p>
              </div>
              <Button className="hover:bg-primary/90">Add secondary email</Button>
            </div>
          </CardContent>
        </Card>

        {/* Two-step Authentication */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base font-medium">Two-step authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Learn more about{" "}
                  <Button variant="link" className="p-0 h-auto text-sm">two-step authentication</Button>
                </p>
              </div>

              <Separator />

              {/* Authentication Methods */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Authentication methods</Label>
                    <p className="text-sm text-muted-foreground">After entering your password, verify your identity with an authentication method.</p>
                  </div>
                  <Badge variant="default" className="bg-green-600">On</Badge>
                </div>

                <Separator />

                {/* Primary Method */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Primary method</Label>
                    <p className="text-sm text-muted-foreground">This will appear by default when you log in.</p>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Authenticator app</span>
                    </div>
                    <Button variant="link" className="p-0 h-auto text-red-600 hover:text-red-700">Remove</Button>
                  </div>
                </div>

                <Separator />

                {/* Backup Methods */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Backup methods</Label>
                    <p className="text-sm text-muted-foreground">If your primary method doesn't work, you can use your backup methods to log in.</p>
                  </div>
                  <div className="flex items-center justify-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/40 transition-colors">
                    <Button variant="link" className="p-0 h-auto text-sm flex items-center gap-2 hover:text-primary">
                      <Plus className="h-4 w-4" />
                      Add another method
                    </Button>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    Need to quickly log in to another device?{" "}
                    <Button variant="link" className="p-0 h-auto text-sm hover:text-primary">Generate a temporary login code</Button>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recovery Codes */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">Recovery codes</Label>
                <p className="text-sm text-muted-foreground">Use your recovery codes to log in if you lose your device, lose your security key, or if you can't receive your verification code through SMS or an authenticator app.</p>
              </div>
              <Button className="hover:bg-primary/90">View codes</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  )
}
