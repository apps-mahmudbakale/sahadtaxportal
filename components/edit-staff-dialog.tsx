"use client"

import { useState, useEffect } from "react"
import { Edit2, Save, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

interface StaffRecord {
  id: string
  staff_id: string
  name: string
  department: string | null
  national_tin: string | null
  fct_irs_tax_id: string | null
  status: "pending" | "approved" | "rejected"
  submitted_at: string | null
}

interface EditStaffDialogProps {
  record: StaffRecord
  onSuccess: () => void
}

export function EditStaffDialog({ record, onSuccess }: EditStaffDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    staff_id: record.staff_id,
    name: record.name,
    department: record.department || '',
    national_tin: record.national_tin || '',
    fct_irs_tax_id: record.fct_irs_tax_id || '',
    status: record.status
  })
  const [error, setError] = useState('')

  // Reset form when record changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        staff_id: record.staff_id,
        name: record.name,
        department: record.department || '',
        national_tin: record.national_tin || '',
        fct_irs_tax_id: record.fct_irs_tax_id || '',
        status: record.status
      })
      setError('')
    }
  }, [open, record])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.staff_id.trim() || !formData.name.trim()) {
      setError('Staff ID and name are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/records', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recordId: record.id,
          staff_id: formData.staff_id.trim(),
          name: formData.name.trim(),
          department: formData.department.trim() || null,
          national_tin: formData.national_tin.trim() || null,
          fct_irs_tax_id: formData.fct_irs_tax_id.trim() || null,
          status: formData.status
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update record')
        return
      }

      setOpen(false)
      onSuccess()
    } catch (err) {
      setError('Network error - please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 h-8"
        >
          <Edit2 className="size-3" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Staff Record</DialogTitle>
          <DialogDescription>
            Update the staff member's information and tax IDs.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staff_id">Staff ID</Label>
              <Input
                id="staff_id"
                value={formData.staff_id}
                onChange={(e) => handleInputChange('staff_id', e.target.value)}
                placeholder="Any staff identifier"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Dr. John Doe"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department (Optional)</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              placeholder="Cardiology"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="national_tin">National TIN</Label>
            <Input
              id="national_tin"
              value={formData.national_tin}
              onChange={(e) => handleInputChange('national_tin', e.target.value)}
              placeholder="TIN12345678"
              disabled={loading}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fct_irs_tax_id">FCT-IRS Tax ID</Label>
            <Input
              id="fct_irs_tax_id"
              value={formData.fct_irs_tax_id}
              onChange={(e) => handleInputChange('fct_irs_tax_id', e.target.value)}
              placeholder="FCT87654321"
              disabled={loading}
              className="font-mono"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              <X className="size-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Spinner className="size-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}