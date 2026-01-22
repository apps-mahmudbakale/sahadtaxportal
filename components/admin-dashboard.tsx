"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  Users,
  FileText,
  Building2,
  Filter,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
<<<<<<< HEAD
import { CsvUpload } from "@/components/csv-upload"
import { EditStaffDialog } from "@/components/edit-staff-dialog"
import { DeleteStaffDialog } from "@/components/delete-staff-dialog"
import { AddStaffDialog } from "@/components/add-staff-dialog"
import { Pagination } from "@/components/ui/pagination"
=======
>>>>>>> c93b3de1978b096cea92e2e13d8bdfa10f6c38cd
import Image from "next/image"

interface StaffRecord {
  id: string
  staffId: string
  name: string
<<<<<<< HEAD
  department: string | null
  national_tin: string | null
  fct_irs_tax_id: string | null
  status: "pending" | "approved" | "rejected"
  submitted_at: string | null
  has_submitted: boolean
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
=======
  department: string
  nationalTin: string
  fctIrsTaxId: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
>>>>>>> c93b3de1978b096cea92e2e13d8bdfa10f6c38cd
}

// Mock submitted records
const mockRecords: StaffRecord[] = [
  {
    id: "1",
    staffId: "SH002",
    name: "Nurse Chidi Okonkwo",
    department: "Emergency Medicine",
    nationalTin: "TIN12345678",
    fctIrsTaxId: "FCT87654321",
    status: "pending",
    submittedAt: "2026-01-20T14:30:00Z",
  },
  {
    id: "2",
    staffId: "SH015",
    name: "Dr. Aisha Bello",
    department: "Orthopedics",
    nationalTin: "TIN98765432",
    fctIrsTaxId: "FCT12345678",
    status: "approved",
    submittedAt: "2026-01-19T10:15:00Z",
  },
  {
    id: "3",
    staffId: "SH023",
    name: "Mr. Emmanuel Adeyemi",
    department: "Radiology",
    nationalTin: "TIN55667788",
    fctIrsTaxId: "FCT99887766",
    status: "pending",
    submittedAt: "2026-01-18T16:45:00Z",
  },
  {
    id: "4",
    staffId: "SH008",
    name: "Dr. Halima Musa",
    department: "Pediatrics",
    nationalTin: "TIN11223344",
    fctIrsTaxId: "FCT44332211",
    status: "approved",
    submittedAt: "2026-01-17T09:00:00Z",
  },
  {
    id: "5",
    staffId: "SH031",
    name: "Nurse Grace Eze",
    department: "Cardiology",
    nationalTin: "TIN77889900",
    fctIrsTaxId: "",
    status: "rejected",
    submittedAt: "2026-01-16T11:30:00Z",
  },
]

type FilterStatus = "all" | "pending" | "approved" | "rejected"

