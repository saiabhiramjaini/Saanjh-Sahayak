"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "../../../components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Upload,
  FileText,
  CheckCircle2,
  ChevronRight,
  Clock,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Patient {
  id: number;
  name: string;
}

interface ReportData {
  symptoms: string;
  detailedAnalysis: string;
  precautions: string[];
  typeOfDoctors: string;
  predictions: string[];
  patientId: number;
  caretakerId: number;
  doctorId: number;
  verified: boolean;
}

export default function UploadReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [fetchStatus, setFetchStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    const fetchPatients = async () => {
      setFetchStatus("loading");
      try {
        const userDataString = localStorage.getItem("user");
        if (!userDataString) {
          toast.error("User data not found. Please log in again.");
          setFetchStatus("error");
          return;
        }

        const userData = JSON.parse(userDataString);
        const caretakerId = userData.id;

        if (!caretakerId) {
          toast.error("Caretaker ID not found in user data");
          setFetchStatus("error");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/patient/caretaker/${caretakerId}`
        );

        if (response.data && Array.isArray(response.data.patients)) {
          setPatients(response.data.patients);
          setFetchStatus("success");
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to load patients. Please try again later.");
        setFetchStatus("error");
      }
    };

    fetchPatients();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const generateMockAnalysis = (symptoms: string) => {
    return {
      detailedAnalysis: `Based on the symptoms "${symptoms}", our analysis suggests a mild viral infection. The patient should be monitored for fever and hydration levels.`,
      precautions: [
        "Maintain proper hydration with electrolyte solutions",
        "Monitor temperature every 4-6 hours",
        "Provide adequate rest",
        "Use acetaminophen for fever if needed",
      ],
      typeOfDoctors: "General Physician",
      predictions: [
        "Likely to improve within 3-5 days with proper care",
        "Potential for mild fever in the first 48 hours",
      ],
    };
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()

  //   if (!selectedPatient) {
  //     toast.error("Please select a patient")
  //     return
  //   }

  //   if (!symptoms) {
  //     toast.error("Please describe the symptoms")
  //     return
  //   }

  //   const userDataString = localStorage.getItem('user')
  //   const doctorId = localStorage.getItem('assignedDoctorId')

  //   if (!userDataString || !doctorId) {
  //     toast.error("User information missing. Please log in again.")
  //     return
  //   }

  //   const userData = JSON.parse(userDataString)
  //   const caretakerId = userData.id

  //   setLoading(true)

  //   try {
  //     const analysis = generateMockAnalysis(symptoms)

  //     const reportPayload: ReportData = {
  //       symptoms,
  //       ...analysis,
  //       patientId: parseInt(selectedPatient),
  //       caretakerId: parseInt(caretakerId),
  //       doctorId: parseInt(doctorId),
  //       verified: false
  //     }

  //     setReportData(reportPayload)
  //     await axios.post(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reports/create`,
  //       reportPayload
  //     )

  //     setSubmitted(true)
  //     toast.success("Report submitted successfully!")
  //   } catch (error) {
  //     console.error("Error submitting report:", error)
  //     toast.error("Failed to submit report. Please try again.")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      toast.error("Please select a patient");
      return;
    }

    if (!symptoms) {
      toast.error("Please describe the symptoms");
      return;
    }

    const userDataString = localStorage.getItem("user");
    const doctorId = localStorage.getItem("assignedDoctorId");

    if (!userDataString || !doctorId) {
      toast.error("User information missing. Please log in again.");
      return;
    }

    const userData = JSON.parse(userDataString);
    const caretakerId = userData.id;

    setLoading(true);

    try {
      let formData = new FormData();
      if (file) {
        formData.append("file", file);
      }

      // Make the request to the Flask backend
      const aiResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_FLASK_URL}/report`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("AI Response:", aiResponse.data);

      // Extract the analysis data from the response
      const analysis = aiResponse.data;

      const reportPayload = {
        symptoms,
        detailedAnalysis: analysis.detailedAnalysis,
        precautions: analysis.precautions,
        typeOfDoctors: analysis.typeOfDoctors,
        predictions: analysis.predictions,
        patientId: parseInt(selectedPatient),
        caretakerId: parseInt(caretakerId),
        doctorId: parseInt(doctorId),
        verified: false,
      };

      console.log("Submitting report:", reportPayload);

      setReportData(reportPayload);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reports/create`,
        reportPayload
      );

      setSubmitted(true);
      toast.success("Report submitted successfully!");
    } catch (error) {
      console.error("Error submitting report:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to submit report");
      } else {
        toast.error("Failed to submit report. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="caretaker" currentPath="/caretaker/upload-report">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Upload Health Report</h1>
          <p className="text-gray-500">
            Submit a patient health report for analysis
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className={`flex items-center gap-2 ${
              !submitted ? "text-teal-600 font-medium" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                !submitted ? "bg-teal-100" : "bg-gray-100"
              }`}
            >
              1
            </div>
            <span>Report Details</span>
          </div>

          <ChevronRight className="h-5 w-5 text-gray-400" />

          <div
            className={`flex items-center gap-2 ${
              submitted ? "text-teal-600 font-medium" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                submitted ? "bg-teal-100" : "bg-gray-100"
              }`}
            >
              2
            </div>
            <span>Analysis Results</span>
          </div>
        </div>

        {!submitted ? (
          <Card className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Patient Health Report</CardTitle>
                <CardDescription>
                  Enter the patient details and symptoms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Select Patient *</Label>
                    {fetchStatus === "loading" ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading patients...
                      </div>
                    ) : fetchStatus === "error" ? (
                      <div className="text-sm text-red-500">
                        Could not load patients. Please refresh the page.
                      </div>
                    ) : (
                      <Select
                        required
                        value={selectedPatient}
                        onValueChange={setSelectedPatient}
                      >
                        <SelectTrigger id="patient">
                          <SelectValue
                            placeholder={
                              patients.length > 0
                                ? "Select a patient"
                                : "No patients available"
                            }
                          />
                        </SelectTrigger>
                        {patients.length > 0 && (
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem
                                key={patient.id}
                                value={patient.id.toString()}
                              >
                                {patient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        )}
                      </Select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms *</Label>
                    <Textarea
                      id="symptoms"
                      placeholder="Describe the patient's symptoms in detail"
                      rows={4}
                      required
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Medical Reports (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors ">
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <div className="w-full flex flex-col items-center justify-center gap-2">
                          <Upload className="h-8 w-8 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            {file
                              ? file.name
                              : "Click to upload or drag and drop"}
                          </p>
                          <p className="text-xs text-gray-400">
                            PDF, JPG, or PNG (max 5MB)
                          </p>
                          {/* <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            className="mt-2"
                          >
                            Select File
                          </Button> */}
                        </div>
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t px-6 py-4">
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 min-w-[150px]"
                  disabled={loading || patients.length === 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Submit Report
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <CardTitle>Analysis Complete</CardTitle>
              </div>
              <CardDescription>
                The patient's health report has been analyzed and saved
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Detailed Analysis
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700">
                    {reportData?.detailedAnalysis}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Recommended Precautions
                  </h3>
                  <ul className="space-y-2">
                    {reportData?.precautions.map((precaution, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-2 w-2 mt-2 rounded-full bg-teal-500"></div>
                        <p className="text-gray-700">{precaution}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-teal-50 p-4 rounded-md border border-teal-100">
                <h3 className="text-lg font-semibold mb-1 text-teal-800">
                  Recommended Specialist
                </h3>
                <p className="text-teal-700 font-medium">
                  {reportData?.typeOfDoctors}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 border-t px-6 py-4 bg-blue-50/50">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800">
                    Analysis submitted for doctor review
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please follow the recommended precautions while awaiting
                    verification.
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
