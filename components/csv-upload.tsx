"use client"

import { useState, useRef } from "react"
import { Upload, FileText, CheckCircle2, AlertCircle, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface UploadResult {
  success: boolean
  message?: string
  error?: string
  details?: string[] | string
  inserted?: number
  records?: number
}

export function CsvUpload({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload-staff', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          inserted: data.inserted,
          records: data.records
        })
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

        // Notify parent component
        onUploadSuccess?.()
      } else {
        setResult({
          success: false,
          error: data.error,
          details: data.details
        })
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Network error'
      })
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    // Use the static template file
    const link = document.createElement('a')
    link.href = '/staff-template.csv'
    link.download = 'staff-template.csv'
    link.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="size-5" />
          Upload Staff CSV
        </CardTitle>
        <CardDescription>
          Upload a CSV file to bulk import or update staff records
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={downloadTemplate}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Download className="size-4" />
            Download Template
          </Button>
          <span className="text-xs text-slate-500">
            Use this template to format your CSV file
          </span>
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className={`cursor-pointer ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <div className="flex flex-col items-center gap-2">
              {uploading ? (
                <Spinner className="size-8 text-green-600" />
              ) : (
                <FileText className="size-8 text-slate-400" />
              )}
              <div>
                <p className="font-medium text-slate-700">
                  {uploading ? 'Uploading...' : 'Click to select CSV file'}
                </p>
                <p className="text-sm text-slate-500">
                  Required columns: staff_id, name
                </p>
              </div>
            </div>
          </label>
        </div>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-2">
              {result.success ? (
                <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? 'Upload Successful!' : 'Upload Failed'}
                </p>
                
                {result.message && (
                  <p className={`text-sm mt-1 ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message}
                  </p>
                )}

                {result.success && result.inserted !== undefined && (
                  <p className="text-sm text-green-700 mt-1">
                    Processed {result.records} records, inserted/updated {result.inserted} records
                  </p>
                )}

                {result.error && (
                  <p className="text-sm text-red-700 mt-1">
                    {result.error}
                  </p>
                )}

                {result.details && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-slate-600 mb-1">Details:</p>
                    {Array.isArray(result.details) ? (
                      <ul className="text-xs text-slate-600 space-y-0.5">
                        {result.details.slice(0, 10).map((detail, index) => (
                          <li key={index}>• {detail}</li>
                        ))}
                        {result.details.length > 10 && (
                          <li>• ... and {result.details.length - 10} more errors</li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-600">{result.details}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-slate-500 space-y-1">
          <p><strong>CSV Format Requirements:</strong></p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li><strong>staff_id:</strong> Any staff identifier (required)</li>
            <li><strong>name:</strong> Full name (required)</li>
            <li><strong>department:</strong> Department name (optional)</li>
            <li><strong>national_tin:</strong> National TIN (optional)</li>
            <li><strong>fct_irs_tax_id:</strong> FCT-IRS Tax ID (optional)</li>
          </ul>
          <p className="mt-2">
            <strong>Note:</strong> Existing records with the same staff_id will be updated.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}