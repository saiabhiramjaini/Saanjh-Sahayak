"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, X } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

interface AddPatientFormProps {
  oldAgeHomeId: number
  caretakerId: number
}

export function AddPatientForm({ oldAgeHomeId, caretakerId }: AddPatientFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const assignedDoctorId = typeof window !== 'undefined' ? localStorage.getItem('assignedDoctorId') : null;

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    contact: "",
    oldAgeHomeId,
    assignedcaretakerId: caretakerId,
    assignedDoctorId: assignedDoctorId ? parseInt(assignedDoctorId) : null, // Add this line
  })

  
  const [medicalHistory, setMedicalHistory] = useState<string[]>([""])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert age to number
      const patientData = {
        ...formData,
        age: parseInt(formData.age),
        medicalHistory: medicalHistory.filter(entry => entry.trim() !== ""),
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/patient`,
        patientData
      )

      toast.success("Patient added successfully")
      router.push("/caretaker/patients")
      router.refresh() // Refresh the page to update the patients list
    } catch (error: any) {
      console.error("Error adding patient:", error)
      toast.error(error.response?.data?.error || "Failed to add patient")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMedicalHistoryChange = (index: number, value: string) => {
    const updatedHistory = [...medicalHistory]
    updatedHistory[index] = value
    setMedicalHistory(updatedHistory)
  }

  const addMedicalHistoryEntry = () => {
    setMedicalHistory([...medicalHistory, ""])
  }

  const removeMedicalHistoryEntry = (index: number) => {
    if (medicalHistory.length > 1) {
      const updatedHistory = [...medicalHistory]
      updatedHistory.splice(index, 1)
      setMedicalHistory(updatedHistory)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push("/caretaker/patients")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <CardTitle>Add New Patient</CardTitle>
            <CardDescription>Enter patient details to register them</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter patient's full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
                min="0"
                max="150"
                placeholder="Enter patient's age"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
                required
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select
                value={formData.bloodGroup}
                onValueChange={(value) => handleSelectChange("bloodGroup", value)}
                required
              >
                <SelectTrigger id="bloodGroup">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                placeholder="Enter contact number"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Medical History</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addMedicalHistoryEntry}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Entry
              </Button>
            </div>
            
            {medicalHistory.map((entry, index) => (
              <div key={index} className="p-4 border rounded-md space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Medical History Entry {index + 1}</h4>
                  {medicalHistory.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeMedicalHistoryEntry(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`medical-history-${index}`}>Description</Label>
                  <Textarea
                    id={`medical-history-${index}`}
                    value={entry}
                    onChange={(e) => handleMedicalHistoryChange(index, e.target.value)}
                    placeholder="Enter medical condition, diagnosis, treatment, and date (e.g., Hypertension, Type 2, Medication, 2023-01-01)"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/caretaker/patients")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700">
              {loading ? "Adding..." : "Add Patient"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 