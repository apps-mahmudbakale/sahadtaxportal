"use client"

import { useState } from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface StaffRecord {
  id: string
  staff_id: string
  name: string
  department: string | null
}

interface DeleteStaffDialogProps {
  record: StaffRecord
  onSuccess: () => void
}

export function DeleteStaffDialog({ record, onSuccess }: DeleteStaffDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/records?id=${record.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to delete record')
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
          className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 h-8"
        >
          <Trash2 className="size-3" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-600" />
            Delete Staff Record
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the staff record.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-slate-50 p-4 rounded-lg border">
          <div className="space-y-1">
            <p className="text-sm"><strong>Staff ID:</strong> {record.staff_id}</p>
            <p className="text-sm"><strong>Name:</strong> {record.name}</p>
            <p className="text-sm"><strong>Department:</strong> {record.department || "Not specified"}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <>
                <Spinner className="size-4" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete Record
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}