"use client"

import { useState, useEffect } from "react"
import { Search, CheckCircle2, Building2, User, FileText, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"

type Step = "search" | "loading" | "edit" | "success" | "already-submitted"

interface StaffData {
  id: string
  name: string
<<<<<<< HEAD
  department: string | null
  national_tin: string | null
  fct_irs_tax_id: string | null
  has_submitted: boolean
  status: string
=======
  department: string
  nationalTin: string
  fctIrsTaxId: string
  hasSubmitted: boolean
>>>>>>> c93b3de1978b096cea92e2e13d8bdfa10f6c38cd
}

// Mock staff database for demonstration
const mockStaffDatabase: Record<string, StaffData> = {
  "SH001": {
    id: "SH001",
    name: "Dr. Amina Ibrahim",
    department: "Cardiology",
    nationalTin: "",
    fctIrsTaxId: "",
    hasSubmitted: false,
  },
  "SH002": {
    id: "SH002",
    name: "Nurse Chidi Okonkwo",
    department: "Emergency Medicine",
    nationalTin: "TIN12345678",
    fctIrsTaxId: "FCT87654321",
    hasSubmitted: true,
  },
  "SH003": {
    id: "SH003",
    name: "Dr. Fatima Yusuf",
    department: "Pediatrics",
    nationalTin: "",
    fctIrsTaxId: "",
    hasSubmitted: false,
  },
}

// Track submitted IDs in session (in real app, this would be in the database)
const submittedIds = new Set<string>(["SH002"])

export function TaxIdPortal() {
  const [currentStep, setCurrentStep] = useState<Step>("search")
  const [staffId, setStaffId] = useState("")
  const [staffData, setStaffData] = useState<StaffData | null>(null)
  const [nationalTin, setNationalTin] = useState("")
  const [fctIrsTaxId, setFctIrsTaxId] = useState("")
  const [error, setError] = useState("")

  // Alphanumeric validation helper (now allows forward slash)
  const isValidStaffId = (value: string) => /^[a-zA-Z0-9\/\-]*$/.test(value)

  const handleInputChange = (
    value: string,
    setter: (val: string) => void,
    isStaffId: boolean = false
  ) => {
    if (isStaffId) {
      // For staff ID, allow alphanumeric, slash, and dash
      if (isValidStaffId(value)) {
        setter(value.toUpperCase())
      }
    } else {
      // For tax IDs, only alphanumeric
      if (/^[a-zA-Z0-9]*$/.test(value)) {
        setter(value.toUpperCase())
      }
    }
  }

  const handleSearch = async () => {
    if (!staffId.trim()) {
      setError("Please enter a Staff ID")
      return
    }

    setError("")
    setCurrentStep("loading")

<<<<<<< HEAD
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('id, staff_id, name, department, national_tin, fct_irs_tax_id, has_submitted, status')
        .eq('staff_id', staffId.trim().toUpperCase())
        .single()
=======
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
>>>>>>> c93b3de1978b096cea92e2e13d8bdfa10f6c38cd

    /*
     * SUPABASE INTEGRATION POINT:
     * Replace the mock lookup below with:
     *
     * const { data, error } = await supabase
     *   .from('staff')
     *   .select('id, name, department, national_tin, fct_irs_tax_id, has_submitted')
     *   .eq('staff_id', staffId.toUpperCase())
     *   .single()
     *
     * if (error || !data) {
     *   setError("Staff ID not found. Please check and try again.")
     *   setCurrentStep("search")
     *   return
     * }
     *
     * if (data.has_submitted) {
     *   setStaffData(data)
     *   setCurrentStep("already-submitted")
     *   return
     * }
     */

    const foundStaff = mockStaffDatabase[staffId.toUpperCase()]

    if (foundStaff) {
      setStaffData(foundStaff)
      
      // Check if already submitted
      if (submittedIds.has(staffId.toUpperCase()) || foundStaff.hasSubmitted) {
        setCurrentStep("already-submitted")
        return
      }
      
      setNationalTin(foundStaff.nationalTin)
      setFctIrsTaxId(foundStaff.fctIrsTaxId)
      setCurrentStep("edit")
    } else {
      setError("Staff ID not found. Please check and try again.")
      setCurrentStep("search")
    }
  }

  const handleUpdate = async () => {
    if (!nationalTin.trim() && !fctIrsTaxId.trim()) {
      setError("Please enter at least one Tax ID")
      return
    }

    setError("")
    setCurrentStep("loading")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    /*
     * SUPABASE INTEGRATION POINT:
     * Replace the mock update below with:
     *
     * const { error } = await supabase
     *   .from('staff')
     *   .update({
     *     national_tin: nationalTin,
     *     fct_irs_tax_id: fctIrsTaxId,
     *     has_submitted: true,
     *     submitted_at: new Date().toISOString()
     *   })
     *   .eq('staff_id', staffData?.id)
     *
     * if (error) {
     *   setError("Failed to update record. Please try again.")
     *   setCurrentStep("edit")
     *   return
     * }
     */

    // Mark as submitted in session
    if (staffData) {
      submittedIds.add(staffData.id)
    }

    setCurrentStep("success")
  }

  const handleReset = () => {
    setCurrentStep("search")
    setStaffId("")
    setStaffData(null)
    setNationalTin("")
    setFctIrsTaxId("")
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white text-slate-800 py-4 px-4 shadow-md border-b border-slate-200">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
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
            <p className="text-slate-600 text-sm">Tax ID Collection Portal</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-green-100">
          {/* Search Phase */}
          {currentStep === "search" && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-3 size-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Search className="size-6 text-green-600" />
                </div>
                <CardTitle className="text-xl text-slate-800">Staff Lookup</CardTitle>
                <CardDescription className="text-slate-500">
                  Enter your Staff ID to update your tax information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="staffId" className="text-slate-700">Staff ID</Label>
                  <Input
                    id="staffId"
                    placeholder="e.g., SH/STAFF001"
                    value={staffId}
                    onChange={(e) => handleInputChange(e.target.value, setStaffId, true)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="text-center text-lg tracking-wider border-slate-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                  />
                  {error && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  )}
                </div>
                <Button
                  onClick={handleSearch}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Search className="size-4" />
                  Search
                </Button>
                <p className="text-xs text-slate-400 text-center">
<<<<<<< HEAD
                  Demo IDs: SH/STAFF-A, SH/STAFF001, SH/STAFF002, etc.
=======
                  Demo IDs: SH001 (new), SH002 (already submitted), SH003 (new)
>>>>>>> c93b3de1978b096cea92e2e13d8bdfa10f6c38cd
                </p>
              </CardContent>
            </>
          )}

          {/* Loading Phase */}
          {currentStep === "loading" && (
            <CardContent className="py-16">
              <div className="flex flex-col items-center gap-4">
                <Spinner className="size-10 text-green-600" />
                <p className="text-slate-600 font-medium">Processing...</p>
              </div>
            </CardContent>
          )}

          {/* Already Submitted Phase */}
          {currentStep === "already-submitted" && staffData && (
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="size-10 text-amber-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-800">Already Submitted</h3>
                  <p className="text-slate-600">
                    Tax ID information for <span className="font-medium">{staffData.name}</span> has already been submitted and is pending management review.
                  </p>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="mt-4 border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent"
                >
                  Search Another Staff ID
                </Button>
              </div>
            </CardContent>
          )}

          {/* Edit Phase */}
          {currentStep === "edit" && staffData && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-3 size-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FileText className="size-6 text-green-600" />
                </div>
                <CardTitle className="text-xl text-slate-800">Update Tax Information</CardTitle>
                <CardDescription className="text-slate-500">
                  Please provide your tax identification numbers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Staff Info (Read-only) */}
                <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-slate-400" />
                    <span className="text-sm text-slate-500">Staff Name</span>
                  </div>
                  <p className="font-medium text-slate-800 pl-6">{staffData.name}</p>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Building2 className="size-4 text-slate-400" />
                    <span className="text-sm text-slate-500">Department</span>
                  </div>
                  <p className="font-medium text-slate-800 pl-6">{staffData.department || "Not specified"}</p>
                </div>

                {/* Tax ID Inputs */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nationalTin" className="text-slate-700">
                      National TIN (JTB)
                    </Label>
                    <Input
                      id="nationalTin"
                      placeholder="Enter your National TIN"
                      value={nationalTin}
                      onChange={(e) => handleInputChange(e.target.value, setNationalTin, false)}
                      className="border-slate-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                    />
                    <p className="text-xs text-slate-400">Alphanumeric characters only</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fctIrsTaxId" className="text-slate-700">
                      FCT-IRS Tax ID
                    </Label>
                    <Input
                      id="fctIrsTaxId"
                      placeholder="Enter your FCT-IRS Tax ID"
                      value={fctIrsTaxId}
                      onChange={(e) => handleInputChange(e.target.value, setFctIrsTaxId, false)}
                      className="border-slate-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                    />
                    <p className="text-xs text-slate-400">Alphanumeric characters only</p>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleUpdate}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Submit
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Success Phase */}
          {currentStep === "success" && (
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="size-10 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-800">Success!</h3>
                  <p className="text-slate-600">
                    Record Updated Successfully for Management Review.
                  </p>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="mt-4 border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent"
                >
                  Done
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-slate-400">
        <p>Sahad Hospitals HR Department</p>
        <a 
          href="/admin" 
          className="text-green-600 hover:text-green-700 underline underline-offset-2"
        >
          Admin Portal
        </a>
      </footer>
    </div>
  )
}
