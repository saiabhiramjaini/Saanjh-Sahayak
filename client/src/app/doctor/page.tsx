"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, CheckCircle2, AlertTriangle, Building } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface OldAgeHome {
  id: number
  name: string
  phoneNumber: string
  address: string
  city: string
  state: string
  pincode: string
  currentOccupancy: number
  assignedcaretakerId: number
  assignedDoctorId: number
}

interface Report {
  id: number
  patientId: number
  patientName: string
  detailedAnalysis: string
  verified: boolean
  createdAt: string
}

interface Patient {
  id: number
  name: string
  age: number
  gender: string
  bloodGroup: string
  contact: string
}

export default function DoctorDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [oldAgeHomes, setOldAgeHomes] = useState<OldAgeHome[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctorId, setDoctorId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get and validate user data from localStorage
        const userStr = localStorage.getItem("user")
        if (!userStr) {
          toast.error("Please sign in to access the dashboard")
          router.push("/signin")
          return
        }

        const user = JSON.parse(userStr)
        
        // Validate user data
        if (!user.id || user.role !== "doctor") {
          toast.error("Invalid user data. Please sign in again")
          localStorage.removeItem("user") // Clear invalid data
          router.push("/signin")
          return
        }

        setDoctorId(user.id)

        // Fetch all old age homes for this doctor
        const homesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/oldagehome/doctor/${user.id}`
        )
        
        if (!homesResponse.data.oldAgeHomes) {
          throw new Error("Invalid response: Missing oldAgeHomes data")
        }
        
        setOldAgeHomes(homesResponse.data.oldAgeHomes)

        // Fetch reports for this doctor
        const reportsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reports/doctor/${user.id}`
        )
        
        if (!reportsResponse.data.reports) {
          throw new Error("Invalid response: Missing reports data")
        }
        
        // Transform reports data
        const transformedReports = reportsResponse.data.reports.map((report: any) => ({
          id: report.id,
          patientId: report.patientId,
          patientName: report.patient?.name || "Unknown Patient",
          detailedAnalysis: report.detailedAnalysis,
          verified: report.verified,
          createdAt: new Date(report.createdAt).toLocaleDateString()
        }))
        
        setReports(transformedReports)

        // Fetch patients for this doctor
        const patientsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/patient/doctor/${user.id}`
        )
        
        if (!patientsResponse.data.patients) {
          throw new Error("Invalid response: Missing patients data")
        }
        
        setPatients(patientsResponse.data.patients)

      } catch (error: any) {
        console.error("Error fetching data:", error)
        if (error.response?.status === 401) {
          toast.error("Session expired. Please sign in again")
          localStorage.removeItem("user")
          router.push("/signin")
        } else {
          toast.error(error.message || "Failed to load dashboard data")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Stats based on actual data
  const stats = [
    { 
      title: "Total Patients", 
      value: patients.length, 
      icon: Users, 
      color: "bg-blue-100 text-blue-700" 
    },
    { 
      title: "Assigned Facilities", 
      value: oldAgeHomes.length, 
      icon: Building, 
      color: "bg-purple-100 text-purple-700" 
    },
    { 
      title: "Verified Reports", 
      value: reports.filter(r => r.verified).length, 
      icon: CheckCircle2, 
      color: "bg-green-100 text-green-700" 
    },
    { 
      title: "Pending Reports", 
      value: reports.filter(r => !r.verified).length, 
      icon: AlertTriangle, 
      color: "bg-amber-100 text-amber-700" 
    },
  ]

  if (loading) {
    return (
      <DashboardLayout role="doctor" currentPath="/doctor">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="doctor" currentPath="/doctor">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
            <p className="text-gray-500">
              Welcome back, Dr. {oldAgeHomes[0]?.name || "Doctor"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Assigned Facilities Section */}
        {oldAgeHomes.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Assigned Facilities</CardTitle>
              <CardDescription>Old age homes under your care</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {oldAgeHomes.map((home) => (
                  <Card key={home.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-medium text-lg mb-2">{home.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">{home.address}</p>
                      <p className="text-sm text-gray-500">
                        {home.city}, {home.state} - {home.pincode}
                      </p>
                      <div className="mt-3 text-sm">
                        <p><span className="font-medium">Contact:</span> {home.phoneNumber}</p>
                        <p><span className="font-medium">Patients:</span> {home.currentOccupancy}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Building className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">No facilities assigned</h3>
                  <p className="text-gray-500">
                    You haven't been assigned to any old age homes yet
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}