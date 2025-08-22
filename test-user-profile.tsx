"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { UserProfileModal } from "@/components/user-profile-modal"

export function TestUserProfile() {
  const [showProfile, setShowProfile] = useState(false)

  return (
    <div className="p-4">
      <h2>User Profile Test</h2>
      <Button onClick={() => setShowProfile(true)}>
        <User className="h-4 w-4 mr-2" />
        Test Profile Button
      </Button>

      {showProfile && <UserProfileModal open={showProfile} onOpenChange={setShowProfile} />}

      <div className="mt-4 text-sm text-gray-600">
        If this button works, the issue is in the layout integration. If it doesn't work, the UserProfileModal component
        itself has issues.
      </div>
    </div>
  )
}
