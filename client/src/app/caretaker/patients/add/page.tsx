"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AddPatientForm } from "@/components/add-patient-form"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"
import { toast } from "sonner"

export default function AddPatientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [oldAgeHomeId, setOldAgeHomeId] = useState<number | null>(null)
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
        setOldAgeHomeId(homeResponse.data.oldAgeHome.id)
      } catch (error: any) {
        console.error("Error fetching data:", error)
        if (error.response?.status === 404) {
          toast.error("No old age home found for this caretaker")
          router.push("/caretaker")
        } else {
          toast.error("Failed to load data")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <DashboardLayout role="caretaker" currentPath="/caretaker/patients">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!oldAgeHomeId || !caretakerId) {
    return null
  }

  return (
    <DashboardLayout role="caretaker" currentPath="/caretaker/patients">
      <div className="p-6">
        <AddPatientForm 
          oldAgeHomeId={oldAgeHomeId}
          caretakerId={caretakerId}
        />
      </div>
    </DashboardLayout>
  )
} 