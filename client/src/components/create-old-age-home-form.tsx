"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Doctor {
  id: number
  username: string
  name?: string
  specialization?: string
}

interface CreateOldAgeHomeFormProps {
  onSuccess: (oldAgeHome: any) => void
  onCancel: () => void
}

export function CreateOldAgeHomeForm({ onSuccess, onCancel }: CreateOldAgeHomeFormProps) {
  const router = useRouter()
  const [homeFormData, setHomeFormData] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    currentOccupancy: 0,
    assignedDoctorId: "",
  })
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/doctor/all`
        )
        setDoctors(response.data.doctors || [])
      } catch (error) {
        console.error("Error fetching doctors:", error)
        toast.error("Failed to load doctors")
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setHomeFormData(prev => ({ 
      ...prev, 
      [name]: name === "currentOccupancy" ? parseInt(value) : value 
    }))
  }

  const handleDoctorChange = (value: string) => {
    setHomeFormData(prev => ({
      ...prev,
      assignedDoctorId: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userStr = localStorage.getItem("user")
      if (!userStr) {
        router.push("/signin")
        return
      }
      const user = JSON.parse(userStr)

      if (!homeFormData.assignedDoctorId) {
        toast.error("Please select a doctor")
        return
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/oldagehome/create`,
        {
          ...homeFormData,
          assignedCaretakerId: user.id,
          assignedDoctorId: parseInt(homeFormData.assignedDoctorId),
        }
      )

      // Store the assigned doctor ID in localStorage
      localStorage.setItem("assignedDoctorId", homeFormData.assignedDoctorId)
      
      onSuccess(response.data.oldAgeHome)
      toast.success("Old age home registered successfully")
      
      // Reset form
      setHomeFormData({
        name: "",
        phoneNumber: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        currentOccupancy: 0,
        assignedDoctorId: "",
      })
    } catch (error: any) {
      console.error("Error registering old age home:", error)
      toast.error(error.response?.data?.error || "Failed to register old age home")
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Register Old Age Home</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Fill in the information about the old age home</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Home Name</label>
              <Input 
                name="name" 
                value={homeFormData.name} 
                onChange={handleInputChange} 
                placeholder="Enter old age home name" 
                required 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Phone Number</label>
              <Input 
                name="phoneNumber" 
                value={homeFormData.phoneNumber} 
                onChange={handleInputChange} 
                placeholder="+91 98765 43210" 
                required 
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Address</label>
            <Input 
              name="address" 
              value={homeFormData.address} 
              onChange={handleInputChange} 
              placeholder="Enter full address" 
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">City</label>
              <Input 
                name="city" 
                value={homeFormData.city} 
                onChange={handleInputChange} 
                placeholder="City" 
                required 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">State</label>
              <Input 
                name="state" 
                value={homeFormData.state} 
                onChange={handleInputChange} 
                placeholder="State" 
                required 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Pincode</label>
              <Input 
                name="pincode" 
                value={homeFormData.pincode} 
                onChange={handleInputChange} 
                placeholder="Pincode" 
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Current Occupancy</label>
              <Input 
                name="currentOccupancy" 
                type="number" 
                value={homeFormData.currentOccupancy} 
                onChange={handleInputChange} 
                placeholder="Number of patients" 
                required 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Assigned Doctor</label>
              <Select 
                value={homeFormData.assignedDoctorId} 
                onValueChange={handleDoctorChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.username} {doctor.specialization ? `(${doctor.specialization})` : ''}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-doctors" disabled>
                      No doctors available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
              Register Home
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 