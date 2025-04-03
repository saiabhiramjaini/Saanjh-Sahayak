"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OldAgeHomeDetails } from "@/components/old-age-home-details"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function HomeDetailsPage() {
  const router = useRouter()
  const [caretakerId, setCaretakerId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/signin")
      return
    }

    try {
      const user = JSON.parse(userStr)
      setCaretakerId(user.id)
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/signin")
    } finally {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <DashboardLayout role="caretaker" currentPath="/caretaker/home-details">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="caretaker" currentPath="/caretaker/home-details">
      <div className="p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.push("/caretaker")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Old Age Home Details</h1>
          <p className="text-gray-500">View information about your registered old age home</p>
        </div>

        {caretakerId && <OldAgeHomeDetails caretakerId={caretakerId} />}
      </div>
    </DashboardLayout>
  )
} 