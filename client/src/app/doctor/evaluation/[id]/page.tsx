"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, User, Calendar, Clock, AlertTriangle, CheckCircle2, Send } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

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

interface Report {
  id: number
  symptoms: string
  detailedAnalysis: string
  precautions: string[]
  typeOfDoctors: string
  predictions: string[]
  patientId: number
  caretakerId: number
  doctorId: number
  verified: boolean
  createdAt: string
}

interface Medicine {
  name: string
  dosage: string
  frequency: string
  duration: string
}

interface PrescriptionRequest {
  patientId: number
  doctorId: number
  reportId: number
  medicines: Medicine[]
}

interface Prescription {
  id: number
  patientId: number
  doctorId: number
  reportId: number
  medicines: Medicine[]
  createdAt: string
}

export default function EvaluationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const reportId = params?.id
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [report, setReport] = useState<Report | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [prescription, setPrescription] = useState<Prescription | null>(null)
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "", dosage: "", frequency: "", duration: "" }
  ])
  const [diagnosis, setDiagnosis] = useState("")
  const [instructions, setInstructions] = useState("")
  const [followUp, setFollowUp] = useState("")

  useEffect(() => {
    if (!reportId) {
      router.push("/doctor/evaluation")
      return
    }

    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem("user")
        if (!userStr) {
          router.push("/signin")
          return
        }

        // Fetch report data
        const reportResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reports/${reportId}`
        )
        setReport(reportResponse.data.report)

        // Fetch patient data
        const patientResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/patient/${reportResponse.data.report.patientId}`
        )
        setPatient(patientResponse.data.patient)

        // If report is verified, fetch prescription
        if (reportResponse.data.report.verified) {
          const prescriptionResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/prescription/report/${reportId}`
          )
          setPrescription(prescriptionResponse.data.prescription)
        }

      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load evaluation details")
        router.push("/doctor/evaluation")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [reportId, router])

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "" }])
  }

  const handleMedicineChange = (index: number, field: keyof Medicine, value: string) => {
    const updatedMedicines = [...medicines]
    updatedMedicines[index][field] = value
    setMedicines(updatedMedicines)
  }

  const handleRemoveMedicine = (index: number) => {
    if (medicines.length > 1) {
      const updatedMedicines = [...medicines]
      updatedMedicines.splice(index, 1)
      setMedicines(updatedMedicines)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const userStr = localStorage.getItem("user")
      if (!userStr || !report || !patient) {
        toast.error("Session expired. Please login again.")
        router.push("/signin")
        return
      }

      const user = JSON.parse(userStr)
      
      // Validate medicines
      const validMedicines = medicines.filter(med => 
        med.name.trim().length >= 2 && 
        med.dosage.trim().length >= 2 && 
        med.frequency.trim().length >= 2 && 
        med.duration.trim().length >= 2
      )

      if (validMedicines.length === 0) {
        toast.error("Please add at least one medicine with complete details (minimum 2 characters for each field)")
        setSubmitting(false)
        return
      }

      const prescriptionData: PrescriptionRequest = {
        patientId: patient.id,
        doctorId: user.id,
        reportId: report.id,
        medicines: validMedicines
      }

      // Log the request data for debugging
      console.log("Submitting prescription:", prescriptionData)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/prescription/create`,
        prescriptionData
      )

      console.log("Prescription response:", response.data)
      toast.success("Prescription created successfully")
      setSubmitted(true)
      // Refresh the page to show the prescription
      router.refresh()
    } catch (error: any) {
      console.error("Error submitting prescription:", error)
      if (error.response?.data?.details) {
        // Show validation error details
        const details = error.response.data.details
        Object.entries(details).forEach(([field, errors]) => {
          toast.error(`${field}: ${(errors as string[]).join(", ")}`)
        })
      } else {
        toast.error(error.response?.data?.error || "Failed to create prescription")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="doctor" currentPath="/doctor/evaluation">
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

  if (!report || !patient) {
    return (
      <DashboardLayout role="doctor" currentPath="/doctor/evaluation">
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Evaluation not found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => router.push("/doctor/evaluation")}
            >
              Back to Evaluations
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="doctor" currentPath="/doctor/evaluation">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push("/doctor/evaluation")} 
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Patient Evaluation</h1>
              <p className="text-muted-foreground">
                Report #{report.id} • {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            {report.verified ? (
              <Button variant="outline" onClick={() => router.push("/doctor/evaluation")}>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                Completed
              </Button>
            ) : (
              <Button
                className="bg-teal-600 hover:bg-teal-700"
                onClick={() => document.getElementById("prescription-form")?.scrollIntoView({ behavior: "smooth" })}
              >
                <FileText className="mr-2 h-4 w-4" />
                Add Prescription
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {patient.age} years • {patient.gender}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <p className="text-sm font-medium">Medical History</p>
                <ul className="text-sm space-y-1">
                  {patient.medicalHistory.map((item, index) => (
                    <li key={index} className="text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <p className="text-sm font-medium">Contact</p>
                <p className="text-sm text-muted-foreground">{patient.contact}</p>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <p className="text-sm font-medium">Blood Group</p>
                <p className="text-sm text-muted-foreground">{patient.bloodGroup}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Report Details</CardTitle>
                <CardDescription>Health report submitted by caretaker</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                  <span className="text-sm font-medium text-amber-500">
                    {report.verified ? "Verified" : "Pending Verification"}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Symptoms</h3>
                <p className="text-muted-foreground text-sm">{report.symptoms}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">AI Analysis</h3>
                <p className="text-muted-foreground text-sm">{report.detailedAnalysis}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Generated by our AI model</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="precautions">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="precautions">Precautions</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
              </TabsList>

              <TabsContent value="precautions">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Recommended Precautions</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {report.precautions.map((precaution, index) => (
                      <li key={index}>{precaution}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="predictions">
                <div>
                  <h3 className="text-lg font-semibold mb-2">AI Predictions</h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800 mb-1">For Doctor's Reference Only</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          {report.predictions.map((prediction, index) => (
                            <li key={index}>{prediction}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {report.verified ? (
          prescription ? (
            <Card>
              <CardHeader>
                <CardTitle>Prescription Details</CardTitle>
                <CardDescription>Prescription created for this report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg divide-y">
                    {prescription.medicines.map((medicine, index) => (
                      <div key={index} className="p-4 grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium">Name</p>
                          <p>{medicine.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Dosage</p>
                          <p>{medicine.dosage}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Frequency</p>
                          <p>{medicine.frequency}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p>{medicine.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prescribed on {new Date(prescription.createdAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Prescription</CardTitle>
                <CardDescription>No prescription found for this report</CardDescription>
              </CardHeader>
            </Card>
          )
        ) : (
          <Card id="prescription-form">
            <CardHeader>
              <CardTitle>Create Prescription</CardTitle>
              <CardDescription>Provide your diagnosis and prescription</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Textarea 
                    id="diagnosis" 
                    placeholder="Enter your diagnosis based on the report" 
                    rows={3} 
                    required
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Medications</Label>
                  {medicines.map((medicine, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-4">
                        <Label htmlFor={`medicine-name-${index}`}>Name</Label>
                        <Input
                          id={`medicine-name-${index}`}
                          placeholder="Medicine name"
                          value={medicine.name}
                          onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor={`medicine-dosage-${index}`}>Dosage</Label>
                        <Input
                          id={`medicine-dosage-${index}`}
                          placeholder="e.g., 500mg"
                          value={medicine.dosage}
                          onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <Label htmlFor={`medicine-frequency-${index}`}>Frequency</Label>
                        <Input
                          id={`medicine-frequency-${index}`}
                          placeholder="e.g., Twice daily"
                          value={medicine.frequency}
                          onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor={`medicine-duration-${index}`}>Duration</Label>
                        <Input
                          id={`medicine-duration-${index}`}
                          placeholder="e.g., 7 days"
                          value={medicine.duration}
                          onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-span-1">
                        {medicines.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMedicine(index)}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddMedicine}
                  >
                    + Add Another Medicine
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea 
                    id="instructions" 
                    placeholder="Any special instructions for the caretaker" 
                    rows={3}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="follow-up">Follow-up Recommendation</Label>
                  <Input 
                    id="follow-up" 
                    placeholder="e.g., Follow up in 2 weeks"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.push("/doctor/evaluation")}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Send className="mr-2 h-4 w-4 animate-pulse" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Prescription
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}