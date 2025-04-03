"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useRouter } from "next/navigation"

interface Report {
  id: number
  patientId: number
  patient: {
    name: string
    age?: number
  }
  detailedAnalysis: string
  verified: boolean
  createdAt: string
}

export default function EvaluationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const reportsPerPage = 10
  const router = useRouter()

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Get and validate user data from localStorage
        const userDataStr = localStorage.getItem('user')
        if (!userDataStr) {
          throw new Error('Please sign in to access evaluations')
        }
        
        const userData = JSON.parse(userDataStr)
        if (!userData.id || userData.role !== 'doctor') {
          throw new Error('Invalid user data. Please sign in again')
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reports/doctor/${userData.id}`)
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Session expired. Please sign in again')
          }
          throw new Error(`Failed to fetch reports: ${response.statusText}`)
        }
        
        const data = await response.json()
        if (!data.reports) {
          throw new Error('Invalid response: Missing reports data')
        }
        
        setReports(data.reports)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
        setError(errorMessage)
        
        // Handle authentication errors
        if (errorMessage.includes('sign in')) {
          localStorage.removeItem('user') // Clear invalid data
          router.push('/signin')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const processedReports = reports.map(report => ({
    id: report.id,
    patient: report.patient.name,
    age: report.patient.age || 0,
    date: new Date(report.createdAt).toISOString().split('T')[0],
    status: report.verified ? "Reviewed" : "Pending",
    detailedAnalysis: report.detailedAnalysis
  }))

  const filteredReports = processedReports.filter(
    (report) =>
      report.patient.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === "all" || report.status.toLowerCase() === statusFilter),
  )

  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport)
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Pending</span>
      case "Reviewed":
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Reviewed</span>
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="doctor" currentPath="/doctor/evaluation">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <p>Loading reports...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout role="doctor" currentPath="/doctor/evaluation">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="doctor" currentPath="/doctor/evaluation">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Patient Evaluations</h1>
            <p className="text-gray-500">Review and evaluate patient health reports</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-7">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentReports.length > 0 ? (
                  currentReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.patient}
                      </TableCell>
                      <TableCell className="text-center">{report.date}</TableCell>
                      <TableCell className="text-center">{getStatusBadge(report.status)}</TableCell>
                      <TableCell className="text-center">
                        <Link href={`/doctor/evaluation/${report.id}`}>
                          <Button
                            variant={report.status === "Pending" ? "default" : "outline"}
                            size="sm"
                            className={report.status === "Pending" ? "bg-teal-600 hover:bg-teal-700 hover:cursor-pointer" : "hover:cursor-pointer"}
                          >
                            {report.status === "Pending" ? "Review" : "View"}
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Showing {indexOfFirstReport + 1} to {Math.min(indexOfLastReport, filteredReports.length)} of{" "}
              {filteredReports.length} reports
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-teal-600 hover:bg-teal-700" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}