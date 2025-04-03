"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, User, Heart, Phone } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

interface Patient {
  id: number
  name: string
  age: number
  gender: string
  bloodGroup: string
  contact: string
  medicalHistory: string[]
  oldAgeHomeId: number
  assignedcaretakerId: number
  assignedDoctorId: number
  createdAt: string
  updatedAt: string
}

export default function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = React.use(params);
  const patientId = resolvedParams.id;
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/patient/${patientId}`
        )
        setPatient(response.data.patient)
      } catch (error: any) {
        console.error("Error fetching patient:", error)
        toast.error("Failed to load patient details")
        if (error.response?.status === 404) {
          router.push("/caretaker/patients")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPatient()
  }, [patientId, router])

  if (loading) {
    return (
      <DashboardLayout role="caretaker" currentPath="/caretaker/patients">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="lg:col-span-2 h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!patient) {
    return null
  }

  return (
    <DashboardLayout role="caretaker" currentPath="/caretaker/patients">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.push("/caretaker/patients")} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{patient.name}</h1>
              <p className="text-gray-500">Patient ID: {patient.id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Profile</CardTitle>
              <CardDescription>Personal and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-500" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-500 w-24">Age:</span>
                  <span>{patient.age} years</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-500 w-24">Gender:</span>
                  <span>{patient.gender}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-500 w-24">Blood Group:</span>
                  <span>{patient.bloodGroup}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-500 w-24">Contact:</span>
                  <span>{patient.contact}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical History Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
                <CardDescription>Patient's past medical conditions and treatments</CardDescription>
              </CardHeader>
              <CardContent>
                {patient.medicalHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No medical history available</p>
                ) : (
                  <ul className="space-y-4">
                    {patient.medicalHistory.map((item, index) => (
                      <li key={index} className="border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center mr-3 mt-0.5">
                            <FileText className="h-3 w-3 text-teal-600" />
                          </div>
                          <div>
                            <p>{item}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}