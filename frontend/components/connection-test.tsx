"use client"

import { useState, useEffect } from "react"
import { ProductAPI } from "../services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

export function ConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<"testing" | "connected" | "failed" | "idle">("idle")
  const [apiUrl, setApiUrl] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001")
  }, [])

  const testConnection = async () => {
    setConnectionStatus("testing")
    setError("")

    try {
      const isConnected = await ProductAPI.testConnection()

      if (isConnected) {
        setConnectionStatus("connected")
      } else {
        setConnectionStatus("failed")
        setError("Flask server is not responding or returned an error")
      }
    } catch (err) {
      setConnectionStatus("failed")
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "testing":
        return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case "testing":
        return <Badge className="bg-blue-500">Testing...</Badge>
      case "connected":
        return <Badge className="bg-green-500">Connected</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      default:
        return <Badge className="bg-gray-500">Not tested</Badge>
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getStatusIcon()}
          <span>Flask API Connection</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-gray-600 mb-2">API URL:</div>
          <div className="text-sm font-mono bg-gray-100 p-2 rounded break-all">{apiUrl}</div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Status:</span>
          {getStatusBadge()}
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        <Button onClick={testConnection} disabled={connectionStatus === "testing"} className="w-full">
          {connectionStatus === "testing" ? "Testing..." : "Test Connection"}
        </Button>

        {connectionStatus === "failed" && (
          <div className="text-xs text-gray-600 space-y-1">
            <div>
              <strong>Troubleshooting:</strong>
            </div>
            <div>1. Make sure Flask server is running on the correct port</div>
            <div>2. Check if CORS is enabled in Flask</div>
            <div>3. Verify the API_URL environment variable</div>
            <div>4. Check browser console for detailed errors</div>
            <div>
              5. Test the API directly: <code>curl {apiUrl}/api/merchants</code>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
