"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, User, Phone, Heart } from "lucide-react"
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
}

export default function PatientsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const userStr = localStorage.getItem("user")
        if (!userStr) {
          router.push("/signin")
          return
        }

        const user = JSON.parse(userStr)
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/patient/doctor/${user.id}`
        )
        setPatients(data.patients || [])
      } catch (error) {
        console.error("Error fetching patients:", error)
        toast.error("Failed to load patients")
        setPatients([])
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [router])

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.contact.includes(searchQuery)
  )

  if (loading) {
    return (
      <DashboardLayout role="doctor" currentPath="/doctor/patients">
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="doctor" currentPath="/doctor/patients">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-muted-foreground">View all your assigned patients</p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name or contact number..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {patients.length === 0 ? "No patients assigned" : "No matching patients found"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map(patient => (
              <Card key={patient.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                      <User className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <div>{patient.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {patient.age} years • {patient.gender}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    {patient.contact}
                  </div>
                  <div className="flex items-center text-sm">
                    <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                    Blood Group: {patient.bloodGroup}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => router.push(`/doctor/patients/${patient.id}`)}
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