"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, User, Phone, Heart } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface Patient {
  id: number
  name: string
  age: number
  gender: string
  bloodGroup: string
  contact: string
  medicalHistory: any[]
  oldAgeHomeId: number
  assignedcaretakerId: number
  assignedDoctorId: number
  createdAt: string
  updatedAt: string
}

export default function PatientsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [oldAgeHomeId, setOldAgeHomeId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data from localStorage
        const userStr = localStorage.getItem("user")
        if (!userStr) {
          router.push("/signin")
          return
        }
        const user = JSON.parse(userStr)

        // Fetch old age home data
        const homeResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/oldagehome/caretaker/${user.id}`
        )
        setOldAgeHomeId(homeResponse.data.oldAgeHome.id)

        // Fetch patients for this old age home
        const patientsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/patient/oldagehome/${homeResponse.data.oldAgeHome.id}`
        )
        setPatients(patientsResponse.data.patients)
      } catch (error: any) {
        console.error("Error fetching patients:", error)
        if (error.response?.status === 404) {
          setPatients([])
        } else {
          toast.error("Failed to load patients")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Filter patients based on search query
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.contact.includes(searchQuery)
  )

  if (loading) {
    return (
      <DashboardLayout role="caretaker" currentPath="/caretaker/patients">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-full max-w-md"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="caretaker" currentPath="/caretaker/patients">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Patients</h1>
            <p className="text-gray-500">Manage your patients and their health records</p>
          </div>
          <Button 
            onClick={() => router.push("/caretaker/patients/add")}
            className="mt-4 md:mt-0 bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients by name or contact number..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Patients Grid */}
        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">No patients found</h3>
                  <p className="text-gray-500">
                    {searchQuery
                      ? "No patients match your search criteria"
                      : "You haven't added any patients yet"}
                  </p>
                </div>
                {!searchQuery && (
                  <Button 
                    onClick={() => router.push("/caretaker/patients/add")}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Patient
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <div>{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.age} years • {patient.gender}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{patient.contact}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">Blood Group: {patient.bloodGroup}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => router.push(`/caretaker/patients/${patient.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}