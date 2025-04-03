"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, AlertTriangle, Plus, Building, ArrowRight } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CreateOldAgeHomeForm } from "@/components/create-old-age-home-form"
import { OldAgeHomeDetails } from "@/components/old-age-home-details"

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

export default function CaretakerDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [oldAgeHome, setOldAgeHome] = useState<OldAgeHome | null>(null)
  const [showAddHomeForm, setShowAddHomeForm] = useState(false)
  const [recentReports, setRecentReports] = useState<Report[]>([])
  const [caretakerId, setCaretakerId] = useState<number | null>(null)

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
        setCaretakerId(user.id)

        // Fetch old age home data
        const homeResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/oldagehome/caretaker/${user.id}`
        )
        setOldAgeHome(homeResponse.data.oldAgeHome)

        // Fetch reports for this caretaker
        const reportsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reports/caretaker/${user.id}`
        )
        
        // Transform reports data to include patient names and status
        const transformedReports = reportsResponse.data.reports.map((report: any) => ({
          id: report.id,
          patientId: report.patientId,
          patientName: report.patient?.name || "Unknown Patient",
          detailedAnalysis: report.detailedAnalysis,
          verified: report.verified,
          createdAt: new Date(report.createdAt).toLocaleDateString()
        }))
        
        setRecentReports(transformedReports)
      } catch (error: any) {
        console.error("Error fetching data:", error)
        if (error.response?.status === 404) {
          toast.error("No Old Age Home is registered by you.")
          setOldAgeHome(null)
        } 
        else {
          toast.error("Failed to load dashboard data")
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
      value: oldAgeHome?.currentOccupancy || 0, 
      icon: Users, 
      color: "bg-blue-100 text-blue-700" 
    },
    { 
      title: "Reports Submitted", 
      value: recentReports.length, 
      icon: FileText, 
      color: "bg-purple-100 text-purple-700" 
    },
    { 
      title: "Pending Actions", 
      value: recentReports.filter(r => !r.verified).length, 
      icon: AlertTriangle, 
      color: "bg-amber-100 text-amber-700" 
    },
  ]

  if (loading) {
    return (
      <DashboardLayout role="caretaker" currentPath="/caretaker">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="caretaker" currentPath="/caretaker">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Caretaker Dashboard</h1>
            <p className="text-gray-500">
              Welcome back, {oldAgeHome?.name || "Caretaker"}
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

        {/* Old Age Home Section */}
        {!oldAgeHome && !showAddHomeForm ? (
          <Card className="mb-6">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="font-medium text-lg mb-1">No old age home registered yet</h3>
                <p className="text-gray-500">Add your old age home to start managing patients</p>
              </div>
              <Button 
                onClick={() => setShowAddHomeForm(true)}
                className="mt-4 md:mt-0 bg-teal-600 hover:bg-teal-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your Old Age Home
              </Button>
            </CardContent>
          </Card>
        ) : showAddHomeForm ? (
          <CreateOldAgeHomeForm 
            onSuccess={(newHome) => {
              setOldAgeHome(newHome)
              setShowAddHomeForm(false)
            }}
            onCancel={() => setShowAddHomeForm(false)}
          />
        ) : (
          <Card className="mb-6">
            <CardContent className="p-6">
              <OldAgeHomeDetails caretakerId={caretakerId!} />
            </CardContent>
          </Card>
        )}

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Latest patient health reports submitted</CardDescription>
          </CardHeader>
          <CardContent>
            {recentReports.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{report.patientName}</p>
                      <p className="text-sm text-gray-500">{report.createdAt}</p>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {report.verified ? "Verified" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No reports submitted yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}