"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "../../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateOldAgeHome() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setLoading(false)
      router.push("/caretaker/old-age-home")
    }, 1000)
  }

  return (
    <DashboardLayout role="caretaker" currentPath="/caretaker/old-age-home">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Register New Old Age Home</h1>
          <p className="text-gray-500">Add a new old age home to the system</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Old Age Home Details</CardTitle>
              <CardDescription>Fill in the information about the old age home</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Home Name</Label>
                    <Input id="name" placeholder="Enter old age home name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+91 98765 43210" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Enter full address" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="State" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" placeholder="Pincode" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" type="number" placeholder="Number of beds" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilities">Facilities Available</Label>
                  <Textarea id="facilities" placeholder="List the facilities available at this home" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor">Assign Doctor</Label>
                  <Select>
                    <SelectTrigger id="doctor">
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-sharma">Dr. Sharma (Geriatric Specialist)</SelectItem>
                      <SelectItem value="dr-patel">Dr. Patel (General Physician)</SelectItem>
                      <SelectItem value="dr-gupta">Dr. Gupta (Cardiologist)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/caretaker/old-age-home")}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={loading}>
                {loading ? "Registering..." : "Register Home"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

