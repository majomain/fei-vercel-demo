"use client"

import { CompanySelector, Company } from "@/components/company-selector"
import { useCompany } from "@/contexts/company-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function TestCompanySelector() {
  const { currentCompany, companies, setCurrentCompany, addCompany } = useCompany()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    name: "",
    type: "facility",
    location: "",
    initials: "",
    color: "#3b82f6"
  })

  const handleAddCompany = () => {
    if (newCompany.name && newCompany.location && newCompany.initials) {
      const company: Company = {
        id: Date.now().toString(),
        name: newCompany.name,
        type: newCompany.type as Company["type"],
        status: "active",
        location: newCompany.location,
        equipmentCount: 0,
        initials: newCompany.initials,
        color: newCompany.color || "#3b82f6"
      }
      addCompany(company)
      setNewCompany({ name: "", type: "facility", location: "", initials: "", color: "#3b82f6" })
      setShowAddForm(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Company Selector Test</h1>
          <p className="text-muted-foreground mt-2">
            Test the company selector dropdown functionality
          </p>
        </div>

        {/* Company Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Company Selector</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <CompanySelector
                currentCompany={currentCompany}
                companies={companies}
                onCompanyChange={setCurrentCompany}
                onViewAllCompanies={() => alert("View all companies clicked")}
                onLogout={() => alert("Logout clicked")}
                userEmail="john.doe@example.com"
                userName="John Doe"
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Company Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current Company</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-lg font-semibold">{currentCompany.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <p className="text-lg font-semibold capitalize">{currentCompany.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <p className="text-lg font-semibold">{currentCompany.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Equipment Count</label>
                <p className="text-lg font-semibold">{currentCompany.equipmentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Companies */}
        <Card>
          <CardHeader>
            <CardTitle>All Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    company.id === currentCompany.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: company.color }}
                    >
                      {company.initials}
                    </div>
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {company.type} • {company.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      company.status === "active" ? "bg-green-100 text-green-800" :
                      company.status === "maintenance" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {company.status}
                    </span>
                    {company.id === currentCompany.id && (
                      <span className="text-primary text-sm font-medium">Current</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Company Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Company</CardTitle>
          </CardHeader>
          <CardContent>
            {!showAddForm ? (
              <Button onClick={() => setShowAddForm(true)}>Add Company</Button>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <input
                      type="text"
                      value={newCompany.name}
                      onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <select
                      value={newCompany.type}
                      onChange={(e) => setNewCompany({ ...newCompany, type: e.target.value as Company["type"] })}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    >
                      <option value="facility">Facility</option>
                      <option value="store">Store</option>
                      <option value="warehouse">Warehouse</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <input
                      type="text"
                      value={newCompany.location}
                      onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      placeholder="City, State"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Initials</label>
                    <input
                      type="text"
                      value={newCompany.initials}
                      onChange={(e) => setNewCompany({ ...newCompany, initials: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      placeholder="RJ"
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddCompany}>Add Company</Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
