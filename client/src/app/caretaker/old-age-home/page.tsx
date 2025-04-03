"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building, Plus, Search, MapPin, Phone } from "lucide-react"

export default function OldAgeHomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Static data for demonstration
  const oldAgeHomes = [
    {
      id: 1,
      name: "Sunrise Senior Living",
      location: "Delhi, India",
      patients: 12,
      caretakers: 4,
      doctors: 2,
      address: "123 Main Street, New Delhi, 110001",
      phone: "+91 98765 43210",
    },
    {
      id: 2,
      name: "Golden Years Home",
      location: "Mumbai, India",
      patients: 8,
      caretakers: 3,
      doctors: 1,
      address: "456 Park Avenue, Mumbai, 400001",
      phone: "+91 98765 12345",
    },
    {
      id: 3,
      name: "Peaceful Retreat",
      location: "Bangalore, India",
      patients: 15,
      caretakers: 5,
      doctors: 2,
      address: "789 Garden Road, Bangalore, 560001",
      phone: "+91 98765 67890",
    },
  ]

  const filteredHomes = oldAgeHomes.filter(
    (home) =>
      home.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      home.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardLayout role="caretaker" currentPath="/caretaker/old-age-home">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Old Age Homes</h1>
            <p className="text-gray-500">Manage and view all registered old age homes</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/caretaker/old-age-home/create">
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="mr-2 h-4 w-4" />
                Add New Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or location..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Old Age Homes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHomes.map((home) => (
            <Card key={home.id} className="overflow-hidden">
              <div className="h-32 bg-teal-600 flex items-center justify-center">
                <Building className="h-16 w-16 text-white opacity-50" />
              </div>
              <CardHeader>
                <CardTitle>{home.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> {home.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Patients</p>
                    <p className="font-bold">{home.patients}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Caretakers</p>
                    <p className="font-bold">{home.caretakers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Doctors</p>
                    <p className="font-bold">{home.doctors}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                    <span>{home.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{home.phone}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href={`/caretaker/old-age-home/${home.id}`}>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