export function AdminDashboard() {
  const [records, setRecords] = useState<StaffRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
<<<<<<< HEAD
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const router = useRouter()
=======
>>>>>>> c93b3de1978b096cea92e2e13d8bdfa10f6c38cd

  useEffect(() => {
    loadRecords()
  }, [])

  const loadRecords = async (page: number = currentPage, limit: number = pageSize) => {
    setLoading(true)
<<<<<<< HEAD
    
    try {
      const response = await fetch(`/api/admin/records?page=${page}&limit=${limit}`)
      const data = await response.json()

      if (!response.ok) {
        console.error('Error loading records:', data.error)
        if (response.status === 401) {
          // Unauthorized - redirect to login
          router.push('/admin')
        }
        return
      }

      setRecords(data.records || [])
      setPagination(data.pagination || {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      })
    } catch (err) {
      console.error('Error loading records:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    loadRecords(page, pageSize)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
    loadRecords(1, size)
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      if (response.ok) {
        router.push('/admin')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even if API fails
      router.push('/admin')
    }
=======
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    /*
     * SUPABASE INTEGRATION POINT:
     * Replace with:
     *
     * const { data, error } = await supabase
     *   .from('staff')
     *   .select('*')
     *   .not('national_tin', 'is', null)
     *   .order('submitted_at', { ascending: false })
     *
     * if (data) {
     *   setRecords(data)
     * }
     */

    setRecords(mockRecords)
    setLoading(false)
  }

  const updateStatus = async (recordId: string, newStatus: "approved" | "rejected") => {
    /*
     * SUPABASE INTEGRATION POINT:
     * Replace with:
     *
     * const { error } = await supabase
     *   .from('staff')
     *   .update({ status: newStatus, reviewed_at: new Date().toISOString() })
     *   .eq('id', recordId)
     */

    setRecords((prev) =>
      prev.map((record) =>
        record.id === recordId ? { ...record, status: newStatus } : record
      )
    )
>>>>>>> c93b3de1978b096cea92e2e13d8bdfa10f6c38cd
  }

  // Client-side filtering for current page data
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
<<<<<<< HEAD
      record.staff_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.department || '').toLowerCase().includes(searchQuery.toLowerCase())
=======
      record.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.department.toLowerCase().includes(searchQuery.toLowerCase())
>>>>>>> c93b3de1978b096cea92e2e13d8bdfa10f6c38cd

    const matchesFilter =
      filterStatus === "all" || record.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const stats = {
    total: pagination.total,
    pending: records.filter((r) => r.status === "pending").length,
    approved: records.filter((r) => r.status === "approved").length,
    rejected: records.filter((r) => r.status === "rejected").length,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const exportToCSV = () => {
    const headers = ["Staff ID", "Name", "Department", "National TIN", "FCT-IRS Tax ID", "Status", "Submitted At"]
    const csvContent = [
      headers.join(","),
      ...filteredRecords.map((record) =>
        [
          record.staffId,
          `"${record.name}"`,
<<<<<<< HEAD
          record.department || "",
          record.national_tin || "",
          record.fct_irs_tax_id || "",
=======
          record.department,
          record.nationalTin,
          record.fctIrsTaxId,
>>>>>>> c93b3de1978b096cea92e2e13d8bdfa10f6c38cd
          record.status,
          formatDate(record.submittedAt),
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `tax-id-records-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white text-slate-800 py-4 px-4 shadow-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative size-10 rounded-lg overflow-hidden bg-white p-1 border border-slate-200">
              <Image
                src="/sahad-logo.png"
                alt="Sahad Hospitals Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-800">Sahad Hospitals</h1>
              <p className="text-slate-600 text-sm">Tax ID Admin Portal</p>
            </div>
          </div>
<<<<<<< HEAD
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-green-600 hover:text-green-700 text-sm underline underline-offset-2"
            >
              Staff Portal
            </a>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-transparent border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-800"
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
=======
          <a
            href="/"
            className="text-teal-200 hover:text-white text-sm underline underline-offset-2"
          >
            Staff Portal
          </a>
>>>>>>> c93b3de1978b096cea92e2e13d8bdfa10f6c38cd
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* CSV Upload Section */}
          <CsvUpload onUploadSuccess={() => loadRecords(currentPage, pageSize)} />

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Users className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                    <p className="text-sm text-slate-500">Total Records</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="size-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{stats.pending}</p>
                    <p className="text-sm text-slate-500">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{stats.approved}</p>
                    <p className="text-sm text-slate-500">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <FileText className="size-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{stats.rejected}</p>
                    <p className="text-sm text-slate-500">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Records Table Card */}
          <Card className="border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg text-slate-800">Staff Records</CardTitle>
                  <CardDescription>
                    Manage all staff records and tax ID submissions
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      placeholder="Search by name, ID, or dept..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-full sm:w-64 border-slate-200"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-transparent border-slate-200 text-slate-700">
                        <Filter className="size-4" />
                        {filterStatus === "all" ? "All Status" : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                        <ChevronDown className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                        All Status
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("approved")}>
                        Approved
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("rejected")}>
                        Rejected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="outline"
                    onClick={() => loadRecords(currentPage, pageSize)}
                    className="bg-transparent border-slate-200 text-slate-700"
                  >
                    <RefreshCw className="size-4" />
                    <span className="hidden sm:inline">Refresh</span>
                  </Button>
                  <Button
                    onClick={exportToCSV}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="size-4" />
                    <span className="hidden sm:inline">Export CSV</span>
                  </Button>
                  <AddStaffDialog onSuccess={() => loadRecords(currentPage, pageSize)} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner className="size-8 text-green-600" />
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <FileText className="size-12 mx-auto mb-3 text-slate-300" />
                  <p>No records found</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-6">
                  <div className="min-w-[800px] px-6">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-200">
                          <TableHead className="text-slate-600">Staff ID</TableHead>
                          <TableHead className="text-slate-600">Name</TableHead>
                          <TableHead className="text-slate-600">Department</TableHead>
                          <TableHead className="text-slate-600">National TIN</TableHead>
                          <TableHead className="text-slate-600">FCT-IRS ID</TableHead>
                          <TableHead className="text-slate-600">Status</TableHead>
                          <TableHead className="text-slate-600">Submitted</TableHead>
                          <TableHead className="text-slate-600 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map((record) => (
                          <TableRow key={record.id} className="border-slate-100">
                            <TableCell className="font-mono text-sm text-slate-700">
                              {record.staffId}
                            </TableCell>
                            <TableCell className="font-medium text-slate-800">
                              {record.name}
                            </TableCell>
                            <TableCell className="text-slate-600">
                              {record.department || "-"}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-slate-700">
                              {record.nationalTin || "-"}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-slate-700">
                              {record.fctIrsTaxId || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  record.status === "approved"
                                    ? "default"
                                    : record.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className={
                                  record.status === "approved"
                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                    : record.status === "pending"
                                      ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                      : "bg-red-100 text-red-700 hover:bg-red-100"
                                }
                              >
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-slate-500">
                              {formatDate(record.submittedAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <EditStaffDialog 
                                  record={record} 
                                  onSuccess={() => loadRecords(currentPage, pageSize)}
                                />
                                <DeleteStaffDialog 
                                  record={record} 
                                  onSuccess={() => loadRecords(currentPage, pageSize)}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
            
            {/* Pagination */}
            {!loading && records.length > 0 && (
              <div className="px-6 pb-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  pageSize={pagination.limit}
                  totalItems={pagination.total}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-slate-400 border-t border-slate-200 bg-white">
        <p>Sahad Hospitals HR Department - Admin Portal</p>
      </footer>
    </div>
  )
}
