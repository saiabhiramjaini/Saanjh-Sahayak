"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Phone, MapPin, Users, User } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Skeleton } from "./ui/skeleton"

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
  createdAt: string
  updatedAt: string
}

interface Doctor {
  id: number
  username: string
  specialization?: string
}

interface OldAgeHomeDetailsProps {
  caretakerId: number
}

export function OldAgeHomeDetails({ caretakerId }: OldAgeHomeDetailsProps) {
  const router = useRouter()
  const [oldAgeHome, setOldAgeHome] = useState<OldAgeHome | null>(null)
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOldAgeHomeDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch old age home details
        const homeResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/oldagehome/caretaker/${caretakerId}`
        )
        
        const homeData = homeResponse.data.oldAgeHome
        setOldAgeHome(homeData)
        
        // Fetch doctor details if old age home has an assigned doctor
        if (homeData.assignedDoctorId) {
          try {
            const doctorResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/doctor/${homeData.assignedDoctorId}`
            )
            setDoctor(doctorResponse.data.doctor)
          } catch (doctorError) {
            console.error("Error fetching doctor details:", doctorError)
            // Don't set error here, just log it
          }
        }
      } catch (error: any) {
        console.error("Error fetching old age home details:", error)
        if (error.response?.status === 404) {
          setError("No old age home found for this caretaker")
        } else {
          setError("Failed to load old age home details")
          toast.error("Failed to load old age home details")
        }
      } finally {
        setLoading(false)
      }
    }

    if (caretakerId) {
      fetchOldAgeHomeDetails()
    }
  }, [caretakerId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Old Age Home Details</CardTitle>
          <CardDescription>Loading details...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Old Age Home Details</CardTitle>
          <CardDescription>Error loading details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-red-500 mb-4">{error}</p>
            <Button 
              onClick={() => router.push("/caretaker")}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!oldAgeHome) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Old Age Home Details</CardTitle>
          <CardDescription>No old age home found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">You haven't registered an old age home yet.</p>
            <Button 
              onClick={() => router.push("/caretaker")}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Old Age Home Details</CardTitle>
        <CardDescription>Information about your registered old age home</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Home Name and Contact */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-teal-100 text-teal-700">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{oldAgeHome.name}</h3>
                <p className="text-gray-500 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {oldAgeHome.phoneNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              <Users className="h-4 w-4" />
              <span className="font-medium">{oldAgeHome.currentOccupancy} Patients</span>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
              Address
            </h4>
            <p className="text-gray-700">{oldAgeHome.address}</p>
            <p className="text-gray-700">
              {oldAgeHome.city}, {oldAgeHome.state} - {oldAgeHome.pincode}
            </p>
          </div>

          {/* Assigned Doctor */}
          {doctor && (
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <User className="h-4 w-4 mr-1 text-gray-500" />
                Assigned Doctor
              </h4>
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-full bg-purple-100 text-purple-700">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{doctor.username}</p>
                  {doctor.specialization && (
                    <p className="text-sm text-gray-500">{doctor.specialization}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 