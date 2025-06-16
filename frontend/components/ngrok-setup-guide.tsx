"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Terminal, Globe, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function NgrokSetupGuide() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const commands = [
    {
      id: "install",
      title: "1. Install ngrok",
      command: "brew install ngrok",
      description: "Install ngrok using Homebrew (macOS)",
    },
    {
      id: "run",
      title: "2. Start ngrok tunnel",
      command: "ngrok http 5001",
      description: "Create a public tunnel to your Flask server",
    },
    {
      id: "env",
      title: "3. Update environment variable",
      command: "NEXT_PUBLIC_API_URL=https://your-ngrok-url.ngrok.io",
      description: "Replace with the HTTPS URL from ngrok output",
    },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-purple-500" />
          <span>Setup ngrok for v0 Preview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Badge className="bg-blue-500">Info</Badge>
            <span className="text-sm font-medium">Why do I need ngrok?</span>
          </div>
          <p className="text-sm text-gray-700">
            v0 runs in a sandboxed environment and cannot access localhost URLs. ngrok creates a secure tunnel that
            makes your local Flask server accessible from the internet.
          </p>
        </div>

        <div className="space-y-4">
          {commands.map((cmd) => (
            <div key={cmd.id} className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">{cmd.title}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(cmd.command, cmd.id)}
                  className="h-8 px-2"
                >
                  {copied === cmd.id ? (
                    <span className="text-green-600 text-xs">Copied!</span>
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm flex items-center space-x-2">
                <Terminal className="w-4 h-4 flex-shrink-0" />
                <code className="flex-1">{cmd.command}</code>
              </div>
              <p className="text-xs text-gray-600 mt-2">{cmd.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-green-50 border border-green-200 rounded p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Badge className="bg-green-500">Success</Badge>
            <span className="text-sm font-medium">After setup</span>
          </div>
          <p className="text-sm text-gray-700">Once ngrok is running, you'll see output like:</p>
          <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs mt-2">
            Forwarding https://abc123.ngrok.io → http://localhost:5001
          </div>
          <p className="text-sm text-gray-700 mt-2">
            Use the HTTPS URL (https://abc123.ngrok.io) as your NEXT_PUBLIC_API_URL.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
